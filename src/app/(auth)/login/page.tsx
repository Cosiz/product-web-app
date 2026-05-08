"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { signIn } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    setError(null)
    const formData = new FormData()
    formData.append("email", data.email)
    formData.append("password", data.password)
    const result = await signIn(formData)
    if (result.success) {
      router.push("/dashboard")
    } else {
      setError(result.error ?? "Login failed")
    }
  }

  return (
    <Card className="bg-[var(--color-surface)] border-[var(--color-border)]">
      <CardHeader>
        <CardTitle data-testid="auth-login-title">Welcome back</CardTitle>
        <CardDescription>Sign in to your family</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-[var(--color-text-secondary)]">Email</Label>
            <Input id="email" type="email" autoComplete="email" {...register("email")} required data-testid="input-email" className="mt-1.5 bg-[var(--color-surface-elevated)] border-[var(--color-border)]" />
          </div>
          <div>
            <Label htmlFor="password" className="text-[var(--color-text-secondary)]">Password</Label>
            <Input id="password" type="password" autoComplete="current-password" {...register("password")} required data-testid="input-password" className="mt-1.5 bg-[var(--color-surface-elevated)] border-[var(--color-border)]" />
          </div>
          {error && <p className="text-[var(--color-error)] text-sm">{error}</p>}
          <Button type="submit" className="w-full" disabled={isSubmitting} data-testid="btn-login">
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm text-[var(--color-text-secondary)]">
          Don&apos;t have an account?{" "}
          <Link href="/join" className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
