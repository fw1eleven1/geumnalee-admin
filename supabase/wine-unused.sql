-- 와인 미활용 플래그
-- Supabase SQL Editor 에서 한 번 실행한다. schema.sql 에도 같은 내용이 반영돼 있다.
-- 미활용 와인은 어드민 '미활용' 탭에서만 보이고, 항상 비활성(is_active=false)으로 저장되어 메뉴에 노출되지 않는다.

ALTER TABLE wines ADD COLUMN IF NOT EXISTS is_unused BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_wines_is_unused ON wines(is_unused);
