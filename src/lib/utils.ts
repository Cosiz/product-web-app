import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-HK", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

export function formatRelativeTime(date: string): string {
  const now = new Date()
  const d = new Date(date)
  const diff = now.getTime() - d.getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return formatDate(d)
}

type TaskPriority = "low" | "medium" | "high" | "urgent"
type TaskStatus = "pending" | "in_progress" | "completed" | "cancelled"

export const PRIORITY_COLORS: Record<TaskPriority, string> = {
  urgent: "#ef4444",
  high: "#f97316",
  medium: "#eab308",
  low: "#6b7280",
}

export const STATUS_LABELS: Record<TaskStatus, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
}

export const PRIORITY_BG: Record<TaskPriority, string> = {
  urgent: "rgba(239,68,68,0.1)",
  high: "rgba(249,115,22,0.1)",
  medium: "rgba(234,179,8,0.1)",
  low: "rgba(107,114,128,0.1)",
}

export const LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "zh-Hant", label: "Cantonese (繁體)" },
  { value: "zh-Hans", label: "Mandarin (簡體)" },
]

export type UserRole = "commander" | "helper" | "remote_parent" | "child"

export const ROLE_LABELS: Record<UserRole, string> = {
  commander: "Commander",
  helper: "Helper",
  remote_parent: "Remote Parent",
  child: "Child",
}
