export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type user_role = "commander" | "helper" | "remote_parent" | "child"
export type member_status = "active" | "invited" | "suspended"
export type task_priority = "low" | "medium" | "high" | "urgent"
export type task_status = "pending" | "in_progress" | "completed" | "cancelled"
export type notification_channel = "push" | "whatsapp" | "sms" | "email"
export type notification_priority = "routine" | "important" | "critical"

export interface Database {
  public: {
    Tables: {
      families: {
        Row: {
          id: string
          name: string
          invite_code: string
          created_at: string
          updated_at: string
        }
        Insert: { name: string }
        Update: { name?: string }
      }
      users: {
        Row: {
          id: string
          email: string
          display_name: string
          phone: string | null
          avatar_url: string | null
          preferred_language: string
          notification_prefs: Json
          created_at: string
          updated_at: string
        }
        Insert: { id: string; email: string; display_name: string; phone?: string }
        Update: { display_name?: string; phone?: string; preferred_language?: string; notification_prefs?: Json }
      }
      family_members: {
        Row: {
          id: string
          family_id: string
          user_id: string | null
          role: user_role
          display_name: string
          phone: string | null
          status: member_status
          can_receive_tasks: boolean
          can_update_location: boolean
          is_child: boolean
          created_at: string
        }
        Insert: { family_id: string; user_id?: string; role?: user_role; display_name: string; phone?: string }
        Update: { role?: user_role; status?: member_status; can_receive_tasks?: boolean; can_update_location?: boolean }
      }
      children: {
        Row: {
          id: string
          family_id: string
          display_name: string
          school_name: string | null
          school_gate: string | null
          pickup_code: string | null
          photo_url: string | null
          notes: Json
          created_at: string
        }
        Insert: { family_id: string; display_name: string; school_name?: string; school_gate?: string; pickup_code?: string }
        Update: { display_name?: string; school_name?: string; school_gate?: string; pickup_code?: string }
      }
      tasks: {
        Row: {
          id: string
          family_id: string
          created_by: string | null
          assigned_to: string | null
          child_id: string | null
          title: string
          description: string | null
          priority: task_priority
          status: task_status
          due_date: string | null
          location: string | null
          location_lat: number | null
          location_lng: number | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: { family_id: string; created_by?: string; title: string; description?: string; priority?: task_priority; assigned_to?: string; child_id?: string; due_date?: string; location?: string; location_lat?: number; location_lng?: number }
        Update: { title?: string; description?: string; priority?: task_priority; status?: task_status; assigned_to?: string; due_date?: string; location?: string; completed_at?: string }
      }
      locations: {
        Row: { id: string; family_member_id: string; latitude: number; longitude: number; accuracy: number | null; battery_level: number | null; recorded_at: string }
        Insert: { family_member_id: string; latitude: number; longitude: number; accuracy?: number; battery_level?: number }
        Update: { latitude?: number; longitude?: number }
      }
      activity_feed: {
        Row: { id: string; family_id: string; actor_id: string | null; child_id: string | null; event_type: string; event_data: Json; photo_url: string | null; is_critical: boolean; created_at: string }
        Insert: { family_id: string; actor_id?: string; child_id?: string; event_type: string; event_data?: Json; photo_url?: string; is_critical?: boolean }
        Update: Record<string, never>
      }
      notifications: {
        Row: { id: string; user_id: string; family_id: string | null; title: string; body: string | null; priority: notification_priority; channel: notification_channel; is_read: boolean; is_muted: boolean; payload: Json; created_at: string }
        Insert: { user_id: string; family_id?: string; title: string; body?: string; priority?: notification_priority; channel?: notification_channel }
        Update: { is_read?: boolean; is_muted?: boolean }
      }
      photos: {
        Row: { id: string; family_id: string; uploaded_by: string | null; url: string; caption: string | null; taken_at: string | null; created_at: string }
        Insert: { family_id: string; uploaded_by?: string; url: string; caption?: string; taken_at?: string }
        Update: { caption?: string }
      }
    }
  }
}

export type Family = Database["public"]["Tables"]["families"]["Row"]
export type User = Database["public"]["Tables"]["users"]["Row"]
export type FamilyMember = Database["public"]["Tables"]["family_members"]["Row"]
export type Child = Database["public"]["Tables"]["children"]["Row"]
export type Task = Database["public"]["Tables"]["tasks"]["Row"]
export type Location = Database["public"]["Tables"]["locations"]["Row"]
export type ActivityFeedItem = Database["public"]["Tables"]["activity_feed"]["Row"]
export type Notification = Database["public"]["Tables"]["notifications"]["Row"]
export type Photo = Database["public"]["Tables"]["photos"]["Row"]
