"use server"

import { createClient } from "@/lib/database"
import { addChildSchema, updateLocationSchema } from "@/lib/schemas"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { ZodError } from "zod"

export async function addChild(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const raw = {
    display_name: formData.get("display_name"),
    school_name: formData.get("school_name") || undefined,
    school_gate: formData.get("school_gate") || undefined,
    pickup_code: formData.get("pickup_code") || undefined,
  }

  try {
    const data = addChildSchema.parse(raw)
    const userId = user.id

    const { data: member } = await supabase
      .from("family_members")
      .select("family_id")
      .eq("user_id", userId)
      .single()

    if (!member) return { success: false, error: "Not in a family" }

    const { error } = await supabase.from("children").insert({
      family_id: member.family_id,
      display_name: data.display_name,
      school_name: data.school_name ?? null,
      school_gate: data.school_gate ?? null,
      pickup_code: data.pickup_code ?? null,
    })

    if (error) throw error
    revalidatePath("/settings")
    return { success: true }
  } catch (e) {
    if (e instanceof ZodError) return { success: false, errors: e.flatten().fieldErrors }
    return { success: false, error: (e as Error).message }
  }
}

export async function updateLocation(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const raw = {
    latitude: Number(formData.get("latitude")),
    longitude: Number(formData.get("longitude")),
    accuracy: formData.get("accuracy") ? Number(formData.get("accuracy")) : undefined,
    battery_level: formData.get("battery_level") ? Number(formData.get("battery_level")) : undefined,
  }

  try {
    const data = updateLocationSchema.parse(raw)
    const userId = user.id

    const { data: member } = await supabase
      .from("family_members")
      .select("id")
      .eq("user_id", userId)
      .single()

    if (!member) return { success: false, error: "Not a family member" }

    const { error } = await supabase.from("locations").insert({
      family_member_id: member.id,
      latitude: data.latitude,
      longitude: data.longitude,
      accuracy: data.accuracy ?? null,
      battery_level: data.battery_level ?? null,
    })

    if (error) throw error
    revalidatePath("/map")
    return { success: true }
  } catch (e) {
    if (e instanceof ZodError) return { success: false, errors: e.flatten().fieldErrors }
    return { success: false, error: (e as Error).message }
  }
}

export async function checkInChild(childId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const userId = user.id
  const { data: member } = await supabase
    .from("family_members")
    .select("family_id")
    .eq("user_id", userId)
    .single()

  if (!member) return { success: false, error: "Not in a family" }

  const { error } = await supabase.from("activity_feed").insert({
    family_id: member.family_id,
    child_id: childId,
    event_type: "child_checkin",
    event_data: { timestamp: new Date().toISOString() },
    is_critical: false,
  })

  if (error) return { success: false, error: error.message }
  revalidatePath("/feed")
  revalidatePath("/dashboard")
  return { success: true }
}

export async function checkOutChild(childId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const userId = user.id
  const { data: member } = await supabase
    .from("family_members")
    .select("family_id")
    .eq("user_id", userId)
    .single()

  if (!member) return { success: false, error: "Not in a family" }

  const { error } = await supabase.from("activity_feed").insert({
    family_id: member.family_id,
    child_id: childId,
    event_type: "child_checkout",
    event_data: { timestamp: new Date().toISOString() },
    is_critical: false,
  })

  if (error) return { success: false, error: error.message }
  revalidatePath("/feed")
  revalidatePath("/dashboard")
  return { success: true }
}
