"use client"
import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { updateTaskStatus } from "@/actions/tasks"
import { formatRelativeTime, PRIORITY_COLORS, STATUS_LABELS } from "@/lib/utils"
import type { Database } from "@/lib/database.types"
type Task = Database["public"]["Tables"]["tasks"]["Row"]
type FamilyMember = Database["public"]["Tables"]["family_members"]["Row"]
type Child = Database["public"]["Tables"]["children"]["Row"]
type ActivityFeedItem = Database["public"]["Tables"]["activity_feed"]["Row"]
type Family = Database["public"]["Tables"]["families"]["Row"]
import { toast } from "sonner"

interface Props {
  family: Family
  members: FamilyMember[]
  children: Child[]
  tasks: Task[]
  feed: ActivityFeedItem[]
  userId: string
}

function TaskCardSkeleton() {
  return (
    <div className="p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <div className="flex gap-2"><Skeleton className="h-5 w-16" /><Skeleton className="h-5 w-20" /></div>
    </div>
  )
}

function FeedItemSkeleton() {
  return (
    <div className="flex gap-3 p-3">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="flex-1 space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-3 w-24" /></div>
    </div>
  )
}

export function DashboardClient({ family, members, children, tasks, feed, userId }: Props) {
  const [taskList, setTaskList] = useState(tasks)
  const currentMember = members.find(m => m.user_id === userId)
  const isCommander = currentMember?.role === "commander"
  const activeTasks = taskList.filter(t => t.status !== "completed" && t.status !== "cancelled")

  async function handleStatusUpdate(taskId: string, status: "pending" | "in_progress" | "completed") {
    const prev = taskList.map(t => t.id === taskId ? { ...t, status } : t)
    setTaskList(prev)
    const result = await updateTaskStatus(taskId, status)
    if (!result.success) {
      setTaskList(tasks)
      toast.error(result.error ?? "Failed to update task")
    } else {
      toast.success(STATUS_LABELS[status])
    }
  }

  const getMemberName = (id: string | null) => members.find(m => m.id === id)?.display_name ?? "Unassigned"
  const getChildName = (id: string | null) => children.find(c => c.id === id)?.display_name ?? ""

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 data-testid="dashboard-welcome">Welcome back</h1>
          <p className="text-[var(--color-text-secondary)] text-sm" data-testid="dashboard-family-name">{family.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-[var(--color-accent)] text-[var(--color-accent)]" data-testid="dashboard-active-tasks-count">
            {activeTasks.length} active
          </Badge>
          {isCommander && (
            <Link href="/tasks">
              <Button size="sm" data-testid="dashboard-quick-add-task">+ Task</Button>
            </Link>
          )}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Active Tasks */}
        <Card className="bg-[var(--color-surface)] border-[var(--color-border)]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Active Tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {activeTasks.length === 0 ? (
              <div className="text-center py-8 text-[var(--color-text-muted)]" data-testid="empty-tasks">
                <p className="text-sm">No active tasks</p>
              </div>
            ) : (
              activeTasks.slice(0, 5).map(task => (
                <div key={task.id} data-testid={`task-card-${task.id}`} className="p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] hover:border-[var(--color-accent)] transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{task.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1.5 py-0.5"
                          data-testid={`task-priority-${task.priority}`}
                          style={{ borderColor: PRIORITY_COLORS[task.priority ?? 'medium'], color: PRIORITY_COLORS[task.priority ?? 'medium'] }}
                        >
                          {task.priority}
                        </Badge>
                        <span className="text-[10px] text-[var(--color-text-muted)]">{getMemberName(task.assigned_to)}</span>
                      </div>
                    </div>
                    {task.status === "pending" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs h-7"
                        data-testid={`btn-task-${task.id}-complete`}
                        onClick={() => handleStatusUpdate(task.id, "in_progress")}
                      >
                        Start
                      </Button>
                    )}
                    {task.status === "in_progress" && (
                      <Button
                        size="sm"
                        className="text-xs h-7 bg-[var(--color-success)] hover:bg-[var(--color-success)]/80"
                        data-testid={`btn-task-${task.id}-complete`}
                        onClick={() => handleStatusUpdate(task.id, "completed")}
                      >
                        Done
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-[var(--color-surface)] border-[var(--color-border)]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent data-testid="dashboard-recent-activity">
            {feed.length === 0 ? (
              <div className="text-center py-8 text-[var(--color-text-muted)]" data-testid="empty-feed">
                <p className="text-sm">No activity yet</p>
              </div>
            ) : (
              <div className="space-y-1">
                {feed.slice(0, 6).map(item => (
                  <div
                    key={item.id}
                    data-testid={`feed-item-${item.id}`}
                    className={`flex items-center gap-3 p-2 rounded-lg text-sm ${item.is_critical ? "bg-[var(--color-error-muted)] text-[var(--color-error)]" : ""}`}
                  >
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.is_critical ? "bg-[var(--color-error)]" : "bg-[var(--color-accent)]"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="truncate">
                        {item.event_type === "task_completed" && `✓ Task completed`}
                        {item.event_type === "task_created" && `+ New task created`}
                        {item.event_type === "child_checkin" && `📍 ${getChildName(item.child_id)} arrived`}
                        {item.event_type === "child_checkout" && `🚶 ${getChildName(item.child_id)} left`}
                        {item.event_type === "member_joined" && `→ Member joined`}
                      </p>
                      <p className="text-[10px] text-[var(--color-text-muted)]">{formatRelativeTime(item.created_at ?? '')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Family Members */}
      <Card className="bg-[var(--color-surface)] border-[var(--color-border)]">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Family Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" data-testid="member-list">
            {members.map(member => (
              <div key={member.id} data-testid={`member-card-${member.id}`} className="p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-center">
                <div className="w-10 h-10 rounded-full bg-[var(--color-accent-muted)] mx-auto mb-2 flex items-center justify-center text-[var(--color-accent-hover)] font-semibold">
                  {member.display_name.charAt(0)}
                </div>
                <p className="text-xs font-medium truncate">{member.display_name}</p>
                <Badge
                  variant="outline"
                  className="text-[9px] px-1.5 py-0 mt-1"
                  data-testid={`member-role-badge-${member.role}`}
                >
                  {member.role.replace("_", " ")}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
