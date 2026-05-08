"use server"

import { createClient } from "@/lib/database"
import { createTaskSchema } from "@/lib/schemas"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { ZodError } from "zod"

export async function createTask(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const raw = {
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    priority: formData.get("priority") || "medium",
    assigned_to: formData.get("assigned_to") || undefined,
    child_id: formData.get("child_id") || undefined,
    due_date: formData.get("due_date") || undefined,
    location: formData.get("location") || undefined,
    location_lat: formData.get("location_lat") ? Number(formData.get("location_lat")) : undefined,
    location_lng: formData.get("location_lng") ? Number(formData.get("location_lng")) : undefined,
  }

  try {
    const data = createTaskSchema.parse(raw)
    const userId = user.id

    const { data: member } = await supabase
      .from("family_members")
      .select("family_id, id")
      .eq("user_id", userId)
      .single()

    if (!member) throw new Error("Not a family member")

    const insertData: Record<string, unknown> = {
      title: data.title,
      family_id: member.family_id,
      created_by: userId,
      priority: data.priority,
    }
    if (data.description) insertData.description = data.description
    if (data.assigned_to) insertData.assigned_to = data.assigned_to
    if (data.child_id) insertData.child_id = data.child_id
    if (data.due_date) insertData.due_date = data.due_date
    if (data.location) insertData.location = data.location

    const { error } = await supabase.from("tasks").insert(insertData)
    if (error) throw error

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

export async function updateTaskStatus(taskId: string, status: "pending" | "in_progress" | "completed") {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const updates: Record<string, unknown> = { status }
  if (status === "completed") updates.completed_at = new Date().toISOString()

  const { error } = await supabase
    .from("tasks")
    .update(updates)
    .eq("id", taskId)

  if (error) return { success: false, error: error.message }

  const userId = user.id
  const { data: member } = await supabase
    .from("family_members")
    .select("family_id, id")
    .eq("user_id", userId)
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
  if (!user) redirect("/login")

  const { error } = await supabase.from("tasks").delete().eq("id", taskId)
  if (error) return { success: false, error: error.message }
  revalidatePath("/tasks")
  revalidatePath("/dashboard")
  return { success: true }
}
