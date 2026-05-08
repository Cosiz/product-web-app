import { redirect } from "next/navigation"
import { createClient } from "@/lib/database"
import { getFamilyByUser } from "@/actions/family"
import { DashboardClient } from "@/components/dashboard/dashboard-client"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const family = await getFamilyByUser()
  if (!family) redirect("/create-family")

  const { data: members } = await supabase
    .from("family_members")
    .select("*")
    .eq("family_id", family.id)

  const { data: children } = await supabase
    .from("children")
    .select("*")
    .eq("family_id", family.id)

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("family_id", family.id)
    .neq("status", "cancelled")
    .order("created_at", { ascending: false })
    .limit(5)

  const { data: feed } = await supabase
    .from("activity_feed")
    .select("*")
    .eq("family_id", family.id)
    .order("created_at", { ascending: false })
    .limit(10)

  return (
    <DashboardClient
      family={family}
      members={members ?? []}
      children={children ?? []}
      tasks={tasks ?? []}
      feed={feed ?? []}
      userId={user.id}
    />
  )
}
