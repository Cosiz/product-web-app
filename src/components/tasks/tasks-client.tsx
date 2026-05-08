"use client"
import { useState } from "react"
import { useFormStatus } from "react-dom"
import { useActionState } from "react"
import { createTask, updateTaskStatus, deleteTask } from "@/actions/tasks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PRIORITY_COLORS, STATUS_LABELS, formatDate } from "@/lib/utils"
import type { Task, FamilyMember, Child } from "@/lib/database.types"
import { toast } from "sonner"
import { format } from "date-fns"

interface Props { tasks: Task[]; members: FamilyMember[]; children: Child[]; userId: string }

function CreateTaskForm({ members, children }: { members: FamilyMember[]; children: Child[] }) {
  const { pending } = useFormStatus()
  const [state, formAction] = useActionState(createTask, null)
  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="title" className="text-[var(--color-text-secondary)]">Title *</Label>
        <Input id="title" name="title" required data-testid="input-task-title" className="mt-1.5 bg-[var(--color-surface-elevated)] border-[var(--color-border)]" />
        {state?.errors?.title && <p className="text-[var(--color-error)] text-xs mt-1">{state.errors.title}</p>}
      </div>
      <div>
        <Label htmlFor="description" className="text-[var(--color-text-secondary)]">Description</Label>
        <Textarea id="description" name="description" rows={3} data-testid="input-task-description" className="mt-1.5 bg-[var(--color-surface-elevated)] border-[var(--color-border)]" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="priority" className="text-[var(--color-text-secondary)]">Priority</Label>
          <Select name="priority" defaultValue="medium" data-testid="input-task-priority">
            <SelectTrigger className="mt-1.5 bg-[var(--color-surface-elevated)] border-[var(--color-border)]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="assigned_to" className="text-[var(--color-text-secondary)]">Assignee</Label>
          <Select name="assigned_to" data-testid="input-task-assignee">
            <SelectTrigger className="mt-1.5 bg-[var(--color-surface-elevated)] border-[var(--color-border)]">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {members.filter(m => !m.is_child).map(m => (
                <SelectItem key={m.id} value={m.id}>{m.display_name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="due_date" className="text-[var(--color-text-secondary)]">Due Date</Label>
        <Input id="due_date" name="due_date" type="datetime-local" data-testid="input-task-due-date" className="mt-1.5 bg-[var(--color-surface-elevated)] border-[var(--color-border)]" />
      </div>
      <div>
        <Label htmlFor="location" className="text-[var(--color-text-secondary)]">Location</Label>
        <Input id="location" name="location" placeholder="e.g. St. Francis Xavier" data-testid="input-task-location" className="mt-1.5 bg-[var(--color-surface-elevated)] border-[var(--color-border)]" />
      </div>
      {state?.error && <p className="text-[var(--color-error)] text-sm">{state.error}</p>}
      <div className="flex gap-2">
        <Button type="submit" disabled={pending} data-testid="btn-task-submit" className="flex-1">
          {pending ? "Creating..." : "Create Task"}
        </Button>
      </div>
    </form>
  )
}

export function TasksClient({ tasks, members, children, userId }: Props) {
  const [open, setOpen] = useState(false)
  const [taskList, setTaskList] = useState(tasks)
  const currentMember = members.find(m => m.user_id === userId)
  const isCommander = currentMember?.role === "commander"

  async function handleStatusUpdate(taskId: string, status: "pending" | "in_progress" | "completed") {
    const prev = taskList.map(t => t.id === taskId ? { ...t, status } : t)
    setTaskList(prev)
    const result = await updateTaskStatus(taskId, status)
    if (!result.success) { setTaskList(tasks); toast.error(result.error ?? "Failed") }
    else { toast.success(STATUS_LABELS[status]) }
  }

  async function handleDelete(taskId: string) {
    setTaskList(prev => prev.filter(t => t.id !== taskId))
    const result = await deleteTask(taskId)
    if (!result.success) { setTaskList(tasks); toast.error(result.error ?? "Failed") }
    else { toast.success("Task deleted") }
  }

  const getMemberName = (id: string | null) => members.find(m => m.id === id)?.display_name ?? "—"

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Tasks</h1>
        {isCommander && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button data-testid="btn-create-task">+ New Task</Button>
            </DialogTrigger>
            <DialogContent className="bg-[var(--color-surface-elevated)] border-[var(--color-border)]">
              <DialogHeader>
                <DialogTitle>Create Task</DialogTitle>
              </DialogHeader>
              <CreateTaskForm members={members} children={children} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="space-y-2" data-testid="task-list">
        {taskList.length === 0 ? (
          <div className="text-center py-16 text-[var(--color-text-muted)]" data-testid="empty-tasks">
            <p className="text-sm">No tasks yet</p>
          </div>
        ) : (
          taskList.map(task => (
            <div key={task.id} data-testid={`task-card-${task.id}`} className="p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-accent)] transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium">{task.title}</p>
                    <Badge
                      variant="outline"
                      data-testid={`task-priority-${task.priority}`}
                      className="text-[10px]"
                      style={{ borderColor: PRIORITY_COLORS[task.priority], color: PRIORITY_COLORS[task.priority] }}
                    >
                      {task.priority}
                    </Badge>
                    <Badge
                      variant="outline"
                      data-testid={`task-status-${task.status}`}
                      className="text-[10px]"
                    >
                      {STATUS_LABELS[task.status]}
                    </Badge>
                  </div>
                  {task.description && <p className="text-xs text-[var(--color-text-secondary)] mt-1 line-clamp-2">{task.description}</p>}
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-[var(--color-text-muted)]">
                    <span data-testid={`task-assignee-${task.assigned_to}`}>{getMemberName(task.assigned_to)}</span>
                    {task.due_date && <span>{formatDate(task.due_date)}</span>}
                    {task.location && <span data-testid="task-location-chip">📍 {task.location}</span>}
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  {task.status === "pending" && !isCommander && (
                    <Button size="sm" variant="ghost" className="text-xs h-7" onClick={() => handleStatusUpdate(task.id, "in_progress")}>Start</Button>
                  )}
                  {task.status === "pending" && isCommander && (
                    <>
                      <Button size="sm" variant="ghost" className="text-xs h-7" onClick={() => handleStatusUpdate(task.id, "in_progress")}>Start</Button>
                      <Button size="sm" variant="ghost" className="text-xs h-7 text-[var(--color-error)]" data-testid={`btn-task-${task.id}-delete`} onClick={() => handleDelete(task.id)}>Del</Button>
                    </>
                  )}
                  {task.status === "in_progress" && (
                    <Button size="sm" className="text-xs h-7 bg-[var(--color-success)] hover:bg-[var(--color-success)]/80" onClick={() => handleStatusUpdate(task.id, "completed")}>Done</Button>
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
