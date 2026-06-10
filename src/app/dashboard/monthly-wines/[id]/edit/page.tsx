import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import MonthlyWineForm from '../../MonthlyWineForm';

export default async function EditMonthlyWinePage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const [{ data: monthlyWine }, { data: wines }, { data: monthlyWines }] = await Promise.all([
    supabase.from('monthly_wines').select('*, wine:wines(*)').eq('id', params.id).single(),
    supabase.from('wines').select('*').order('name', { ascending: true }),
    supabase.from('monthly_wines').select('wine_id'),
  ]);

  if (!monthlyWine) {
    notFound();
  }

  const usedWineIds = (monthlyWines ?? []).map((mw) => mw.wine_id);

  return (
    <div className='space-y-4 md:space-y-6'>
      <div className='flex items-center gap-2'>
        <Link href='/dashboard/monthly-wines' className='text-sm text-gray-500 hover:text-gray-700'>
          이 달의 와인
        </Link>
        <span className='text-gray-400'>/</span>
        <span className='text-sm font-medium text-gray-900'>수정</span>
      </div>

      <h1 className='text-xl font-bold text-gray-900 md:text-2xl'>이 달의 와인 수정</h1>

      <div className='bg-white rounded-lg shadow p-6'>
        <MonthlyWineForm wines={wines ?? []} monthlyWine={monthlyWine} usedWineIds={usedWineIds} />
      </div>
    </div>
  );
}
