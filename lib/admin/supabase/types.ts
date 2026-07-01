// Will be regenerated from Supabase after SQL migrations run.
// For now, minimal types for compile. Will be replaced by:
//   npx supabase gen types typescript --project-id <PROJECT_ID> --schema public
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          role: 'owner' | 'staff';
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          role: 'owner' | 'staff';
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          role?: 'owner' | 'staff';
          is_active?: boolean;
          created_at?: string;
        };
        // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        Relationships: [];
      };
      menu_items: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price_cents: number;
          category: 'dayak' | 'smoked' | 'pedas' | 'minuman';
          photo_url: string | null;
          badge: string | null;
          is_active: boolean;
          needs_owner_confirmation: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          price_cents: number;
          category: 'dayak' | 'smoked' | 'pedas' | 'minuman';
          photo_url?: string | null;
          badge?: string | null;
          is_active?: boolean;
          needs_owner_confirmation?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          price_cents?: number;
          category?: 'dayak' | 'smoked' | 'pedas' | 'minuman';
          photo_url?: string | null;
          badge?: string | null;
          is_active?: boolean;
          needs_owner_confirmation?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        Relationships: [];
      };
      transactions: {
        Row: {
          id: string;
          staff_id: string;
          total_cents: number;
          paid_cents: number;
          change_cents: number;
          payment_method: 'cash';
          note: string | null;
          customer_id: string | null;
          branch_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          staff_id: string;
          total_cents: number;
          paid_cents: number;
          payment_method?: 'cash';
          note?: string | null;
          customer_id?: string | null;
          branch_id?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          staff_id?: string;
          total_cents?: number;
          paid_cents?: number;
          payment_method?: 'cash';
          note?: string | null;
          customer_id?: string | null;
          branch_id?: string;
          created_at?: string;
        };
        // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        Relationships: [];
      };
      transaction_items: {
        Row: {
          id: string;
          transaction_id: string;
          menu_item_id: string;
          name_snapshot: string;
          price_cents_snapshot: number;
          quantity: number;
          subtotal_cents: number;
        };
        Insert: {
          id?: string;
          transaction_id: string;
          menu_item_id: string;
          name_snapshot: string;
          price_cents_snapshot: number;
          quantity: number;
          subtotal_cents: number;
        };
        Update: {
          id?: string;
          transaction_id?: string;
          menu_item_id?: string;
          name_snapshot?: string;
          price_cents_snapshot?: number;
          quantity?: number;
          subtotal_cents?: number;
        };
        // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        Relationships: [];
      };
      expenses: {
        Row: {
          id: string;
          category: 'bahan' | 'operasional' | 'gaji' | 'lain';
          amount_cents: number;
          description: string | null;
          incurred_by: string | null;
          incurred_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          category: 'bahan' | 'operasional' | 'gaji' | 'lain';
          amount_cents: number;
          description?: string | null;
          incurred_by?: string | null;
          incurred_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          category?: 'bahan' | 'operasional' | 'gaji' | 'lain';
          amount_cents?: number;
          description?: string | null;
          incurred_by?: string | null;
          incurred_at?: string;
          created_at?: string;
        };
        // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        Relationships: [];
      };
      customers: {
        Row: {
          id: string;
          phone: string;
          points: number;
          total_visits: number;
          total_spent: number;
          last_visit: string | null;
        };
        Insert: {
          id?: string;
          phone: string;
          points?: number;
          total_visits?: number;
          total_spent?: number;
          last_visit?: string | null;
        };
        Update: {
          id?: string;
          phone?: string;
          points?: number;
          total_visits?: number;
          total_spent?: number;
          last_visit?: string | null;
        };
        // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        Relationships: [];
      };
      inventory: {
        Row: {
          id: string;
          branch_id: string;
          name: string;
          category: string;
          stock: number;
          unit: string;
          min_stock: number;
          last_restock: string | null;
        };
        Insert: {
          id?: string;
          branch_id?: string;
          name: string;
          category: string;
          stock?: number;
          unit: string;
          min_stock?: number;
          last_restock?: string | null;
        };
        Update: {
          id?: string;
          branch_id?: string;
          name?: string;
          category?: string;
          stock?: number;
          unit?: string;
          min_stock?: number;
          last_restock?: string | null;
        };
        // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        Relationships: [];
      };
      recipes: {
        Row: {
          id: string;
          menu_item_id: string;
          inventory_id: string;
          quantity_required: number;
        };
        Insert: {
          id?: string;
          menu_item_id: string;
          inventory_id: string;
          quantity_required: number;
        };
        Update: {
          id?: string;
          menu_item_id?: string;
          inventory_id?: string;
          quantity_required?: number;
        };
        // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        Relationships: [];
      };
      ai_summaries: {
        Row: {
          id: string;
          period_start: string;
          period_end: string;
          summary_text: string;
          generated_at: string;
        };
        Insert: {
          id?: string;
          period_start: string;
          period_end: string;
          summary_text: string;
          generated_at?: string;
        };
        Update: {
          id?: string;
          period_start?: string;
          period_end?: string;
          summary_text?: string;
          generated_at?: string;
        };
        // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        Relationships: [];
      };
    };
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    Views: {};
    Functions: {
      current_user_role: {
        Args: Record<string, never>;
        Returns: 'owner' | 'staff';
      };
    };
    Enums: {
      user_role: 'owner' | 'staff';
      menu_category: 'dayak' | 'smoked' | 'pedas' | 'minuman';
      expense_category: 'bahan' | 'operasional' | 'gaji' | 'lain';
    };
  };
};

// Named exports for convenience (re-export from Database.Enums)
export type UserRole = Database['public']['Enums']['user_role'];
export type MenuCategory = Database['public']['Enums']['menu_category'];
export type ExpenseCategory = Database['public']['Enums']['expense_category'];
export type SummaryPeriod = 'today' | '7d' | '30d';
