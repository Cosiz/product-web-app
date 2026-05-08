"use server"

import { createClient } from "@/lib/database"
import { createFamilySchema, joinFamilySchema } from "@/lib/schemas"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { ZodError } from "zod"

export async function createFamily(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const name = formData.get("name")
  try {
    const parsed = createFamilySchema.parse({ name })
    const userId = user.id

    const { data: family, error: famErr } = await supabase
      .from("families")
      .insert({ name: parsed.name } as never)
      .select()
      .single()

    if (famErr) throw famErr

    await supabase.from("family_members").insert({
      family_id: family.id,
      user_id: userId,
      role: "commander",
      display_name: user.user_metadata?.display_name || user.email?.split("@")[0] || "Commander",
      status: "active",
    } as never)

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
  if (!user) redirect("/login")

  const raw = {
    invite_code: formData.get("invite_code"),
    display_name: formData.get("display_name"),
    role: formData.get("role") || "helper",
  }

  try {
    const data = joinFamilySchema.parse(raw)
    const userId = user.id

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
      .eq("user_id", userId)
      .single()

    if (existing) return { success: false, error: "You're already a member of this family" }

    await supabase.from("family_members").insert({
      family_id: family.id,
      user_id: userId,
      role: data.role,
      display_name: data.display_name,
      status: "active",
    } as never)

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
