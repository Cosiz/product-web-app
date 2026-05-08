"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-client"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.replace("/dashboard")
    })
  }, [router])
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
      <div className="w-full max-w-md p-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--color-accent)] mb-4">
            <span className="text-white font-bold text-xl">N</span>
          </div>
          <h1 className="text-2xl font-bold">Neo</h1>
          <p className="text-[var(--color-text-secondary)] text-sm mt-1">Your family, in sync.</p>
        </div>
        {children}
      </div>
    </div>
  )
}
