"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { formatRelativeTime } from "@/lib/utils"
import type { ActivityFeedItem, FamilyMember, Child } from "@/lib/database.types"

interface Props {
  feed: ActivityFeedItem[]
  members: FamilyMember[]
  children: Child[]
}

const EVENT_ICONS: Record<string, string> = {
  task_completed: "✅",
  task_created: "📝",
  task_updated: "🔄",
  child_checkin: "📍",
  child_checkout: "🚶",
  member_joined: "👋",
  photo_added: "📷",
}

export function FeedClient({ feed, members, children }: Props) {
  const [filter, setFilter] = useState<string>("all")

  const getMemberName = (id: string | null) => members.find(m => m.id === id)?.display_name ?? "Unknown"
  const getChildName = (id: string | null) => children.find(c => c.id === id)?.display_name ?? "Child"

  const filteredFeed = filter === "all" ? feed : feed.filter(f => f.event_type === filter)

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Activity Feed</h1>
        <Button variant="ghost" size="sm" data-testid="btn-refresh-feed">↻</Button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap" data-testid="feed-filters">
        {["all", "task_completed", "task_created", "child_checkin", "child_checkout"].map(type => (
          <button
            key={type}
            data-testid={type === "all" ? "feed-filter-all" : `feed-filter-${type}`}
            onClick={() => setFilter(type)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === type
                ? "bg-[var(--color-accent)] text-white"
                : "bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            {type === "all" ? "All" : type.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      <div className="space-y-1" data-testid="feed-list">
        {filteredFeed.length === 0 ? (
          <div className="text-center py-16 text-[var(--color-text-muted)]" data-testid="empty-feed">
            <p className="text-sm">No activity yet</p>
          </div>
        ) : (
          filteredFeed.map(item => (
            <div
              key={item.id}
              data-testid={`feed-item-${item.id}`}
              className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                item.is_critical
                  ? "bg-[var(--color-error-muted)] border-[var(--color-error)]"
                  : "bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-accent)]"
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                item.is_critical ? "bg-[var(--color-error)] text-white" : "bg-[var(--color-surface-elevated)]"
              }`}>
                {EVENT_ICONS[item.event_type] ?? "📌"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  {item.event_type === "task_completed" && `✅ ${getMemberName(item.actor_id)} completed a task`}
                  {item.event_type === "task_created" && `📝 New task created`}
                  {item.event_type === "task_updated" && `🔄 Task updated by ${getMemberName(item.actor_id)}`}
                  {item.event_type === "child_checkin" && `📍 ${getChildName(item.child_id)} arrived at school`}
                  {item.event_type === "child_checkout" && `🚶 ${getChildName(item.child_id)} left school`}
                  {item.event_type === "member_joined" && `👋 ${getMemberName(item.actor_id)} joined the family`}
                  {item.event_type === "photo_added" && `📷 ${getMemberName(item.actor_id)} shared a photo`}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-[var(--color-text-muted)]">{formatRelativeTime(item.created_at)}</p>
                  {item.is_critical && (
                    <Badge variant="outline" className="text-[8px] px-1 py-0 border-[var(--color-error)] text-[var(--color-error)]" data-testid="feed-critical-badge">
                      CRITICAL
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
