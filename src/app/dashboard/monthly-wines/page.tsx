import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui';
import MonthlyWineList from './MonthlyWineList';

export default async function MonthlyWinesPage() {
  const supabase = createClient();

  const { data: monthlyWines, error } = await supabase
    .from('monthly_wines')
    .select('*, wine:wines(*)')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching monthly wines:', error);
  }

  return (
    <div className='space-y-4 md:space-y-6'>
      <div className='flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center'>
        <div>
          <h1 className='text-xl font-bold text-gray-900 md:text-2xl'>이 달의 와인</h1>
          <p className='mt-1 text-sm text-gray-600'>총 {monthlyWines?.length || 0}개</p>
        </div>
        <Link href='/dashboard/monthly-wines/new' className='self-start sm:self-auto'>
          <Button>와인 추가</Button>
        </Link>
      </div>

      <MonthlyWineList monthlyWines={monthlyWines || []} />
    </div>
  );
}
