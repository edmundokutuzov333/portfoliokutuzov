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
      admin_audit_log: {
        Row: {
          action: string
          actor_email: string | null
          actor_user_id: string | null
          after_data: Json | null
          before_data: Json | null
          created_at: string
          entity_id: string
          entity_label: string | null
          entity_type: string
          id: string
          metadata: Json
        }
        Insert: {
          action: string
          actor_email?: string | null
          actor_user_id?: string | null
          after_data?: Json | null
          before_data?: Json | null
          created_at?: string
          entity_id: string
          entity_label?: string | null
          entity_type: string
          id?: string
          metadata?: Json
        }
        Update: {
          action?: string
          actor_email?: string | null
          actor_user_id?: string | null
          after_data?: Json | null
          before_data?: Json | null
          created_at?: string
          entity_id?: string
          entity_label?: string | null
          entity_type?: string
          id?: string
          metadata?: Json
        }
        Relationships: []
      }
      admin_drafts: {
        Row: {
          baseline_snapshot: Json
          baseline_updated_at: string | null
          created_at: string
          created_by: string | null
          entity_id: string
          entity_type: string
          id: string
          label: string
          payload: Json
          publish_note: string | null
          published_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          baseline_snapshot: Json
          baseline_updated_at?: string | null
          created_at?: string
          created_by?: string | null
          entity_id: string
          entity_type: string
          id?: string
          label: string
          payload: Json
          publish_note?: string | null
          published_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          baseline_snapshot?: Json
          baseline_updated_at?: string | null
          created_at?: string
          created_by?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          label?: string
          payload?: Json
          publish_note?: string | null
          published_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          updated_by?: string | null
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
          booking_status: string
          client_id: string | null
          created_at: string
          email: string
          id: string
          lead_id: string | null
          name: string
          note: string | null
          owner_user_id: string | null
          preferred_date: string | null
          preferred_time: string | null
          status: string
          timezone: string | null
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          booking_status?: string
          client_id?: string | null
          created_at?: string
          email: string
          id?: string
          lead_id?: string | null
          name: string
          note?: string | null
          owner_user_id?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          status?: string
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          booking_status?: string
          client_id?: string | null
          created_at?: string
          email?: string
          id?: string
          lead_id?: string | null
          name?: string
          note?: string | null
          owner_user_id?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          status?: string
          timezone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_requests_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_requests_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "crm_lead_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_requests_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "crm_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      briefing_submissions: {
        Row: {
          admin_notes: string | null
          attachments: Json
          budget_range: string | null
          company_name: string | null
          confirmation_sent_at: string | null
          country: string | null
          created_at: string
          currency: string
          deadline: string | null
          email: string
          exact_amount: number | null
          full_name: string
          id: string
          invoice_amount: number | null
          invoice_currency: string | null
          invoice_deposit_amount: number | null
          invoice_deposit_pct: number
          invoice_discount_amount: number | null
          invoice_discount_pct: number
          invoice_due_date: string | null
          invoice_issue_date: string | null
          invoice_last_reminder_at: string | null
          invoice_notes: string | null
          invoice_number: string | null
          invoice_paid_at: string | null
          invoice_paid_reported_at: string | null
          invoice_payment_method: string | null
          invoice_payment_proof_path: string | null
          invoice_payment_ref: string | null
          invoice_pdf_path: string | null
          invoice_public_token: string | null
          invoice_reminder_count: number
          invoice_sent_at: string | null
          invoice_status: string | null
          invoice_subtotal: number | null
          invoice_tax_amount: number | null
          invoice_tax_label: string | null
          invoice_tax_pct: number
          invoice_terms: string | null
          invoice_total: number | null
          invoice_viewed_at: string | null
          is_starred: boolean
          landing_page: string | null
          lead_score: number | null
          lead_signals: Json
          lead_tier: string | null
          message: string
          negotiable: boolean
          phone: string | null
          position: string | null
          preferred_contact_method: string | null
          project_type: string
          reference_links: Json
          reference_project_id: string | null
          source: string | null
          source_case_slug: string | null
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
          confirmation_sent_at?: string | null
          country?: string | null
          created_at?: string
          currency?: string
          deadline?: string | null
          email: string
          exact_amount?: number | null
          full_name: string
          id?: string
          invoice_amount?: number | null
          invoice_currency?: string | null
          invoice_deposit_amount?: number | null
          invoice_deposit_pct?: number
          invoice_discount_amount?: number | null
          invoice_discount_pct?: number
          invoice_due_date?: string | null
          invoice_issue_date?: string | null
          invoice_last_reminder_at?: string | null
          invoice_notes?: string | null
          invoice_number?: string | null
          invoice_paid_at?: string | null
          invoice_paid_reported_at?: string | null
          invoice_payment_method?: string | null
          invoice_payment_proof_path?: string | null
          invoice_payment_ref?: string | null
          invoice_pdf_path?: string | null
          invoice_public_token?: string | null
          invoice_reminder_count?: number
          invoice_sent_at?: string | null
          invoice_status?: string | null
          invoice_subtotal?: number | null
          invoice_tax_amount?: number | null
          invoice_tax_label?: string | null
          invoice_tax_pct?: number
          invoice_terms?: string | null
          invoice_total?: number | null
          invoice_viewed_at?: string | null
          is_starred?: boolean
          landing_page?: string | null
          lead_score?: number | null
          lead_signals?: Json
          lead_tier?: string | null
          message: string
          negotiable?: boolean
          phone?: string | null
          position?: string | null
          preferred_contact_method?: string | null
          project_type: string
          reference_links?: Json
          reference_project_id?: string | null
          source?: string | null
          source_case_slug?: string | null
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
          confirmation_sent_at?: string | null
          country?: string | null
          created_at?: string
          currency?: string
          deadline?: string | null
          email?: string
          exact_amount?: number | null
          full_name?: string
          id?: string
          invoice_amount?: number | null
          invoice_currency?: string | null
          invoice_deposit_amount?: number | null
          invoice_deposit_pct?: number
          invoice_discount_amount?: number | null
          invoice_discount_pct?: number
          invoice_due_date?: string | null
          invoice_issue_date?: string | null
          invoice_last_reminder_at?: string | null
          invoice_notes?: string | null
          invoice_number?: string | null
          invoice_paid_at?: string | null
          invoice_paid_reported_at?: string | null
          invoice_payment_method?: string | null
          invoice_payment_proof_path?: string | null
          invoice_payment_ref?: string | null
          invoice_pdf_path?: string | null
          invoice_public_token?: string | null
          invoice_reminder_count?: number
          invoice_sent_at?: string | null
          invoice_status?: string | null
          invoice_subtotal?: number | null
          invoice_tax_amount?: number | null
          invoice_tax_label?: string | null
          invoice_tax_pct?: number
          invoice_terms?: string | null
          invoice_total?: number | null
          invoice_viewed_at?: string | null
          is_starred?: boolean
          landing_page?: string | null
          lead_score?: number | null
          lead_signals?: Json
          lead_tier?: string | null
          message?: string
          negotiable?: boolean
          phone?: string | null
          position?: string | null
          preferred_contact_method?: string | null
          project_type?: string
          reference_links?: Json
          reference_project_id?: string | null
          source?: string | null
          source_case_slug?: string | null
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
          kind: string
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
          kind?: string
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
          kind?: string
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
          action: string | null
          created_at: string
          created_by: string | null
          entity_id: string
          entity_type: string
          id: string
          label: string | null
          snapshot: Json
        }
        Insert: {
          action?: string | null
          created_at?: string
          created_by?: string | null
          entity_id: string
          entity_type: string
          id?: string
          label?: string | null
          snapshot: Json
        }
        Update: {
          action?: string | null
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
      crm_activities: {
        Row: {
          activity_type: string
          actor_user_id: string | null
          body: string
          created_at: string
          id: string
          lead_id: string
          metadata: Json
        }
        Insert: {
          activity_type: string
          actor_user_id?: string | null
          body: string
          created_at?: string
          id?: string
          lead_id: string
          metadata?: Json
        }
        Update: {
          activity_type?: string
          actor_user_id?: string | null
          body?: string
          created_at?: string
          id?: string
          lead_id?: string
          metadata?: Json
        }
        Relationships: [
          {
            foreignKeyName: "crm_activities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "crm_lead_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_activities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "crm_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_leads: {
        Row: {
          client_id: string | null
          created_at: string
          id: string
          next_action_at: string | null
          notes: string | null
          owner_user_id: string | null
          project_id: string | null
          source_id: string
          source_type: string
          stage: string
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          id?: string
          next_action_at?: string | null
          notes?: string | null
          owner_user_id?: string | null
          project_id?: string | null
          source_id: string
          source_type: string
          stage?: string
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          created_at?: string
          id?: string
          next_action_at?: string | null
          notes?: string | null
          owner_user_id?: string | null
          project_id?: string | null
          source_id?: string
          source_type?: string
          stage?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_leads_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_leads_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_payments: {
        Row: {
          amount: number
          briefing_id: string | null
          created_at: string
          created_by: string | null
          currency: string
          id: string
          lead_id: string | null
          method: string | null
          notes: string | null
          paid_at: string | null
          proof_path: string | null
          reference: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          briefing_id?: string | null
          created_at?: string
          created_by?: string | null
          currency: string
          id?: string
          lead_id?: string | null
          method?: string | null
          notes?: string | null
          paid_at?: string | null
          proof_path?: string | null
          reference?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          briefing_id?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          id?: string
          lead_id?: string | null
          method?: string | null
          notes?: string | null
          paid_at?: string | null
          proof_path?: string | null
          reference?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_payments_briefing_id_fkey"
            columns: ["briefing_id"]
            isOneToOne: false
            referencedRelation: "briefing_submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_payments_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "crm_lead_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_payments_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "crm_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_tasks: {
        Row: {
          created_at: string
          due_at: string
          id: string
          kind: string
          lead_id: string
          metadata: Json
          owner_user_id: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          due_at: string
          id?: string
          kind: string
          lead_id: string
          metadata?: Json
          owner_user_id?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          due_at?: string
          id?: string
          kind?: string
          lead_id?: string
          metadata?: Json
          owner_user_id?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_tasks_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "crm_lead_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_tasks_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "crm_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_counters: {
        Row: {
          last_number: number
          updated_at: string
          year: number
        }
        Insert: {
          last_number?: number
          updated_at?: string
          year: number
        }
        Update: {
          last_number?: number
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
      invoice_events: {
        Row: {
          actor: string | null
          briefing_id: string
          created_at: string
          detail: Json
          event_type: string
          id: string
          recipients: string[] | null
        }
        Insert: {
          actor?: string | null
          briefing_id: string
          created_at?: string
          detail?: Json
          event_type: string
          id?: string
          recipients?: string[] | null
        }
        Update: {
          actor?: string | null
          briefing_id?: string
          created_at?: string
          detail?: Json
          event_type?: string
          id?: string
          recipients?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_events_briefing_id_fkey"
            columns: ["briefing_id"]
            isOneToOne: false
            referencedRelation: "briefing_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_line_items: {
        Row: {
          briefing_id: string
          created_at: string
          description: string
          detail: string | null
          discount_pct: number
          id: string
          qty: number
          sort_order: number
          unit: string
          unit_price: number
          updated_at: string
        }
        Insert: {
          briefing_id: string
          created_at?: string
          description: string
          detail?: string | null
          discount_pct?: number
          id?: string
          qty?: number
          sort_order?: number
          unit?: string
          unit_price?: number
          updated_at?: string
        }
        Update: {
          briefing_id?: string
          created_at?: string
          description?: string
          detail?: string | null
          discount_pct?: number
          id?: string
          qty?: number
          sort_order?: number
          unit?: string
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoice_line_items_briefing_id_fkey"
            columns: ["briefing_id"]
            isOneToOne: false
            referencedRelation: "briefing_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      media_assets: {
        Row: {
          alt_text: string | null
          created_at: string
          created_by: string | null
          entity_id: string | null
          entity_type: string | null
          filename: string
          height: number | null
          id: string
          is_public: boolean
          kind: string
          mime_type: string
          public_url: string
          size_bytes: number
          storage_path: string
          updated_at: string
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          created_by?: string | null
          entity_id?: string | null
          entity_type?: string | null
          filename: string
          height?: number | null
          id?: string
          is_public?: boolean
          kind: string
          mime_type: string
          public_url: string
          size_bytes: number
          storage_path: string
          updated_at?: string
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          created_by?: string | null
          entity_id?: string | null
          entity_type?: string | null
          filename?: string
          height?: number | null
          id?: string
          is_public?: boolean
          kind?: string
          mime_type?: string
          public_url?: string
          size_bytes?: number
          storage_path?: string
          updated_at?: string
          width?: number | null
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
          status: string
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
          status?: string
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
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_credits: {
        Row: {
          created_at: string
          id: string
          name: string
          organization: string | null
          project_id: string
          role: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          organization?: string | null
          project_id: string
          role: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          organization?: string | null
          project_id?: string
          role?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_credits_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_media: {
        Row: {
          alt: string | null
          caption: string | null
          created_at: string
          height: number | null
          id: string
          is_featured: boolean
          is_published: boolean
          media_type: string
          poster_url: string | null
          project_id: string
          sort_order: number
          url: string
          width: number | null
        }
        Insert: {
          alt?: string | null
          caption?: string | null
          created_at?: string
          height?: number | null
          id?: string
          is_featured?: boolean
          is_published?: boolean
          media_type: string
          poster_url?: string | null
          project_id: string
          sort_order?: number
          url: string
          width?: number | null
        }
        Update: {
          alt?: string | null
          caption?: string | null
          created_at?: string
          height?: number | null
          id?: string
          is_featured?: boolean
          is_published?: boolean
          media_type?: string
          poster_url?: string | null
          project_id?: string
          sort_order?: number
          url?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "project_media_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_metrics: {
        Row: {
          created_at: string
          id: string
          label: string
          project_id: string
          sort_order: number
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          label: string
          project_id: string
          sort_order?: number
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          project_id?: string
          sort_order?: number
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_metrics_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_relations: {
        Row: {
          id: string
          project_id: string
          related_project_id: string
          relation_type: string
          sort_order: number
        }
        Insert: {
          id?: string
          project_id: string
          related_project_id: string
          relation_type?: string
          sort_order?: number
        }
        Update: {
          id?: string
          project_id?: string
          related_project_id?: string
          relation_type?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_relations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_relations_related_project_id_fkey"
            columns: ["related_project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_sections: {
        Row: {
          body: string | null
          created_at: string
          heading: string | null
          id: string
          is_published: boolean
          project_id: string
          section_type: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          heading?: string | null
          id?: string
          is_published?: boolean
          project_id: string
          section_type: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          body?: string | null
          created_at?: string
          heading?: string | null
          id?: string
          is_published?: boolean
          project_id?: string
          section_type?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_sections_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          category: string
          client_id: string | null
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
          slug: string | null
          sort_order: number
          span: string | null
          subtitle: string | null
          tags: Json
          title: string
          tools_used: Json
          updated_at: string
          video_provider: string | null
          video_url: string | null
          year: string | null
        }
        Insert: {
          category: string
          client_id?: string | null
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
          slug?: string | null
          sort_order?: number
          span?: string | null
          subtitle?: string | null
          tags?: Json
          title: string
          tools_used?: Json
          updated_at?: string
          video_provider?: string | null
          video_url?: string | null
          year?: string | null
        }
        Update: {
          category?: string
          client_id?: string | null
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
          slug?: string | null
          sort_order?: number
          span?: string | null
          subtitle?: string | null
          tags?: Json
          title?: string
          tools_used?: Json
          updated_at?: string
          video_provider?: string | null
          video_url?: string | null
          year?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
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
      studio_cards: {
        Row: {
          company: string
          created_at: string
          design_document: Json
          draft_token: string | null
          email: string
          id: string
          last_saved_at: string | null
          name: string
          phone: string
          public_enabled: boolean
          published_at: string | null
          revision: number
          role: string
          session_id: string
          share_token: string | null
          status: string
          updated_at: string
          website: string
        }
        Insert: {
          company?: string
          created_at?: string
          design_document: Json
          draft_token?: string | null
          email?: string
          id?: string
          last_saved_at?: string | null
          name?: string
          phone?: string
          public_enabled?: boolean
          published_at?: string | null
          revision?: number
          role?: string
          session_id: string
          share_token?: string | null
          status?: string
          updated_at?: string
          website?: string
        }
        Update: {
          company?: string
          created_at?: string
          design_document?: Json
          draft_token?: string | null
          email?: string
          id?: string
          last_saved_at?: string | null
          name?: string
          phone?: string
          public_enabled?: boolean
          published_at?: string | null
          revision?: number
          role?: string
          session_id?: string
          share_token?: string | null
          status?: string
          updated_at?: string
          website?: string
        }
        Relationships: []
      }
      studio_waitlist: {
        Row: {
          created_at: string
          email: string
          id: string
          source: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          source?: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          source?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      crm_inbox: {
        Row: {
          company_name: string | null
          created_at: string | null
          email: string | null
          kind: string | null
          lead_id: string | null
          preview: string | null
          priority: number | null
          source_id: string | null
          stage: string | null
          status: string | null
          title: string | null
        }
        Relationships: []
      }
      crm_lead_profiles: {
        Row: {
          attachments: Json | null
          briefing_urgency: string | null
          budget_amount: number | null
          budget_currency: string | null
          budget_label: string | null
          client_id: string | null
          company_name: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string | null
          invoice_currency: string | null
          invoice_due_date: string | null
          invoice_number: string | null
          invoice_paid_at: string | null
          invoice_payment_method: string | null
          invoice_payment_proof_path: string | null
          invoice_payment_ref: string | null
          invoice_sent_at: string | null
          invoice_status: string | null
          invoice_total: number | null
          invoice_viewed_at: string | null
          lead_score: number | null
          lead_signals: Json | null
          lead_tier: string | null
          linked_client_name: string | null
          message: string | null
          next_action_at: string | null
          notes: string | null
          owner_user_id: string | null
          phone: string | null
          project_id: string | null
          project_slug: string | null
          project_title: string | null
          project_type: string | null
          source: string | null
          source_id: string | null
          source_type: string | null
          stage: string | null
          timeline: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_leads_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_leads_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      admin_create_project_from_lead: {
        Args: { p_lead_id: string }
        Returns: string
      }
      admin_editable_entity_directory: { Args: never; Returns: Json }
      admin_get_role: { Args: never; Returns: string }
      admin_has_permission: { Args: { p_permission: string }; Returns: boolean }
      admin_publish_drafts: {
        Args: { p_draft_ids: string[]; p_publish_note?: string }
        Returns: {
          draft_id: string
          entity_id: string
          entity_type: string
        }[]
      }
      admin_record_invoice_payment: {
        Args: {
          p_amount: number
          p_briefing_id: string
          p_currency: string
          p_lead_id: string
          p_method?: string
          p_notes?: string
          p_paid_at?: string
          p_reference?: string
          p_status?: string
        }
        Returns: Json
      }
      admin_reorder_about_method: {
        Args: { p_ids: string[] }
        Returns: boolean
      }
      admin_reorder_projects: {
        Args: {
          p_other_order: number
          p_other_project_id: string
          p_project_id: string
          p_project_order: number
        }
        Returns: boolean
      }
      admin_reorder_services: { Args: { p_ids: string[] }; Returns: boolean }
      admin_reorder_stats: { Args: { p_ids: string[] }; Returns: boolean }
      admin_restore_audit_state: {
        Args: {
          p_audit_id: string
          p_entity_id: string
          p_entity_type: string
          p_snapshot: Json
        }
        Returns: Json
      }
      admin_system_health_db: { Args: never; Returns: Json }
      admin_user_directory: {
        Args: never
        Returns: {
          email: string
          role: string
          user_id: string
        }[]
      }
      is_admin: { Args: never; Returns: boolean }
      next_invoice_number: { Args: { prefix?: string }; Returns: string }
      slugify: { Args: { input: string }; Returns: string }
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
