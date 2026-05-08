"use client"
import { useState } from "react"
import { useActionState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { addChild, checkInChild, checkOutChild } from "@/actions/members"
import { LANGUAGE_OPTIONS, ROLE_LABELS } from "@/lib/utils"
import type { Family, User, FamilyMember, Child } from "@/lib/database.types"
import { toast } from "sonner"

interface Props {
  family: Family
  userProfile: User
  members: FamilyMember[]
  children: Child[]
}

function AddChildForm() {
  const [state, formAction, pending] = useActionState(addChild, null)
  return (
    <form action={formAction} className="space-y-3">
      <Input name="display_name" placeholder="Child's name" required data-testid="input-child-name" className="bg-[var(--color-surface)] border-[var(--color-border)]" />
      <Input name="school_name" placeholder="School name" data-testid="input-child-school" className="bg-[var(--color-surface)] border-[var(--color-border)]" />
      <Input name="school_gate" placeholder="Gate (e.g. Gate A)" data-testid="input-child-gate" className="bg-[var(--color-surface)] border-[var(--color-border)]" />
      <Input name="pickup_code" placeholder="Pickup code (optional)" data-testid="input-child-pickup-code" className="bg-[var(--color-surface)] border-[var(--color-border)]" />
      {state?.error && <p className="text-[var(--color-error)] text-xs">{state.error}</p>}
      <Button type="submit" size="sm" disabled={pending} data-testid="btn-add-child" className="w-full">
        {pending ? "Adding..." : "Add Child"}
      </Button>
    </form>
  )
}

export function SettingsClient({ family, userProfile, members, children }: Props) {
  const [language, setLanguage] = useState(userProfile.preferred_language ?? "en")

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-2xl">
      <h1 className="text-xl font-bold">Settings</h1>

      {/* Family Info */}
      <Card className="bg-[var(--color-surface)] border-[var(--color-border)]">
        <CardHeader>
          <CardTitle className="text-base">Family</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{family.name}</p>
              <p className="text-xs text-[var(--color-text-muted)]">Invite code: <span className="font-mono text-[var(--color-accent)]">{family.invite_code}</span></p>
            </div>
            <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(family.invite_code); toast.success("Copied!") }}>
              Copy Code
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Profile */}
      <Card className="bg-[var(--color-surface)] border-[var(--color-border)]" data-testid="settings-form">
        <CardHeader>
          <CardTitle className="text-base">Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label htmlFor="display_name" className="text-[var(--color-text-secondary)]">Display Name</Label>
            <Input id="display_name" name="display_name" defaultValue={userProfile.display_name} data-testid="input-display-name" className="mt-1.5 bg-[var(--color-surface-elevated)] border-[var(--color-border)]" />
          </div>
          <div>
            <Label htmlFor="email" className="text-[var(--color-text-secondary)]">Email</Label>
            <Input id="email" name="email" defaultValue={userProfile.email} disabled className="mt-1.5 bg-[var(--color-surface-elevated)] border-[var(--color-border)] opacity-60" />
          </div>
          <div>
            <Label htmlFor="language" className="text-[var(--color-text-secondary)]">Language</Label>
            <Select value={language} onValueChange={setLanguage} data-testid="input-language">
              <SelectTrigger className="mt-1.5 bg-[var(--color-surface-elevated)] border-[var(--color-border)]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGE_OPTIONS.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button size="sm" data-testid="btn-save-settings">Save Changes</Button>
        </CardContent>
      </Card>

      {/* Children */}
      <Card className="bg-[var(--color-surface)] border-[var(--color-border)]">
        <CardHeader>
          <CardTitle className="text-base">Children</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2" data-testid="child-list">
            {children.map(child => (
              <div key={child.id} data-testid={`child-card-${child.id}`} className="p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{child.display_name}</p>
                    {child.school_name && <p className="text-xs text-[var(--color-text-muted)]">{child.school_name}</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-xs h-7" data-testid={`btn-child-checkin-${child.id}`} onClick={async () => {
                      const result = await checkInChild(child.id)
                      toast.success(result.success ? "Checked in!" : result.error ?? "Error")
                    }}>
                      Arrived
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs h-7" data-testid={`btn-child-checkout-${child.id}`} onClick={async () => {
                      const result = await checkOutChild(child.id)
                      toast.success(result.success ? "Checked out!" : result.error ?? "Error")
                    }}>
                      Left
                    </Button>
                  </div>
                </div>
                {child.school_gate && (
                  <p className="text-xs text-[var(--color-text-muted)] mt-1" data-testid={`child-school-gate-${child.id}`}>Gate: {child.school_gate}</p>
                )}
              </div>
            ))}
            {children.length === 0 && (
              <div className="text-center py-4 text-[var(--color-text-muted)] text-sm">No children added yet</div>
            )}
          </div>
          <AddChildForm />
        </CardContent>
      </Card>

      {/* Members */}
      <Card className="bg-[var(--color-surface)] border-[var(--color-border)]">
        <CardHeader>
          <CardTitle className="text-base">Family Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2" data-testid="member-list">
            {members.map(member => (
              <div key={member.id} data-testid={`member-card-${member.id}`} className="flex items-center justify-between p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-accent-muted)] flex items-center justify-center text-[var(--color-accent-hover)] font-semibold text-sm">
                    {member.display_name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{member.display_name}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{member.phone ?? member.email}</p>
                  </div>
                </div>
                <Badge variant="outline" data-testid={`member-role-badge-${member.role}`} className="text-[10px]">
                  {ROLE_LABELS[member.role] ?? member.role}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="bg-[var(--color-surface)] border-[var(--color-error)]/30">
        <CardContent className="p-4">
          <Button variant="destructive" size="sm" data-testid="btn-leave-family">
            Leave Family
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
