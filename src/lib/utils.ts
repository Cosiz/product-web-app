import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { type task_priority, type task_status } from "./database.types"

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

export function formatRelativeTime(date: string | Date): string {
  const now = Date.now()
  const d = new Date(date).getTime()
  const diff = now - d
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

export const PRIORITY_COLORS: Record<task_priority, string> = {
  low: "#71717A",
  medium: "#F59E0B",
  high: "#F97316",
  urgent: "#EF4444",
}

export const STATUS_LABELS: Record<task_status, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
}

export const ROLE_LABELS: Record<string, string> = {
  commander: "Commander",
  helper: "Helper",
  remote_parent: "Remote Parent",
  child: "Child",
}

export const LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "zh-Hant", label: "繁體中文 (Cantonese)" },
  { value: "zh-Hans", label: "简体中文 (Mandarin)" },
]
