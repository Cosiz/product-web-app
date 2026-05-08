"use server"

import { createClient } from "@/lib/database"

export async function signIn(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function signUp(formData: FormData): Promise<{ success: boolean; error?: string }> {
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
  return { success: true }
}

export async function signOut(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
}
