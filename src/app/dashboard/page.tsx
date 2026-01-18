import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = createClient();

  // 통계 데이터 조회
  const [winesResult, tapasResult] = await Promise.all([
    supabase.from('wines').select('id, is_active', { count: 'exact' }),
    supabase.from('tapas').select('id, is_active', { count: 'exact' }),
  ]);

  const totalWines = winesResult.count || 0;
  const activeWines = winesResult.data?.filter(w => w.is_active).length || 0;
  const totalTapas = tapasResult.count || 0;
  const activeTapas = tapasResult.data?.filter(t => t.is_active).length || 0;

  const stats = [
    {
      name: '전체 와인',
      value: totalWines,
      subtext: `${activeWines}개 활성화`,
      href: '/dashboard/wines',
    },
    {
      name: '전체 타파스',
      value: totalTapas,
      subtext: `${activeTapas}개 활성화`,
      href: '/dashboard/tapas',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
        <p className="mt-1 text-sm text-gray-600">
          금나리 메뉴 관리 시스템에 오신 것을 환영합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="relative overflow-hidden rounded-lg bg-white p-6 shadow hover:shadow-md transition-shadow"
          >
            <dt className="truncate text-sm font-medium text-gray-500">
              {stat.name}
            </dt>
            <dd className="mt-2">
              <span className="text-3xl font-bold text-gray-900">
                {stat.value}
              </span>
              <span className="ml-2 text-sm text-gray-500">
                {stat.subtext}
              </span>
            </dd>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-gray-900">빠른 작업</h2>
          <div className="mt-4 space-y-3">
            <Link
              href="/dashboard/wines/new"
              className="block rounded-md bg-gray-900 px-4 py-2 text-center text-sm font-medium text-white hover:bg-gray-800"
            >
              새 와인 추가
            </Link>
            <Link
              href="/dashboard/tapas/new"
              className="block rounded-md bg-gray-100 px-4 py-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-200"
            >
              새 타파스 추가
            </Link>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-gray-900">안내</h2>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            <li>- 와인/타파스를 추가하거나 수정할 수 있습니다.</li>
            <li>- 이미지는 Cloudflare R2에 업로드됩니다.</li>
            <li>- 변경사항은 메뉴 페이지에 즉시 반영됩니다.</li>
            <li>- 활성화 여부로 메뉴 표시를 제어할 수 있습니다.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
