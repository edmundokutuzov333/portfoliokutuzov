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
      about_method: {
        Row: {
          description: string | null
          id: string
          is_active: boolean
          number: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          description?: string | null
          id?: string
          is_active?: boolean
          number: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          description?: string | null
          id?: string
          is_active?: boolean
          number?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          created_at: string
          email: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          action: string
          created_at: string
          device: string | null
          element: string | null
          id: string
          meta: Json
          page: string
          session_id: string | null
          viewport_height: number | null
          viewport_width: number | null
          x: number | null
          y: number | null
        }
        Insert: {
          action: string
          created_at?: string
          device?: string | null
          element?: string | null
          id?: string
          meta?: Json
          page: string
          session_id?: string | null
          viewport_height?: number | null
          viewport_width?: number | null
          x?: number | null
          y?: number | null
        }
        Update: {
          action?: string
          created_at?: string
          device?: string | null
          element?: string | null
          id?: string
          meta?: Json
          page?: string
          session_id?: string | null
          viewport_height?: number | null
          viewport_width?: number | null
          x?: number | null
          y?: number | null
        }
        Relationships: []
      }
      booking_requests: {
        Row: {
          admin_notes: string | null
          created_at: string
          email: string
          id: string
          name: string
          note: string | null
          preferred_date: string | null
          preferred_time: string | null
          status: string
          timezone: string | null
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          note?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          status?: string
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          note?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          status?: string
          timezone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      briefing_submissions: {
        Row: {
          admin_notes: string | null
          attachments: Json
          budget_range: string | null
          company_name: string | null
          country: string | null
          created_at: string
          currency: string
          deadline: string | null
          email: string
          exact_amount: number | null
          full_name: string
          id: string
          is_starred: boolean
          message: string
          negotiable: boolean
          phone: string | null
          position: string | null
          preferred_contact_method: string | null
          project_type: string
          reference_links: Json
          reference_project_id: string | null
          source: string | null
          status: string
          updated_at: string
          urgency: string
          user_agent: string | null
        }
        Insert: {
          admin_notes?: string | null
          attachments?: Json
          budget_range?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string
          currency?: string
          deadline?: string | null
          email: string
          exact_amount?: number | null
          full_name: string
          id?: string
          is_starred?: boolean
          message: string
          negotiable?: boolean
          phone?: string | null
          position?: string | null
          preferred_contact_method?: string | null
          project_type: string
          reference_links?: Json
          reference_project_id?: string | null
          source?: string | null
          status?: string
          updated_at?: string
          urgency?: string
          user_agent?: string | null
        }
        Update: {
          admin_notes?: string | null
          attachments?: Json
          budget_range?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string
          currency?: string
          deadline?: string | null
          email?: string
          exact_amount?: number | null
          full_name?: string
          id?: string
          is_starred?: boolean
          message?: string
          negotiable?: boolean
          phone?: string | null
          position?: string | null
          preferred_contact_method?: string | null
          project_type?: string
          reference_links?: Json
          reference_project_id?: string | null
          source?: string | null
          status?: string
          updated_at?: string
          urgency?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          logo_height: number | null
          logo_url: string | null
          logo_width: number | null
          name: string
          sort_order: number
          updated_at: string
          website_url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          logo_height?: number | null
          logo_url?: string | null
          logo_width?: number | null
          name: string
          sort_order?: number
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          logo_height?: number | null
          logo_url?: string | null
          logo_width?: number | null
          name?: string
          sort_order?: number
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      contact_requests: {
        Row: {
          admin_notes: string | null
          attachments: Json
          budget_amount: number | null
          budget_currency: string | null
          budget_label: string | null
          company: string | null
          created_at: string
          email: string
          id: string
          is_starred: boolean
          message: string
          name: string
          phone: string | null
          project_type: string | null
          source: string | null
          status: string
          timeline: string | null
          updated_at: string
          user_agent: string | null
        }
        Insert: {
          admin_notes?: string | null
          attachments?: Json
          budget_amount?: number | null
          budget_currency?: string | null
          budget_label?: string | null
          company?: string | null
          created_at?: string
          email: string
          id?: string
          is_starred?: boolean
          message: string
          name: string
          phone?: string | null
          project_type?: string | null
          source?: string | null
          status?: string
          timeline?: string | null
          updated_at?: string
          user_agent?: string | null
        }
        Update: {
          admin_notes?: string | null
          attachments?: Json
          budget_amount?: number | null
          budget_currency?: string | null
          budget_label?: string | null
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          is_starred?: boolean
          message?: string
          name?: string
          phone?: string | null
          project_type?: string | null
          source?: string | null
          status?: string
          timeline?: string | null
          updated_at?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      content_history: {
        Row: {
          created_at: string
          created_by: string | null
          entity_id: string
          entity_type: string
          id: string
          label: string | null
          snapshot: Json
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          entity_id: string
          entity_type: string
          id?: string
          label?: string | null
          snapshot: Json
        }
        Update: {
          created_at?: string
          created_by?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          label?: string | null
          snapshot?: Json
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          consent: boolean
          created_at: string
          email: string
          id: string
          is_active: boolean
          name: string | null
          resend_contact_id: string | null
          source: string | null
          updated_at: string
        }
        Insert: {
          consent?: boolean
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          name?: string | null
          resend_contact_id?: string | null
          source?: string | null
          updated_at?: string
        }
        Update: {
          consent?: boolean
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          name?: string | null
          resend_contact_id?: string | null
          source?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          category: string
          client_name: string | null
          collaborators: Json
          concept: string | null
          cover_height: number | null
          cover_url: string | null
          cover_width: number | null
          created_at: string
          deliverables: Json
          description: string | null
          featured: boolean
          featured_priority: number
          gallery: Json
          gallery_meta: Json
          id: string
          idea: string | null
          image_fit: string
          is_published: boolean
          notes: string | null
          palette: string | null
          role: string | null
          sort_order: number
          span: string | null
          subtitle: string | null
          tags: Json
          title: string
          tools_used: Json
          updated_at: string
          year: string | null
        }
        Insert: {
          category: string
          client_name?: string | null
          collaborators?: Json
          concept?: string | null
          cover_height?: number | null
          cover_url?: string | null
          cover_width?: number | null
          created_at?: string
          deliverables?: Json
          description?: string | null
          featured?: boolean
          featured_priority?: number
          gallery?: Json
          gallery_meta?: Json
          id?: string
          idea?: string | null
          image_fit?: string
          is_published?: boolean
          notes?: string | null
          palette?: string | null
          role?: string | null
          sort_order?: number
          span?: string | null
          subtitle?: string | null
          tags?: Json
          title: string
          tools_used?: Json
          updated_at?: string
          year?: string | null
        }
        Update: {
          category?: string
          client_name?: string | null
          collaborators?: Json
          concept?: string | null
          cover_height?: number | null
          cover_url?: string | null
          cover_width?: number | null
          created_at?: string
          deliverables?: Json
          description?: string | null
          featured?: boolean
          featured_priority?: number
          gallery?: Json
          gallery_meta?: Json
          id?: string
          idea?: string | null
          image_fit?: string
          is_published?: boolean
          notes?: string | null
          palette?: string | null
          role?: string | null
          sort_order?: number
          span?: string | null
          subtitle?: string | null
          tags?: Json
          title?: string
          tools_used?: Json
          updated_at?: string
          year?: string | null
        }
        Relationships: []
      }
      services: {
        Row: {
          description: string | null
          icon: string | null
          id: string
          is_active: boolean
          number: string | null
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          number?: string | null
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          number?: string | null
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      stats: {
        Row: {
          id: string
          is_active: boolean
          label: string
          sort_order: number
          updated_at: string
          value: string
        }
        Insert: {
          id?: string
          is_active?: boolean
          label: string
          sort_order?: number
          updated_at?: string
          value: string
        }
        Update: {
          id?: string
          is_active?: boolean
          label?: string
          sort_order?: number
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
