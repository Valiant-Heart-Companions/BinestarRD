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
      answer_votes: {
        Row: {
          answer_id: string
          voter_key: string
        }
        Insert: {
          answer_id: string
          voter_key: string
        }
        Update: {
          answer_id?: string
          voter_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "answer_votes_answer_id_fkey"
            columns: ["answer_id"]
            isOneToOne: false
            referencedRelation: "answers"
            referencedColumns: ["id"]
          },
        ]
      }
      answers: {
        Row: {
          body: string
          created_at: string
          id: string
          provider_id: string
          question_id: string
          status: Database["public"]["Enums"]["content_status"]
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          provider_id: string
          question_id: string
          status?: Database["public"]["Enums"]["content_status"]
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          provider_id?: string
          question_id?: string
          status?: Database["public"]["Enums"]["content_status"]
        }
        Relationships: [
          {
            foreignKeyName: "answers_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      claims: {
        Row: {
          claimant_email: string | null
          claimant_id: string | null
          claimant_whatsapp: string | null
          created_at: string
          id: string
          message: string | null
          provider_id: string
          reviewed_by: string | null
          status: Database["public"]["Enums"]["claim_status_review"]
        }
        Insert: {
          claimant_email?: string | null
          claimant_id?: string | null
          claimant_whatsapp?: string | null
          created_at?: string
          id?: string
          message?: string | null
          provider_id: string
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["claim_status_review"]
        }
        Update: {
          claimant_email?: string | null
          claimant_id?: string | null
          claimant_whatsapp?: string | null
          created_at?: string
          id?: string
          message?: string | null
          provider_id?: string
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["claim_status_review"]
        }
        Relationships: [
          {
            foreignKeyName: "claims_claimant_id_fkey"
            columns: ["claimant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claims_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claims_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      insurances: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      provider_insurances: {
        Row: {
          insurance_id: string
          provider_id: string
        }
        Insert: {
          insurance_id: string
          provider_id: string
        }
        Update: {
          insurance_id?: string
          provider_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_insurances_insurance_id_fkey"
            columns: ["insurance_id"]
            isOneToOne: false
            referencedRelation: "insurances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_insurances_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_specialties: {
        Row: {
          provider_id: string
          specialty_id: string
        }
        Insert: {
          provider_id: string
          specialty_id: string
        }
        Update: {
          provider_id?: string
          specialty_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_specialties_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_specialties_specialty_id_fkey"
            columns: ["specialty_id"]
            isOneToOne: false
            referencedRelation: "specialties"
            referencedColumns: ["id"]
          },
        ]
      }
      providers: {
        Row: {
          bio: string | null
          claim_status: Database["public"]["Enums"]["claim_status"]
          created_at: string
          full_name: string
          id: string
          image_url: string | null
          is_founding_member: boolean
          lat: number | null
          license_number: string | null
          listing_status: Database["public"]["Enums"]["listing_status"]
          lng: number | null
          location_text: string | null
          neighborhood: string | null
          owner_id: string | null
          phone: string | null
          price: number | null
          role: Database["public"]["Enums"]["provider_role"]
          slug: string
          source: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          bio?: string | null
          claim_status?: Database["public"]["Enums"]["claim_status"]
          created_at?: string
          full_name: string
          id?: string
          image_url?: string | null
          is_founding_member?: boolean
          lat?: number | null
          license_number?: string | null
          listing_status?: Database["public"]["Enums"]["listing_status"]
          lng?: number | null
          location_text?: string | null
          neighborhood?: string | null
          owner_id?: string | null
          phone?: string | null
          price?: number | null
          role: Database["public"]["Enums"]["provider_role"]
          slug: string
          source?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          bio?: string | null
          claim_status?: Database["public"]["Enums"]["claim_status"]
          created_at?: string
          full_name?: string
          id?: string
          image_url?: string | null
          is_founding_member?: boolean
          lat?: number | null
          license_number?: string | null
          listing_status?: Database["public"]["Enums"]["listing_status"]
          lng?: number | null
          location_text?: string | null
          neighborhood?: string | null
          owner_id?: string | null
          phone?: string | null
          price?: number | null
          role?: Database["public"]["Enums"]["provider_role"]
          slug?: string
          source?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "providers_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      question_votes: {
        Row: {
          question_id: string
          voter_key: string
        }
        Insert: {
          question_id: string
          voter_key: string
        }
        Update: {
          question_id?: string
          voter_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_votes_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          author_id: string | null
          body: string
          category: string | null
          created_at: string
          id: string
          slug: string
          status: Database["public"]["Enums"]["content_status"]
          title: string
        }
        Insert: {
          author_id?: string | null
          body: string
          category?: string | null
          created_at?: string
          id?: string
          slug: string
          status?: Database["public"]["Enums"]["content_status"]
          title: string
        }
        Update: {
          author_id?: string | null
          body?: string
          category?: string | null
          created_at?: string
          id?: string
          slug?: string
          status?: Database["public"]["Enums"]["content_status"]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          author_id: string
          body: string | null
          created_at: string
          id: string
          provider_id: string
          rating: number
          status: Database["public"]["Enums"]["content_status"]
        }
        Insert: {
          author_id: string
          body?: string | null
          created_at?: string
          id?: string
          provider_id: string
          rating: number
          status?: Database["public"]["Enums"]["content_status"]
        }
        Update: {
          author_id?: string
          body?: string | null
          created_at?: string
          id?: string
          provider_id?: string
          rating?: number
          status?: Database["public"]["Enums"]["content_status"]
        }
        Relationships: [
          {
            foreignKeyName: "reviews_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      specialties: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      provider_ratings: {
        Row: {
          provider_id: string | null
          rating: number | null
          review_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      approve_claim: { Args: { p_claim_id: string }; Returns: undefined }
      is_admin: { Args: Record<PropertyKey, never>; Returns: boolean }
      reject_claim: { Args: { p_claim_id: string }; Returns: undefined }
    }
    Enums: {
      claim_status: "unclaimed" | "pending" | "claimed"
      claim_status_review: "pending" | "approved" | "rejected"
      content_status: "pending" | "published" | "flagged" | "removed"
      listing_status: "active" | "hidden" | "removal_requested"
      provider_role: "psychologist" | "psychiatrist"
      user_role: "patient" | "provider" | "admin"
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
      claim_status: ["unclaimed", "pending", "claimed"],
      claim_status_review: ["pending", "approved", "rejected"],
      content_status: ["pending", "published", "flagged", "removed"],
      listing_status: ["active", "hidden", "removal_requested"],
      provider_role: ["psychologist", "psychiatrist"],
      user_role: ["patient", "provider", "admin"],
    },
  },
} as const
