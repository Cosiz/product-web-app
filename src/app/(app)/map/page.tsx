import { redirect } from "next/navigation"
import { createClient } from "@/lib/database"
import { getFamilyByUser } from "@/actions/family"
import { MapClient } from "@/components/map/map-client"

export default async function MapPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const family = await getFamilyByUser()
  if (!family) redirect("/join")

  const { data: locations } = await supabase
    .from("locations")
    .select("*")
    .in("family_member_id",
      (await supabase.from("family_members").select("id").eq("family_id", family.id).eq("can_update_location", true)).data?.map(m => m.id) ?? []
    )
    .order("recorded_at", { ascending: false })

  const { data: members } = await supabase
    .from("family_members")
    .select("*")
    .eq("family_id", family.id)

  const { data: children } = await supabase
    .from("children")
    .select("*")
    .eq("family_id", family.id)

  return (
    <MapClient
      locations={locations ?? []}
      members={members ?? []}
      children={children ?? []}
      userId={user.id}
    />
  )
}
