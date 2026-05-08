"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { formatRelativeTime } from "@/lib/utils"
import type { Location, FamilyMember, Child } from "@/lib/database.types"

interface Props {
  locations: Location[]
  members: FamilyMember[]
  children: Child[]
  userId: string
}

export function MapClient({ locations, members, children, userId }: Props) {
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null)
  const currentMember = members.find(m => m.user_id === userId)
  const canShareLocation = currentMember?.can_update_location ?? false

  // Get latest location per member
  const latestLocations = locations.reduce((acc, loc) => {
    if (!acc[loc.family_member_id] || new Date(loc.recorded_at) > new Date(acc[loc.family_member_id].recorded_at)) {
      acc[loc.family_member_id] = loc
    }
    return acc
  }, {} as Record<string, Location>)

  const memberLocation = (memberId: string) => latestLocations[memberId]
  const getMemberName = (id: string) => members.find(m => m.id === id)?.display_name ?? "Unknown"
  const getBatteryIcon = (level: number | null) => {
    if (!level) return "⚡"
    if (level > 80) return "🔋"
    if (level > 20) return "🪫"
    return "⚠️"
  }

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Family Map</h1>
        <Button variant="outline" size="sm" data-testid="btn-center-map">Center</Button>
      </div>

      {/* Map placeholder — in production use MapTiler or Google Maps */}
      <div
        className="relative w-full rounded-xl overflow-hidden border border-[var(--color-border)]"
        style={{ height: "400px" }}
        data-testid="map-container"
      >
        <div className="absolute inset-0 bg-[var(--color-surface)] flex items-center justify-center">
          <div className="text-center text-[var(--color-text-muted)]">
            <div className="text-5xl mb-3">🗺️</div>
            <p className="text-sm font-medium">Map View</p>
            <p className="text-xs mt-1">Configure NEXT_PUBLIC_MAPTILER_TOKEN</p>
          </div>
        </div>
        {/* Render member pins if coordinates available */}
        {Object.entries(latestLocations).map(([memberId, loc]) => {
          if (!loc.latitude || !loc.longitude) return null
          return (
            <div
              key={memberId}
              data-testid={`map-member-pin-${memberId}`}
              className="absolute w-8 h-8 rounded-full bg-[var(--color-accent)] border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-lg cursor-pointer hover:scale-110 transition-transform"
              style={{
                left: `${((loc.longitude + 180) % 360) * 100 / 360}%`,
                top: `${((90 - loc.latitude) * 100 / 180)}%`,
              }}
              onClick={() => setSelectedMember(members.find(m => m.id === memberId) ?? null)}
            >
              {getMemberName(memberId).charAt(0)}
            </div>
          )
        })}
      </div>

      {/* Children markers */}
      {children.length > 0 && (
        <Card className="bg-[var(--color-surface)] border-[var(--color-border)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Children</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {children.map(child => (
                <div key={child.id} data-testid={`child-card-${child.id}`} className="p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{child.display_name}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{child.school_name}</p>
                      {child.school_gate && (
                        <p className="text-xs text-[var(--color-text-muted)]" data-testid={`child-school-gate-${child.id}`}>
                          Gate: {child.school_gate}
                        </p>
                      )}
                    </div>
                    {child.pickup_code && (
                      <Badge variant="outline" className="text-[10px]" data-testid={`child-pickup-code-${child.id}`}>
                        {child.pickup_code}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Member location cards */}
      <Card className="bg-[var(--color-surface)] border-[var(--color-border)]">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Members</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {members.filter(m => m.can_update_location).map(member => {
            const loc = memberLocation(member.id)
            return (
              <div
                key={member.id}
                data-testid={`location-card-${member.id}`}
                className="flex items-center gap-3 p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] cursor-pointer hover:border-[var(--color-accent)] transition-colors"
                onClick={() => setSelectedMember(member)}
              >
                <div className="w-8 h-8 rounded-full bg-[var(--color-accent-muted)] flex items-center justify-center text-[var(--color-accent-hover)] font-semibold text-sm">
                  {member.display_name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{member.display_name}</p>
                  {loc ? (
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {formatRelativeTime(loc.recorded_at)}
                    </p>
                  ) : (
                    <p className="text-xs text-[var(--color-text-muted)]">Location off</p>
                  )}
                </div>
                {loc && (
                  <div className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]" data-testid={`location-battery-${member.id}`}>
                    <span>{getBatteryIcon(loc.battery_level)}</span>
                    <span>{loc.battery_level ?? "—"}%</span>
                  </div>
                )}
              </div>
            )
          })}
          {members.filter(m => m.can_update_location).length === 0 && (
            <div className="text-center py-6 text-[var(--color-text-muted)] text-sm">
              No members sharing location
            </div>
          )}
        </CardContent>
      </Card>

      {/* Location sharing toggle */}
      {canShareLocation && (
        <Card className="bg-[var(--color-surface)] border-[var(--color-border)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Share My Location</p>
                <p className="text-xs text-[var(--color-text-muted)]">Let family see your current location</p>
              </div>
              <Button size="sm" variant="outline" data-testid="member-location-sharing-toggle">
                Enable
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
