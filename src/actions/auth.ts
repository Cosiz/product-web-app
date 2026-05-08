"use server"

import { createClient } from "@/lib/database"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function signIn(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { success: false, error: error.message }
  revalidatePath("/")
  redirect("/dashboard")
}

export async function signUp(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const display_name = formData.get("display_name") as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { display_name } },
  })
  if (error) return { success: false, error: error.message }
  redirect("/join")
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath("/")
  redirect("/login")
}
