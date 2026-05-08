import { redirect } from "next/navigation"
import { createClient } from "@/lib/database"
import { getFamilyByUser } from "@/actions/family"
import { FeedClient } from "@/components/feed/feed-client"

export default async function FeedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const family = await getFamilyByUser()
  if (!family) redirect("/join")

  const { data: feed } = await supabase
    .from("activity_feed")
    .select("*")
    .eq("family_id", family.id)
    .order("created_at", { ascending: false })
    .limit(50)

  const { data: members } = await supabase
    .from("family_members")
    .select("*")
    .eq("family_id", family.id)

  const { data: children } = await supabase
    .from("children")
    .select("*")
    .eq("family_id", family.id)

  return (
    <FeedClient
      feed={feed ?? []}
      members={members ?? []}
      children={children ?? []}
    />
  )
}
