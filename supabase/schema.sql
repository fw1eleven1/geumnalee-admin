-- Geumnalee Admin Supabase Schema
-- Run this SQL in Supabase SQL Editor

-- 와인 카테고리 Enum
CREATE TYPE wine_category AS ENUM ('conventional', 'natural');
CREATE TYPE wine_type AS ENUM ('Red', 'White', 'Orange', 'Sparkling', 'Champagne');
CREATE TYPE tapas_category AS ENUM ('main', 'side');

-- 와인 테이블
CREATE TABLE wines (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    eng_name VARCHAR(255) NOT NULL,
    category wine_category NOT NULL,
    type wine_type NOT NULL,
    year VARCHAR(10),
    alcohol VARCHAR(10),
    origin VARCHAR(255),
    grape VARCHAR(500),
    price INTEGER NOT NULL,
    description TEXT,
    opinion TEXT,
    image_url VARCHAR(500),
    vivino TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 와인 평점 테이블 (1:N 관계)
CREATE TABLE wine_ratings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    wine_id UUID REFERENCES wines(id) ON DELETE CASCADE,
    rating_type VARCHAR(50) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 0 AND rating <= 5),
    max_rating INTEGER DEFAULT 5,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 타파스 테이블
CREATE TABLE tapas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category tapas_category NOT NULL,
    price INTEGER NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 관리자 사용자 테이블 (Supabase Auth와 연동)
CREATE TABLE admin_users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_wines_category ON wines(category);
CREATE INDEX idx_wines_type ON wines(type);
CREATE INDEX idx_wines_is_active ON wines(is_active);
CREATE INDEX idx_wines_display_order ON wines(display_order);
CREATE INDEX idx_tapas_category ON tapas(category);
CREATE INDEX idx_tapas_is_active ON tapas(is_active);
CREATE INDEX idx_tapas_display_order ON tapas(display_order);
CREATE INDEX idx_wine_ratings_wine_id ON wine_ratings(wine_id);

-- Updated_at 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_wines_updated_at
    BEFORE UPDATE ON wines
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tapas_updated_at
    BEFORE UPDATE ON tapas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at
    BEFORE UPDATE ON admin_users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) 정책
ALTER TABLE wines ENABLE ROW LEVEL SECURITY;
ALTER TABLE wine_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tapas ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 읽기: 모든 사용자 허용 (공개 API용)
CREATE POLICY "Allow public read on wines" ON wines
    FOR SELECT USING (true);

CREATE POLICY "Allow public read on wine_ratings" ON wine_ratings
    FOR SELECT USING (true);

CREATE POLICY "Allow public read on tapas" ON tapas
    FOR SELECT USING (true);

-- 쓰기: 인증된 사용자만 허용
CREATE POLICY "Allow authenticated insert on wines" ON wines
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update on wines" ON wines
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated delete on wines" ON wines
    FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert on wine_ratings" ON wine_ratings
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update on wine_ratings" ON wine_ratings
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated delete on wine_ratings" ON wine_ratings
    FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert on tapas" ON tapas
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update on tapas" ON tapas
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated delete on tapas" ON tapas
    FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated read on admin_users" ON admin_users
    FOR SELECT TO authenticated USING (true);
