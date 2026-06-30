-- 1. Create Branches Table
CREATE TABLE IF NOT EXISTS public.branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default branch
INSERT INTO public.branches (id, name, address) VALUES 
('00000000-0000-0000-0000-000000000001', 'Pusat (Pontianak)', 'Jl. Gajah Mada No. 123')
ON CONFLICT DO NOTHING;

-- Add branch_id to transactions
ALTER TABLE public.transactions 
ADD COLUMN IF NOT EXISTS branch_id UUID REFERENCES public.branches(id) DEFAULT '00000000-0000-0000-0000-000000000001';

-- 2. Create Inventory Table
CREATE TABLE IF NOT EXISTS public.inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID REFERENCES public.branches(id) DEFAULT '00000000-0000-0000-0000-000000000001',
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    stock NUMERIC NOT NULL DEFAULT 0,
    unit TEXT NOT NULL,
    cost_per_unit NUMERIC NOT NULL DEFAULT 0,
    min_stock_alert NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Recipes Table (Links Menu Items to Inventory)
CREATE TABLE IF NOT EXISTS public.recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    menu_item_id UUID REFERENCES public.menu_items(id) ON DELETE CASCADE,
    inventory_id UUID REFERENCES public.inventory(id) ON DELETE CASCADE,
    quantity_required NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Customers Table (CRM)
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    points INTEGER DEFAULT 0,
    total_visits INTEGER DEFAULT 0,
    total_spent NUMERIC DEFAULT 0,
    last_visit TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Link customers to transactions
ALTER TABLE public.transactions
ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES public.customers(id);

-- 5. Create Shifts & Fraud Logs
CREATE TABLE IF NOT EXISTS public.shifts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID REFERENCES public.branches(id) DEFAULT '00000000-0000-0000-0000-000000000001',
    user_id UUID REFERENCES auth.users(id),
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE,
    starting_cash NUMERIC NOT NULL,
    ending_cash NUMERIC,
    status TEXT DEFAULT 'OPEN'
);

CREATE TABLE IF NOT EXISTS public.fraud_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID REFERENCES public.branches(id) DEFAULT '00000000-0000-0000-0000-000000000001',
    user_id UUID REFERENCES auth.users(id),
    shift_id UUID REFERENCES public.shifts(id),
    action_type TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS setup for new tables
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fraud_logs ENABLE ROW LEVEL SECURITY;

-- Note: The following lines will drop policies if they exist so the script is idempotent
DO $$ BEGIN
    DROP POLICY IF EXISTS "Enable all for authenticated users" ON public.branches;
    DROP POLICY IF EXISTS "Enable all for authenticated users" ON public.inventory;
    DROP POLICY IF EXISTS "Enable all for authenticated users" ON public.recipes;
    DROP POLICY IF EXISTS "Enable all for authenticated users" ON public.customers;
    DROP POLICY IF EXISTS "Enable all for authenticated users" ON public.shifts;
    DROP POLICY IF EXISTS "Enable all for authenticated users" ON public.fraud_logs;
EXCEPTION WHEN OTHERS THEN
END $$;

CREATE POLICY "Enable all for authenticated users" ON public.branches FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated users" ON public.inventory FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated users" ON public.recipes FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated users" ON public.customers FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated users" ON public.shifts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated users" ON public.fraud_logs FOR ALL USING (auth.role() = 'authenticated');

-- Insert dummy inventory (using DO block to prevent duplicate keys if rerunning)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.inventory WHERE name = 'Daging Babi Segar (Karkas)') THEN
        INSERT INTO public.inventory (name, category, stock, unit, cost_per_unit, min_stock_alert) VALUES
        ('Daging Babi Segar (Karkas)', 'Bahan Baku Utama', 125.5, 'Kg', 80000, 20),
        ('Bumbu Rica-Rica Dasar', 'Bumbu', 12.0, 'Kg', 45000, 5),
        ('Beras Premium', 'Bahan Pendukung', 250, 'Kg', 14000, 50),
        ('Kotak Takeaway (Besar)', 'Kemasan', 50, 'Pcs', 1200, 100);
    END IF;
END $$;

-- Insert dummy customers
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.customers WHERE phone = '081234567890') THEN
        INSERT INTO public.customers (phone, name, points, total_visits, total_spent, last_visit) VALUES
        ('081234567890', 'Budi Santoso', 15000, 5, 450000, NOW() - INTERVAL '3 days'),
        ('089876543210', 'Agus Salim', 45000, 12, 1200000, NOW() - INTERVAL '1 day');
    END IF;
END $$;
