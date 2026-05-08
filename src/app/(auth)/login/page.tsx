"use client"
import { useFormStatus } from "react-dom"
import { useActionState } from "react"
import { signIn } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending} data-testid="btn-login">
      {pending ? "Signing in..." : "Sign in"}
    </Button>
  )
}

export default function LoginPage() {
  const [state, formAction] = useActionState(signIn, null)
  return (
    <Card className="bg-[var(--color-surface)] border-[var(--color-border)]">
      <CardHeader>
        <CardTitle data-testid="auth-login-title">Welcome back</CardTitle>
        <CardDescription>Sign in to your family</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-[var(--color-text-secondary)]">Email</Label>
            <Input id="email" name="email" type="email" required placeholder="parent@example.com" data-testid="input-email" className="mt-1.5 bg-[var(--color-surface-elevated)] border-[var(--color-border)]" />
          </div>
          <div>
            <Label htmlFor="password" className="text-[var(--color-text-secondary)]">Password</Label>
            <Input id="password" name="password" type="password" required placeholder="••••••••" data-testid="input-password" className="mt-1.5 bg-[var(--color-surface-elevated)] border-[var(--color-border)]" />
          </div>
          {state?.error && <p className="text-[var(--color-error)] text-sm">{state.error}</p>}
          <SubmitButton />
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
