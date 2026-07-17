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
      airbnb_blocked_dates: {
        Row: {
          created_at: string
          end_date: string
          fetched_at: string
          id: string
          source: string
          start_date: string
          summary: string | null
        }
        Insert: {
          created_at?: string
          end_date: string
          fetched_at?: string
          id?: string
          source?: string
          start_date: string
          summary?: string | null
        }
        Update: {
          created_at?: string
          end_date?: string
          fetched_at?: string
          id?: string
          source?: string
          start_date?: string
          summary?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          audience_tag: string | null
          body: string
          created_at: string
          excerpt: string | null
          hero_image: string | null
          id: string
          published: boolean
          published_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          audience_tag?: string | null
          body: string
          created_at?: string
          excerpt?: string | null
          hero_image?: string | null
          id?: string
          published?: boolean
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          audience_tag?: string | null
          body?: string
          created_at?: string
          excerpt?: string | null
          hero_image?: string | null
          id?: string
          published?: boolean
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          bedrooms_booked: number
          booking_reference: string
          cancelled_at: string | null
          check_in: string
          check_out: string
          confirmed_at: string | null
          created_at: string
          email: string
          guest_name: string
          guests_count: number
          id: string
          notes: string | null
          payment_hold_expires_at: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_reference: string | null
          phone: string
          refund_amount_cents: number | null
          status: Database["public"]["Enums"]["booking_status"]
          stripe_payment_intent_id: string | null
          total_amount_cents: number
          updated_at: string
        }
        Insert: {
          bedrooms_booked: number
          booking_reference: string
          cancelled_at?: string | null
          check_in: string
          check_out: string
          confirmed_at?: string | null
          created_at?: string
          email: string
          guest_name: string
          guests_count: number
          id?: string
          notes?: string | null
          payment_hold_expires_at?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_reference?: string | null
          phone: string
          refund_amount_cents?: number | null
          status?: Database["public"]["Enums"]["booking_status"]
          stripe_payment_intent_id?: string | null
          total_amount_cents: number
          updated_at?: string
        }
        Update: {
          bedrooms_booked?: number
          booking_reference?: string
          cancelled_at?: string | null
          check_in?: string
          check_out?: string
          confirmed_at?: string | null
          created_at?: string
          email?: string
          guest_name?: string
          guests_count?: number
          id?: string
          notes?: string | null
          payment_hold_expires_at?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_reference?: string | null
          phone?: string
          refund_amount_cents?: number | null
          status?: Database["public"]["Enums"]["booking_status"]
          stripe_payment_intent_id?: string | null
          total_amount_cents?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_log: {
        Row: {
          booking_id: string | null
          id: string
          recipient: string
          sent_at: string
          template: string
        }
        Insert: {
          booking_id?: string | null
          id?: string
          recipient: string
          sent_at?: string
          template: string
        }
        Update: {
          booking_id?: string | null
          id?: string
          recipient?: string
          sent_at?: string
          template?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_log_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_settings: {
        Row: {
          airbnb_ical_url: string | null
          bank_account_name: string
          bank_account_number: string
          base_rate_cents: number
          id: number
          particulars_format: string
          payment_mode: Database["public"]["Enums"]["payment_method"]
          second_bedroom_rate_cents: number
          updated_at: string
        }
        Insert: {
          airbnb_ical_url?: string | null
          bank_account_name?: string
          bank_account_number?: string
          base_rate_cents?: number
          id?: number
          particulars_format?: string
          payment_mode?: Database["public"]["Enums"]["payment_method"]
          second_bedroom_rate_cents?: number
          updated_at?: string
        }
        Update: {
          airbnb_ical_url?: string | null
          bank_account_name?: string
          bank_account_number?: string
          base_rate_cents?: number
          id?: number
          particulars_format?: string
          payment_mode?: Database["public"]["Enums"]["payment_method"]
          second_bedroom_rate_cents?: number
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          author_name: string
          body: string
          created_at: string
          id: string
          published: boolean
          rating: number
          sort_order: number
          updated_at: string
        }
        Insert: {
          author_name: string
          body: string
          created_at?: string
          id?: string
          published?: boolean
          rating: number
          sort_order?: number
          updated_at?: string
        }
        Update: {
          author_name?: string
          body?: string
          created_at?: string
          id?: string
          published?: boolean
          rating?: number
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      booking_availability: {
        Row: {
          check_in: string | null
          check_out: string | null
          status: Database["public"]["Enums"]["booking_status"] | null
        }
        Insert: {
          check_in?: string | null
          check_out?: string | null
          status?: Database["public"]["Enums"]["booking_status"] | null
        }
        Update: {
          check_in?: string | null
          check_out?: string | null
          status?: Database["public"]["Enums"]["booking_status"] | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin"
      booking_status: "pending_payment" | "confirmed" | "cancelled" | "refunded"
      payment_method: "bank_transfer" | "stripe"
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
      app_role: ["admin"],
      booking_status: ["pending_payment", "confirmed", "cancelled", "refunded"],
      payment_method: ["bank_transfer", "stripe"],
    },
  },
} as const
