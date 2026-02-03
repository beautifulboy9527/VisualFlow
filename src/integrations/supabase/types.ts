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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      generations: {
        Row: {
          ai_analysis: Json | null
          completed_at: string | null
          created_at: string
          credits_used: number
          id: string
          input_images: Json
          layout_style: string | null
          modules: Json | null
          output_images: Json
          platform: string | null
          scenes: Json | null
          status: string
          user_id: string
          visual_style: string | null
        }
        Insert: {
          ai_analysis?: Json | null
          completed_at?: string | null
          created_at?: string
          credits_used?: number
          id?: string
          input_images?: Json
          layout_style?: string | null
          modules?: Json | null
          output_images?: Json
          platform?: string | null
          scenes?: Json | null
          status?: string
          user_id: string
          visual_style?: string | null
        }
        Update: {
          ai_analysis?: Json | null
          completed_at?: string | null
          created_at?: string
          credits_used?: number
          id?: string
          input_images?: Json
          layout_style?: string | null
          modules?: Json | null
          output_images?: Json
          platform?: string | null
          scenes?: Json | null
          status?: string
          user_id?: string
          visual_style?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          credits: number
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          credits?: number
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          credits?: number
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      showcase: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          description_zh: string | null
          generation_id: string | null
          id: string
          image_url: string
          is_approved: boolean
          is_featured: boolean
          likes_count: number
          tags: Json | null
          title: string | null
          title_zh: string | null
          user_id: string
          views_count: number
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          description_zh?: string | null
          generation_id?: string | null
          id?: string
          image_url: string
          is_approved?: boolean
          is_featured?: boolean
          likes_count?: number
          tags?: Json | null
          title?: string | null
          title_zh?: string | null
          user_id: string
          views_count?: number
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          description_zh?: string | null
          generation_id?: string | null
          id?: string
          image_url?: string
          is_approved?: boolean
          is_featured?: boolean
          likes_count?: number
          tags?: Json | null
          title?: string | null
          title_zh?: string | null
          user_id?: string
          views_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "showcase_generation_id_fkey"
            columns: ["generation_id"]
            isOneToOne: false
            referencedRelation: "generations"
            referencedColumns: ["id"]
          },
        ]
      }
      templates: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          description_zh: string | null
          id: string
          is_featured: boolean
          is_public: boolean
          layout_style: string | null
          modules: Json | null
          name: string
          name_zh: string | null
          platform: string | null
          scenes: Json | null
          tags: Json | null
          thumbnail_url: string | null
          updated_at: string
          use_count: number
          user_id: string | null
          visual_style: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          description_zh?: string | null
          id?: string
          is_featured?: boolean
          is_public?: boolean
          layout_style?: string | null
          modules?: Json | null
          name: string
          name_zh?: string | null
          platform?: string | null
          scenes?: Json | null
          tags?: Json | null
          thumbnail_url?: string | null
          updated_at?: string
          use_count?: number
          user_id?: string | null
          visual_style?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          description_zh?: string | null
          id?: string
          is_featured?: boolean
          is_public?: boolean
          layout_style?: string | null
          modules?: Json | null
          name?: string
          name_zh?: string | null
          platform?: string | null
          scenes?: Json | null
          tags?: Json | null
          thumbnail_url?: string | null
          updated_at?: string
          use_count?: number
          user_id?: string | null
          visual_style?: string | null
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string
          custom_presets: Json | null
          frequent_platforms: Json | null
          frequent_scenes: Json | null
          frequent_visual_styles: Json | null
          id: string
          last_modules: Json | null
          last_platform: string | null
          updated_at: string
          usage_count: number
          user_id: string
        }
        Insert: {
          created_at?: string
          custom_presets?: Json | null
          frequent_platforms?: Json | null
          frequent_scenes?: Json | null
          frequent_visual_styles?: Json | null
          id?: string
          last_modules?: Json | null
          last_platform?: string | null
          updated_at?: string
          usage_count?: number
          user_id: string
        }
        Update: {
          created_at?: string
          custom_presets?: Json | null
          frequent_platforms?: Json | null
          frequent_scenes?: Json | null
          frequent_visual_styles?: Json | null
          id?: string
          last_modules?: Json | null
          last_platform?: string | null
          updated_at?: string
          usage_count?: number
          user_id?: string
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
