"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { signUp } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

const schema = z.object({
  display_name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type FormData = z.infer<typeof schema>

export default function JoinPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    setError(null)
    const formData = new FormData()
    formData.append("display_name", data.display_name)
    formData.append("email", data.email)
    formData.append("password", data.password)
    const result = await signUp(formData)
    if (result.success) {
      router.push("/join")
    } else {
      setError(result.error ?? "Sign up failed")
    }
  }

  return (
    <Card className="bg-[var(--color-surface)] border-[var(--color-border)]">
      <CardHeader>
        <CardTitle>Join Neo</CardTitle>
        <CardDescription>Create an account to coordinate your family</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="display_name" className="text-[var(--color-text-secondary)]">Your name</Label>
            <Input id="display_name" type="text" {...register("display_name")} required data-testid="input-display-name" className="mt-1.5 bg-[var(--color-surface-elevated)] border-[var(--color-border)]" />
          </div>
          <div>
            <Label htmlFor="email" className="text-[var(--color-text-secondary)]">Email</Label>
            <Input id="email" type="email" {...register("email")} required data-testid="input-email" className="mt-1.5 bg-[var(--color-surface-elevated)] border-[var(--color-border)]" />
          </div>
          <div>
            <Label htmlFor="password" className="text-[var(--color-text-secondary)]">Password</Label>
            <Input id="password" type="password" {...register("password")} required data-testid="input-password" className="mt-1.5 bg-[var(--color-surface-elevated)] border-[var(--color-border)]" />
          </div>
          {error && <p className="text-[var(--color-error)] text-sm">{error}</p>}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm text-[var(--color-text-secondary)]">
          Already have an account?{" "}
          <Link href="/login" className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
