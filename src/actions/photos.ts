"use server"

import { createClient } from "@/lib/database"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function uploadPhoto(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const file = formData.get("file") as File | null
  if (!file) return { success: false, error: "No file provided" }

  const MAX_SIZE = 10 * 1024 * 1024 // 10MB
  if (file.size > MAX_SIZE) return { success: false, error: "File too large. Maximum 10MB for photos." }

  const { data: member } = await supabase
    .from("family_members")
    .select("family_id")
    .eq("user_id", user.id)
    .single()

  if (!member) return { success: false, error: "Not in a family" }

  const ext = file.name.split(".").pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from("photos")
    .upload(fileName, file, { contentType: file.type })

  if (uploadError) return { success: false, error: "Upload failed. Please try again." }

  const { data: { publicUrl } } = supabase.storage
    .from("photos")
    .getPublicUrl(fileName)

  const caption = formData.get("caption") as string | null

  const { error: dbErr } = await supabase.from("photos").insert({
    family_id: member.family_id,
    uploaded_by: user.id,
    url: publicUrl,
    caption: caption || null,
    taken_at: new Date().toISOString(),
  })

  if (dbErr) return { success: false, error: "Database error" }

  revalidatePath("/album")
  revalidatePath("/feed")
  return { success: true }
}
