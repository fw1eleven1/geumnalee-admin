-- 글라스 와인 (WINE BY THE GLASS)
-- Supabase SQL Editor 에서 한 번 실행한다. schema.sql 에도 같은 내용이 반영돼 있다.

CREATE TABLE glass_wines (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    wine_id UUID NOT NULL UNIQUE REFERENCES wines(id) ON DELETE CASCADE,
    glass_price INTEGER NOT NULL CHECK (glass_price > 0),
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_glass_wines_is_active ON glass_wines(is_active);
CREATE INDEX idx_glass_wines_display_order ON glass_wines(display_order);

CREATE TRIGGER update_glass_wines_updated_at
    BEFORE UPDATE ON glass_wines
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE glass_wines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on glass_wines" ON glass_wines
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert on glass_wines" ON glass_wines
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update on glass_wines" ON glass_wines
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated delete on glass_wines" ON glass_wines
    FOR DELETE TO authenticated USING (true);
