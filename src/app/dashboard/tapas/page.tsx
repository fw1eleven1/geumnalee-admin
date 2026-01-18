import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui';
import TapasList from './TapasList';

interface SearchParams {
  category?: 'main' | 'side';
  search?: string;
}

export default async function TapasPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const supabase = createClient();

  let query = supabase
    .from('tapas')
    .select('*')
    .order('category', { ascending: true })
    .order('display_order', { ascending: true });

  if (searchParams.category) {
    query = query.eq('category', searchParams.category);
  }
  if (searchParams.search) {
    query = query.ilike('name', `%${searchParams.search}%`);
  }

  const { data: tapas, error } = await query;

  if (error) {
    console.error('Error fetching tapas:', error);
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900 md:text-2xl">타파스 관리</h1>
          <p className="mt-1 text-sm text-gray-600">
            총 {tapas?.length || 0}개의 타파스
          </p>
        </div>
        <Link href="/dashboard/tapas/new" className="self-start sm:self-auto">
          <Button>새 타파스 추가</Button>
        </Link>
      </div>

      {/* 카테고리 탭 */}
      <div className="flex gap-2">
        <Link href="/dashboard/tapas?category=main">
          <Button
            variant={searchParams.category === 'main' ? 'primary' : 'ghost'}
            size="sm"
          >
            메인
          </Button>
        </Link>
        <Link href="/dashboard/tapas?category=side">
          <Button
            variant={searchParams.category === 'side' ? 'primary' : 'ghost'}
            size="sm"
          >
            사이드
          </Button>
        </Link>
      </div>

      {/* 필터 */}
      <div className="bg-white p-3 md:p-4 rounded-lg shadow">
        <form className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
          <input
            type="text"
            name="search"
            defaultValue={searchParams.search || ''}
            placeholder="이름으로 검색..."
            className="w-full sm:w-auto sm:flex-1 sm:max-w-xs px-3 py-2 border border-gray-300 rounded-md text-sm"
          />

          <div className="flex gap-2">
            <Button type="submit" variant="secondary" size="sm" className="flex-1 sm:flex-none">
              검색
            </Button>

            {(searchParams.category || searchParams.search) && (
              <Link href="/dashboard/tapas" className="flex-1 sm:flex-none">
                <Button type="button" variant="ghost" size="sm" className="w-full">
                  필터 초기화
                </Button>
              </Link>
            )}
          </div>
        </form>
      </div>

      <TapasList tapas={tapas || []} />
    </div>
  );
}
