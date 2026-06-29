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
        Relationships: [];
      };
    };
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    Views: {};
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    Functions: {};
    Enums: {
      user_role: 'owner' | 'staff';
      menu_category: 'dayak' | 'smoked' | 'pedas' | 'minuman';
      expense_category: 'bahan' | 'operasional' | 'gaji' | 'lain';
    };
  };
};

// Named exports for convenience (re-export from Database.Enums)
export type UserRole = Database['public']['Enums']['user_role'];
