import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui';
import GlassWineList from './GlassWineList';

export default async function GlassWinesPage() {
  const supabase = createClient();

  const { data: glassWines, error } = await supabase
    .from('glass_wines')
    .select('*, wine:wines(*)')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching glass wines:', error);
  }

  return (
    <div className='space-y-4 md:space-y-6'>
      <div className='flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center'>
        <div>
          <h1 className='text-xl font-bold text-gray-900 md:text-2xl'>글라스 와인</h1>
          <p className='mt-1 text-sm text-gray-600'>총 {glassWines?.length || 0}개 · 메뉴의 WINE BY THE GLASS 페이지에 표시됩니다</p>
        </div>
        <Link href='/dashboard/glass-wines/new' className='self-start sm:self-auto'>
          <Button>와인 추가</Button>
        </Link>
      </div>

      <GlassWineList glassWines={glassWines || []} />
    </div>
  );
}
