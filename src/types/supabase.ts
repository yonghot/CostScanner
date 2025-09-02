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
      cost_reports: {
        Row: {
          average_cost: number | null
          cost_trend: number | null
          created_at: string
          data: Json | null
          date_from: string
          date_to: string
          id: string
          report_type: Database["public"]["Enums"]["report_type"]
          total_cost: number | null
          total_ingredients: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          average_cost?: number | null
          cost_trend?: number | null
          created_at?: string
          data?: Json | null
          date_from: string
          date_to: string
          id?: string
          report_type: Database["public"]["Enums"]["report_type"]
          total_cost?: number | null
          total_ingredients?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          average_cost?: number | null
          cost_trend?: number | null
          created_at?: string
          data?: Json | null
          date_from?: string
          date_to?: string
          id?: string
          report_type?: Database["public"]["Enums"]["report_type"]
          total_cost?: number | null
          total_ingredients?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cost_reports_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      ingredients: {
        Row: {
          category: Database["public"]["Enums"]["ingredient_category"]
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          unit: string
          updated_at: string
        }
        Insert: {
          category: Database["public"]["Enums"]["ingredient_category"]
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          unit: string
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["ingredient_category"]
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      price_alerts: {
        Row: {
          alert_type: Database["public"]["Enums"]["alert_type"]
          created_at: string
          id: string
          ingredient_id: string
          is_active: boolean | null
          notification_methods: Database["public"]["Enums"]["notification_channel"][] | null
          threshold_percentage: number | null
          threshold_price: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          alert_type: Database["public"]["Enums"]["alert_type"]
          created_at?: string
          id?: string
          ingredient_id: string
          is_active?: boolean | null
          notification_methods?: Database["public"]["Enums"]["notification_channel"][] | null
          threshold_percentage?: number | null
          threshold_price?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          alert_type?: Database["public"]["Enums"]["alert_type"]
          created_at?: string
          id?: string
          ingredient_id?: string
          is_active?: boolean | null
          notification_methods?: Database["public"]["Enums"]["notification_channel"][] | null
          threshold_percentage?: number | null
          threshold_price?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "price_alerts_ingredient_id_fkey"
            columns: ["ingredient_id"]
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "price_alerts_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      price_records: {
        Row: {
          created_at: string
          id: string
          ingredient_id: string
          notes: string | null
          price: number
          quality_grade: string | null
          scraped_at: string | null
          source: Database["public"]["Enums"]["price_source"] | null
          supplier_id: string
          unit: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          ingredient_id: string
          notes?: string | null
          price: number
          quality_grade?: string | null
          scraped_at?: string | null
          source?: Database["public"]["Enums"]["price_source"] | null
          supplier_id: string
          unit: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          ingredient_id?: string
          notes?: string | null
          price?: number
          quality_grade?: string | null
          scraped_at?: string | null
          source?: Database["public"]["Enums"]["price_source"] | null
          supplier_id?: string
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "price_records_ingredient_id_fkey"
            columns: ["ingredient_id"]
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "price_records_supplier_id_fkey"
            columns: ["supplier_id"]
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          business_name: string | null
          business_type: string | null
          created_at: string
          email: string
          id: string
          is_active: boolean | null
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          business_name?: string | null
          business_type?: string | null
          created_at?: string
          email: string
          id: string
          is_active?: boolean | null
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          business_name?: string | null
          business_type?: string | null
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean | null
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      recipe_ingredients: {
        Row: {
          created_at: string
          id: string
          ingredient_id: string
          notes: string | null
          quantity: number
          recipe_id: string
          unit: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          ingredient_id: string
          notes?: string | null
          quantity: number
          recipe_id: string
          unit: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          ingredient_id?: string
          notes?: string | null
          quantity?: number
          recipe_id?: string
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipe_ingredients_ingredient_id_fkey"
            columns: ["ingredient_id"]
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_ingredients_recipe_id_fkey"
            columns: ["recipe_id"]
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          }
        ]
      }
      recipes: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          profit_margin: number | null
          selling_price: number | null
          servings: number
          total_cost: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          profit_margin?: number | null
          selling_price?: number | null
          servings: number
          total_cost?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          profit_margin?: number | null
          selling_price?: number | null
          servings?: number
          total_cost?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipes_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      suppliers: {
        Row: {
          address: string | null
          contact_person: string | null
          created_at: string
          email: string | null
          id: string
          is_active: boolean | null
          name: string
          phone: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          phone?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          phone?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_recipe_cost: {
        Args: {
          recipe_uuid: string
        }
        Returns: number
      }
      compare_supplier_prices: {
        Args: {
          ingredient_uuid: string
          days_back?: number
        }
        Returns: {
          supplier_id: string
          supplier_name: string
          avg_price: number
          price_count: number
          last_update: string
        }[]
      }
      detect_price_anomalies: {
        Args: {
          ingredient_uuid?: string
          threshold_percentage?: number
        }
        Returns: {
          ingredient_id: string
          ingredient_name: string
          supplier_id: string
          supplier_name: string
          current_price: number
          previous_avg: number
          change_percentage: number
          anomaly_type: string
        }[]
      }
      get_dashboard_summary: {
        Args: {
          user_uuid: string
        }
        Returns: {
          total_recipes: number
          active_price_alerts: number
          avg_recipe_cost: number
          monthly_spending: number
          cost_savings_this_month: number
          top_expensive_ingredient: string
        }[]
      }
      get_latest_ingredient_price: {
        Args: {
          ingredient_uuid: string
        }
        Returns: {
          ingredient_id: string
          supplier_id: string
          supplier_name: string
          price: number
          unit: string
          created_at: string
        }[]
      }
      get_monthly_cost_analysis: {
        Args: {
          user_uuid: string
          months_back?: number
        }
        Returns: {
          month: string
          total_recipes: number
          total_cost: number
          avg_cost_per_recipe: number
          most_expensive_recipe: string
          cost_trend: number
        }[]
      }
      get_price_trend: {
        Args: {
          ingredient_uuid: string
          days_back?: number
        }
        Returns: {
          date: string
          avg_price: number
          min_price: number
          max_price: number
          supplier_count: number
        }[]
      }
      search_ingredients: {
        Args: {
          search_term: string
        }
        Returns: {
          id: string
          name: string
          category: Database["public"]["Enums"]["ingredient_category"]
          unit: string
          description: string
          rank: number
        }[]
      }
    }
    Enums: {
      alert_type: "price_drop" | "price_increase" | "new_supplier"
      ingredient_category: "채소" | "과일" | "육류" | "생선" | "유제품" | "곡물" | "조미료" | "기타"
      notification_channel: "email" | "sms" | "push" | "webhook"
      notification_type: "price_alert" | "cost_report" | "supplier_update" | "system_maintenance" | "marketing" | "security"
      price_source: "manual" | "scraping" | "ocr" | "api"
      report_type: "daily" | "weekly" | "monthly" | "custom"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}