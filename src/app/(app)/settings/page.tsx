import { redirect } from "next/navigation"
import { createClient } from "@/lib/database"
import { getFamilyByUser } from "@/actions/family"
import { SettingsClient } from "@/components/settings/settings-client"

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const family = await getFamilyByUser()
  if (!family) redirect("/join")

  const { data: userProfile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single()

  const { data: members } = await supabase
    .from("family_members")
    .select("*")
    .eq("family_id", family.id)

  const { data: children } = await supabase
    .from("children")
    .select("*")
    .eq("family_id", family.id)

  return (
    <SettingsClient
      family={family}
      userProfile={userProfile ?? { id: user.id, email: user.email ?? "", display_name: user.user_metadata?.display_name ?? "", notification_prefs: {} }}
      members={members ?? []}
      children={children ?? []}
    />
  )
}
