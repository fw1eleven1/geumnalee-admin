# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

금나리(Geumnalee) 와인바의 메뉴를 관리하는 Next.js 14 어드민 대시보드. 별도의 메뉴 표시 앱(port 3002)에 공개 API를 제공하며, 데이터 변경 시 메뉴 앱의 ISR 캐시를 자동 갱신한다.

## Commands

```bash
npm run dev          # 개발 서버 (port 3010)
npm run build        # 프로덕션 빌드
npm run lint         # ESLint 검사
npm run migrate      # 데이터 마이그레이션 (npx tsx scripts/migrate-data.ts)
npm run upload-images # 이미지 일괄 업로드 (npx tsx scripts/upload-images.ts)
```

테스트 러너는 설정되어 있지 않다.

## Architecture

### 기술 스택
- **Next.js 14 App Router** + TypeScript (경로 alias: `@/*` → `./src/*`)
- **Supabase** — PostgreSQL DB + Auth (이메일/비밀번호)
- **Cloudflare R2** — 이미지 저장소 (AWS S3 호환 SDK 사용)
- **Tailwind CSS** — 스타일링 (`clsx` + `tailwind-merge`)
- **@dnd-kit** — 드래그앤드롭 정렬

### 데이터 흐름
1. **Server Components**가 Supabase에서 데이터를 직접 조회
2. **Server Actions** (`src/actions/`)가 CRUD 수행 후 `revalidatePath()`로 대시보드 갱신
3. Server Action 완료 시 `revalidateMenuPage()`로 메뉴 앱 캐시도 갱신
4. **Public API** (`/api/public/wines`, `/api/public/tapas`)는 CORS 헤더 포함, 인증 불필요

### 인증 & 라우팅
- `src/middleware.ts`에서 Supabase 세션 확인 → 미인증 시 `/login`으로 리다이렉트
- `/api/public/*` 경로는 인증 없이 접근 가능
- 대시보드 layout에서 추가 서버사이드 세션 검증

### 주요 디렉토리
- `src/actions/` — Server Actions (wines.ts, tapas.ts, monthly-wines.ts): Supabase CRUD + 이미지 삭제 + 캐시 갱신 + 재고 관리
- `src/app/dashboard/inventory/` — 와인 재고 관리 페이지 (인라인 수량 편집, optimistic UI)
- `src/app/dashboard/monthly-wines/` — 이 달의 와인 관리 (할인율, 백원 절삭, 활성화 토글)
- `src/app/api/upload/` — Cloudflare R2 이미지 업로드 (5MB 제한, 이미지 타입만 허용)
- `src/lib/supabase/` — client.ts (브라우저용), server.ts (서버용) Supabase 클라이언트
- `src/lib/cloudflare/r2.ts` — R2 업로드/삭제 유틸리티
- `src/lib/revalidate-menu.ts` — 메뉴 앱 ISR 캐시 갱신 트리거
- `supabase/schema.sql` — DB 스키마 (테이블, enum, RLS, 트리거, 인덱스)

### DB 스키마 핵심
- **wines** — category(conventional/natural), type(Red/White/Orange/Sparkling/Champagne), is_active, display_order, stock(재고 수량, 0 이상)
- **wine_ratings** — wines와 1:N (rating_type: 바디/산미/당도, 0-5점), CASCADE 삭제
- **tapas** — category(main/side), is_active, display_order
- **monthly_wines** — wine_id(FK), discount_rate(0~100%), round_down_100(백원절삭), is_active, display_order
- RLS: 공개 READ, 인증된 사용자만 WRITE

### 환경변수
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — 클라이언트 노출
- `CLOUDFLARE_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `CDN_URL` — 이미지 저장소
- `MENU_APP_URL` — 메뉴 앱 주소 (기본: http://localhost:3002)
- `REVALIDATE_SECRET` — 캐시 갱신 보안 헤더 (선택)

## Patterns & Conventions

- Supabase 직접 쿼리 사용 (ORM 없음): `.from(table).select/insert/update/delete()`
- 폼은 Server Action에 바인딩, 클라이언트 컴포넌트는 `"use client"` 명시
- 이미지 업로드: 클라이언트에서 `/api/upload`로 FormData POST → R2 저장 → CDN URL 반환
- 와인/타파스 수정 시 기존 이미지가 있으면 R2에서 이전 이미지 삭제 후 새 이미지 업로드
- display_order 필드로 표시 순서 관리, @dnd-kit으로 드래그 정렬 UI 제공
