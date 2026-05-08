import { z } from "zod"

// Re-export enums from database types for use in forms
export const USER_ROLES = ["commander", "helper", "remote_parent", "child"] as const
export const TASK_PRIORITIES = ["low", "medium", "high", "urgent"] as const
export const TASK_STATUSES = ["pending", "in_progress", "completed", "cancelled"] as const
export const MEMBER_STATUSES = ["active", "invited", "suspended"] as const

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(2000).optional(),
  priority: z.enum(TASK_PRIORITIES).default("medium"),
  assigned_to: z.string().uuid().optional(),
  child_id: z.string().uuid().optional(),
  due_date: z.string().datetime().optional(),
  location: z.string().max(500).optional(),
  location_lat: z.number().min(-90).max(90).optional(),
  location_lng: z.number().min(-180).max(180).optional(),
})

export const updateTaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  priority: z.enum(TASK_PRIORITIES).optional(),
  status: z.enum(TASK_STATUSES).optional(),
  assigned_to: z.string().uuid().optional().nullable(),
  due_date: z.string().datetime().optional().nullable(),
  location: z.string().max(500).optional().nullable(),
  location_lat: z.number().min(-90).max(90).optional().nullable(),
  location_lng: z.number().min(-180).max(180).optional().nullable(),
})

export const createFamilySchema = z.object({
  name: z.string().min(1).max(100),
})

export const joinFamilySchema = z.object({
  invite_code: z.string().min(8).max(8),
  display_name: z.string().min(1).max(100),
  role: z.enum(USER_ROLES).default("helper"),
})

export const addChildSchema = z.object({
  display_name: z.string().min(1).max(100),
  school_name: z.string().max(200).optional(),
  school_gate: z.string().max(200).optional(),
  pickup_code: z.string().max(50).optional(),
})

export const updateLocationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  accuracy: z.number().min(0).optional(),
  battery_level: z.number().min(0).max(100).optional(),
})

export const updateMemberSchema = z.object({
  id: z.string().uuid(),
  role: z.enum(USER_ROLES).optional(),
  can_receive_tasks: z.boolean().optional(),
  can_update_location: z.boolean().optional(),
})

export const uploadPhotoSchema = z.object({
  url: z.string().url(),
  caption: z.string().max(500).optional(),
})

export type CreateTask = z.infer<typeof createTaskSchema>
export type UpdateTask = z.infer<typeof updateTaskSchema>
export type CreateFamily = z.infer<typeof createFamilySchema>
export type JoinFamily = z.infer<typeof joinFamilySchema>
export type AddChild = z.infer<typeof addChildSchema>
export type UpdateLocation = z.infer<typeof updateLocationSchema>
