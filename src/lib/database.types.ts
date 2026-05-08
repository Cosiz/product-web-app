export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activity_feed: {
        Row: {
          actor_id: string | null
          child_id: string | null
          created_at: string | null
          event_data: Json | null
          event_type: string
          family_id: string
          id: string
          is_critical: boolean | null
          photo_url: string | null
        }
        Insert: {
          actor_id?: string | null
          child_id?: string | null
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          family_id: string
          id?: string
          is_critical?: boolean | null
          photo_url?: string | null
        }
        Update: {
          actor_id?: string | null
          child_id?: string | null
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          family_id?: string
          id?: string
          is_critical?: boolean | null
          photo_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_feed_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "family_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_feed_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_feed_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      checkins: {
        Row: {
          created_at: string | null
          family_id: string | null
          id: string
          member_id: string | null
          payload: Json
          type: string
        }
        Insert: {
          created_at?: string | null
          family_id?: string | null
          id?: string
          member_id?: string | null
          payload: Json
          type: string
        }
        Update: {
          created_at?: string | null
          family_id?: string | null
          id?: string
          member_id?: string | null
          payload?: Json
          type?: string
        }
        Relationships: []
      }
      children: {
        Row: {
          created_at: string | null
          display_name: string
          family_id: string
          id: string
          notes: Json | null
          photo_url: string | null
          pickup_code: string | null
          school_gate: string | null
          school_name: string | null
        }
        Insert: {
          created_at?: string | null
          display_name: string
          family_id: string
          id?: string
          notes?: Json | null
          photo_url?: string | null
          pickup_code?: string | null
          school_gate?: string | null
          school_name?: string | null
        }
        Update: {
          created_at?: string | null
          display_name?: string
          family_id?: string
          id?: string
          notes?: Json | null
          photo_url?: string | null
          pickup_code?: string | null
          school_gate?: string | null
          school_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "children_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      families: {
        Row: {
          created_at: string | null
          id: string
          invite_code: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          invite_code?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          invite_code?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      family_members: {
        Row: {
          can_receive_tasks: boolean | null
          can_update_location: boolean | null
          created_at: string | null
          display_name: string
          family_id: string
          id: string
          is_child: boolean | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          status: Database["public"]["Enums"]["member_status"] | null
          user_id: string | null
        }
        Insert: {
          can_receive_tasks?: boolean | null
          can_update_location?: boolean | null
          created_at?: string | null
          display_name: string
          family_id: string
          id?: string
          is_child?: boolean | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["member_status"] | null
          user_id?: string | null
        }
        Update: {
          can_receive_tasks?: boolean | null
          can_update_location?: boolean | null
          created_at?: string | null
          display_name?: string
          family_id?: string
          id?: string
          is_child?: boolean | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["member_status"] | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "family_members_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      family_photos: {
        Row: {
          caption: string | null
          created_at: string | null
          family_id: string | null
          id: string
          uploaded_by: string | null
          url: string
        }
        Insert: {
          caption?: string | null
          created_at?: string | null
          family_id?: string | null
          id?: string
          uploaded_by?: string | null
          url: string
        }
        Update: {
          caption?: string | null
          created_at?: string | null
          family_id?: string | null
          id?: string
          uploaded_by?: string | null
          url?: string
        }
        Relationships: []
      }
      locations: {
        Row: {
          accuracy: number | null
          battery_level: number | null
          family_member_id: string
          id: string
          latitude: number
          longitude: number
          recorded_at: string | null
        }
        Insert: {
          accuracy?: number | null
          battery_level?: number | null
          family_member_id: string
          id?: string
          latitude: number
          longitude: number
          recorded_at?: string | null
        }
        Update: {
          accuracy?: number | null
          battery_level?: number | null
          family_member_id?: string
          id?: string
          latitude?: number
          longitude?: number
          recorded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "locations_family_member_id_fkey"
            columns: ["family_member_id"]
            isOneToOne: false
            referencedRelation: "family_members"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          channel: Database["public"]["Enums"]["notification_channel"] | null
          created_at: string | null
          family_id: string | null
          id: string
          is_muted: boolean | null
          is_read: boolean | null
          payload: Json | null
          priority: Database["public"]["Enums"]["notification_priority"] | null
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          channel?: Database["public"]["Enums"]["notification_channel"] | null
          created_at?: string | null
          family_id?: string | null
          id?: string
          is_muted?: boolean | null
          is_read?: boolean | null
          payload?: Json | null
          priority?: Database["public"]["Enums"]["notification_priority"] | null
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          channel?: Database["public"]["Enums"]["notification_channel"] | null
          created_at?: string | null
          family_id?: string | null
          id?: string
          is_muted?: boolean | null
          is_read?: boolean | null
          payload?: Json | null
          priority?: Database["public"]["Enums"]["notification_priority"] | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      photos: {
        Row: {
          caption: string | null
          created_at: string | null
          family_id: string
          id: string
          taken_at: string | null
          uploaded_by: string | null
          url: string
        }
        Insert: {
          caption?: string | null
          created_at?: string | null
          family_id: string
          id?: string
          taken_at?: string | null
          uploaded_by?: string | null
          url: string
        }
        Update: {
          caption?: string | null
          created_at?: string | null
          family_id?: string
          id?: string
          taken_at?: string | null
          uploaded_by?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "photos_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photos_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_to: string | null
          child_id: string | null
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          due_date: string | null
          due_time: string | null
          family_id: string
          id: string
          location: string | null
          location_lat: number | null
          location_lng: number | null
          priority: Database["public"]["Enums"]["task_priority"] | null
          recurring: string | null
          status: Database["public"]["Enums"]["task_status"] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          child_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          due_time?: string | null
          family_id: string
          id?: string
          location?: string | null
          location_lat?: number | null
          location_lng?: number | null
          priority?: Database["public"]["Enums"]["task_priority"] | null
          recurring?: string | null
          status?: Database["public"]["Enums"]["task_status"] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          child_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          due_time?: string | null
          family_id?: string
          id?: string
          location?: string | null
          location_lat?: number | null
          location_lng?: number | null
          priority?: Database["public"]["Enums"]["task_priority"] | null
          recurring?: string | null
          status?: Database["public"]["Enums"]["task_status"] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "family_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          display_name: string
          email: string
          id: string
          notification_prefs: Json | null
          phone: string | null
          preferred_language: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          display_name: string
          email: string
          id: string
          notification_prefs?: Json | null
          phone?: string | null
          preferred_language?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string
          email?: string
          id?: string
          notification_prefs?: Json | null
          phone?: string | null
          preferred_language?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      visibility_permissions: {
        Row: {
          can_see_checkins: boolean | null
          can_see_location: boolean | null
          can_see_photos: boolean | null
          can_see_tasks: boolean | null
          created_at: string | null
          family_id: string | null
          id: string
          member_id: string | null
        }
        Insert: {
          can_see_checkins?: boolean | null
          can_see_location?: boolean | null
          can_see_photos?: boolean | null
          can_see_tasks?: boolean | null
          created_at?: string | null
          family_id?: string | null
          id?: string
          member_id?: string | null
        }
        Update: {
          can_see_checkins?: boolean | null
          can_see_location?: boolean | null
          can_see_photos?: boolean | null
          can_see_tasks?: boolean | null
          created_at?: string | null
          family_id?: string | null
          id?: string
          member_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      member_status: "active" | "invited" | "suspended"
      notification_channel: "push" | "whatsapp" | "sms" | "email"
      notification_priority: "routine" | "important" | "critical"
      task_priority: "low" | "medium" | "high" | "urgent"
      task_status: "pending" | "in_progress" | "completed" | "cancelled"
      user_role: "commander" | "helper" | "remote_parent" | "child"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      member_status: ["active", "invited", "suspended"],
      notification_channel: ["push", "whatsapp", "sms", "email"],
      notification_priority: ["routine", "important", "critical"],
      task_priority: ["low", "medium", "high", "urgent"],
      task_status: ["pending", "in_progress", "completed", "cancelled"],
      user_role: ["commander", "helper", "remote_parent", "child"],
    },
  },
} as const
