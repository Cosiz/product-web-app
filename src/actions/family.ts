"use server"

import { createClient } from "@/lib/database"
import { createFamilySchema, joinFamilySchema } from "@/lib/schemas"
import { revalidatePath } from "next/cache"
import { ZodError } from "zod"

export async function createFamily(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated" }

  const name = formData.get("name")
  try {
    const parsed = createFamilySchema.parse({ name })

    const { data: family, error: famErr } = await supabase
      .from("families")
      .insert({ name: parsed.name })
      .select("id")
      .single()

    if (famErr || !family) return { success: false, error: famErr?.message || "Failed to create family" }

    // Get display_name from auth.users
    const { data: authUser } = await supabase.from("users").select("display_name").eq("id", user.id).single()
    const displayName = authUser?.display_name || user.email?.split("@")[0] || "Commander"

    const { error: memberErr } = await supabase.from("family_members").insert({
      family_id: family.id,
      user_id: user.id,
      role: "commander",
      display_name: displayName,
      status: "active",
      can_receive_tasks: true,
      can_update_location: true,
    })

    if (memberErr) return { success: false, error: memberErr.message }

    revalidatePath("/dashboard")
    return { success: true, family_id: family.id }
  } catch (e) {
    if (e instanceof ZodError) return { success: false, errors: e.flatten().fieldErrors }
    return { success: false, error: (e as Error).message }
  }
}

export async function joinFamily(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated" }

  const raw = {
    invite_code: formData.get("invite_code"),
    display_name: formData.get("display_name"),
    role: (formData.get("role") || "helper") as string,
  }

  try {
    const data = joinFamilySchema.parse(raw)

    const { data: family, error: famErr } = await supabase
      .from("families")
      .select("id")
      .eq("invite_code", data.invite_code)
      .single()

    if (famErr || !family) return { success: false, error: "Invalid invite code" }

    const { data: existing } = await supabase
      .from("family_members")
      .select("id")
      .eq("family_id", family.id)
      .eq("user_id", user.id)
      .single()

    if (existing) return { success: false, error: "You are already a member of this family" }

    const { error: memberErr } = await supabase.from("family_members").insert({
      family_id: family.id,
      user_id: user.id,
      role: data.role,
      display_name: data.display_name,
      status: "active",
    })

    if (memberErr) return { success: false, error: memberErr.message }

    revalidatePath("/dashboard")
    return { success: true }
  } catch (e) {
    if (e instanceof ZodError) return { success: false, errors: e.flatten().fieldErrors }
    return { success: false, error: (e as Error).message }
  }
}

export async function getFamilyByUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: member } = await supabase
    .from("family_members")
    .select("family_id, role")
    .eq("user_id", user.id)
    .single()

  if (!member) return null

  const { data: family } = await supabase
    .from("families")
    .select("*")
    .eq("id", member.family_id)
    .single()

  return family
}
