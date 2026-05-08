"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { createFamily } from "@/actions/family"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

const schema = z.object({
  name: z.string().min(1, "Family name is required"),
})

type FormData = z.infer<typeof schema>

export default function CreateFamilyPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    setError(null)
    const formData = new FormData()
    formData.append("name", data.name)
    const result = await createFamily(formData)
    if (result.success) {
      router.push("/dashboard")
    } else {
      setError(result.error ?? "Failed to create family")
    }
  }

  return (
    <Card className="bg-[var(--color-surface)] border-[var(--color-border)]">
      <CardHeader>
        <CardTitle>Create your family</CardTitle>
        <CardDescription>Give your family a name to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-[var(--color-text-secondary)]">Family name</Label>
            <Input
              id="name"
              type="text"
              placeholder="e.g. The Cosie Family"
              {...register("name")}
              required
              data-testid="input-family-name"
              className="mt-1.5 bg-[var(--color-surface-elevated)] border-[var(--color-border)]"
            />
          </div>
          {error && <p className="text-[var(--color-error)] text-sm">{error}</p>}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create family"}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm text-[var(--color-text-secondary)]">
          Or <Link href="/join" className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]">join an existing family</Link> with an invite code
        </div>
      </CardContent>
    </Card>
  )
}
