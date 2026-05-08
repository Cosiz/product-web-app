"use server"

import { createClient } from "@/lib/database"
import { createTaskSchema, updateTaskSchema } from "@/lib/schemas"
import { revalidatePath } from "next/cache"
import { ZodError } from "zod"

export async function createTask(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated" }

  const raw = {
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    priority: (formData.get("priority") || "medium") as string,
    assigned_to: formData.get("assigned_to") || undefined,
    child_id: formData.get("child_id") || undefined,
    due_date: formData.get("due_date") || undefined,
    location: formData.get("location") || undefined,
    location_lat: formData.get("location_lat") ? Number(formData.get("location_lat")) : undefined,
    location_lng: formData.get("location_lng") ? Number(formData.get("location_lng")) : undefined,
  }

  try {
    const data = createTaskSchema.parse(raw)

    // Get family_id from family_members
    const { data: member, error: memberErr } = await supabase
      .from("family_members")
      .select("id, family_id")
      .eq("user_id", user.id)
      .single()

    if (memberErr || !member) return { success: false, error: "Not a family member" }

    const insertData: Record<string, unknown> = {
      title: data.title,
      family_id: member.family_id,
      created_by: user.id,
      priority: data.priority,
    }
    if (data.description) insertData.description = data.description
    if (data.assigned_to) insertData.assigned_to = data.assigned_to
    if (data.child_id) insertData.child_id = data.child_id
    if (data.due_date) insertData.due_date = data.due_date
    if (data.location) insertData.location = data.location

    const { error } = await supabase.from("tasks").insert(insertData)
    if (error) return { success: false, error: error.message }

    await supabase.from("activity_feed").insert({
      family_id: member.family_id,
      actor_id: member.id,
      event_type: "task_created",
      event_data: { title: data.title },
    })

    revalidatePath("/tasks")
    revalidatePath("/dashboard")
    return { success: true }
  } catch (e) {
    if (e instanceof ZodError) return { success: false, errors: e.flatten().fieldErrors }
    return { success: false, error: (e as Error).message }
  }
}

export async function updateTaskStatus(taskId: string, status: "pending" | "in_progress" | "completed" | "cancelled") {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated" }

  const updates: Record<string, unknown> = { status }
  if (status === "completed") updates.completed_at = new Date().toISOString()

  const { error } = await supabase.from("tasks").update(updates).eq("id", taskId)
  if (error) return { success: false, error: error.message }

  const { data: member } = await supabase
    .from("family_members")
    .select("id, family_id")
    .eq("user_id", user.id)
    .single()

  if (member) {
    await supabase.from("activity_feed").insert({
      family_id: member.family_id,
      actor_id: member.id,
      event_type: status === "completed" ? "task_completed" : "task_updated",
      event_data: { task_id: taskId },
    })
  }

  revalidatePath("/tasks")
  revalidatePath("/dashboard")
  revalidatePath("/feed")
  return { success: true }
}

export async function deleteTask(taskId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated" }

  const { error } = await supabase.from("tasks").delete().eq("id", taskId)
  if (error) return { success: false, error: error.message }
  revalidatePath("/tasks")
  revalidatePath("/dashboard")
  return { success: true }
}
