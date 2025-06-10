export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string
          date: string
          id: string
          organization: string
          position: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          organization: string
          position: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          organization?: string
          position?: string
          updated_at?: string
        }
        Relationships: []
      }
      collaborators: {
        Row: {
          created_at: string
          designation: string
          id: string
          institute: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          designation: string
          id?: string
          institute: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          designation?: string
          id?: string
          institute?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      education: {
        Row: {
          created_at: string
          degree: string
          id: string
          place: string
          speciality: string | null
          updated_at: string
          year: number
        }
        Insert: {
          created_at?: string
          degree: string
          id?: string
          place: string
          speciality?: string | null
          updated_at?: string
          year: number
        }
        Update: {
          created_at?: string
          degree?: string
          id?: string
          place?: string
          speciality?: string | null
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
      experience: {
        Row: {
          created_at: string
          end_date: string | null
          id: string
          place: string
          role: string
          start_date: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          id?: string
          place: string
          role: string
          start_date: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string | null
          id?: string
          place?: string
          role?: string
          start_date?: string
          updated_at?: string
        }
        Relationships: []
      }
      gallery: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          image_url: string
          updated_at: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          image_url: string
          updated_at?: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          image_url?: string
          updated_at?: string
        }
        Relationships: []
      }
      news_events: {
        Row: {
          created_at: string
          date: string
          id: string
          text: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          text: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          text?: string
          updated_at?: string
        }
        Relationships: []
      }
      people: {
        Row: {
          created_at: string
          current_status: Database["public"]["Enums"]["current_status_type"]
          end_date: string | null
          id: string
          name: string
          role: string
          start_date: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_status?: Database["public"]["Enums"]["current_status_type"]
          end_date?: string | null
          id?: string
          name: string
          role: string
          start_date: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_status?: Database["public"]["Enums"]["current_status_type"]
          end_date?: string | null
          id?: string
          name?: string
          role?: string
          start_date?: string
          updated_at?: string
        }
        Relationships: []
      }
      professor_profile: {
        Row: {
          bio: string
          created_at: string
          email: string | null
          id: string
          name: string
          office_location: string | null
          phone: string | null
          profile_image_url: string | null
          research_interests: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          bio: string
          created_at?: string
          email?: string | null
          id?: string
          name: string
          office_location?: string | null
          phone?: string | null
          profile_image_url?: string | null
          research_interests?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          bio?: string
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          office_location?: string | null
          phone?: string | null
          profile_image_url?: string | null
          research_interests?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      publications: {
        Row: {
          authors: string
          created_at: string
          description: string | null
          id: string
          publication_date: string
          publisher: string | null
          source: string | null
          title: string
          total_citations: number | null
          updated_at: string
        }
        Insert: {
          authors: string
          created_at?: string
          description?: string | null
          id?: string
          publication_date: string
          publisher?: string | null
          source?: string | null
          title: string
          total_citations?: number | null
          updated_at?: string
        }
        Update: {
          authors?: string
          created_at?: string
          description?: string | null
          id?: string
          publication_date?: string
          publisher?: string | null
          source?: string | null
          title?: string
          total_citations?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      talks_events: {
        Row: {
          created_at: string
          date: string
          description: string | null
          event: string
          id: string
          organizer: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          description?: string | null
          event: string
          id?: string
          organizer?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          description?: string | null
          event?: string
          id?: string
          organizer?: string | null
          updated_at?: string
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
      current_status_type: "current" | "former" | "visiting" | "emeritus"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      current_status_type: ["current", "former", "visiting", "emeritus"],
    },
  },
} as const
