"use client"
import { useFormStatus } from "react-dom"
import { useActionState } from "react"
import { signUp } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Creating account..." : "Create account"}
    </Button>
  )
}

export default function JoinPage() {
  const [state, formAction] = useActionState(signUp, null)
  return (
    <Card className="bg-[var(--color-surface)] border-[var(--color-border)]">
      <CardHeader>
        <CardTitle>Join Neo</CardTitle>
        <CardDescription>Create an account to coordinate your family</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div>
            <Label htmlFor="display_name" className="text-[var(--color-text-secondary)]">Your name</Label>
            <Input id="display_name" name="display_name" type="text" required placeholder="Mama Chan" data-testid="input-display-name" className="mt-1.5 bg-[var(--color-surface-elevated)] border-[var(--color-border)]" />
          </div>
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
          Already have an account?{" "}
          <Link href="/login" className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
