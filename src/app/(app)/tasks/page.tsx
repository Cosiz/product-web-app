import { redirect } from "next/navigation"
import { createClient } from "@/lib/database"
import { getFamilyByUser } from "@/actions/family"
import { TasksClient } from "@/components/tasks/tasks-client"

export default async function TasksPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const family = await getFamilyByUser()
  if (!family) redirect("/join")

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("family_id", family.id)
    .order("created_at", { ascending: false })

  const { data: members } = await supabase
    .from("family_members")
    .select("*")
    .eq("family_id", family.id)

  const { data: children } = await supabase
    .from("children")
    .select("*")
    .eq("family_id", family.id)

  return (
    <TasksClient
      tasks={tasks ?? []}
      members={members ?? []}
      children={children ?? []}
      userId={user.id}
    />
  )
}
