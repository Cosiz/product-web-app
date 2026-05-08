import { redirect } from "next/navigation"
import { createClient } from "@/lib/database"
import { getFamilyByUser } from "@/actions/family"
import { AlbumClient } from "@/components/album/album-client"

export default async function AlbumPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const family = await getFamilyByUser()
  if (!family) redirect("/join")

  const { data: photos } = await supabase
    .from("photos")
    .select("*")
    .eq("family_id", family.id)
    .order("created_at", { ascending: false })

  return (
    <AlbumClient photos={photos ?? []} />
  )
}
