import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import GlassWineForm from '../../GlassWineForm';

export default async function EditGlassWinePage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const [{ data: glassWine }, { data: wines }, { data: glassWines }] = await Promise.all([
    supabase.from('glass_wines').select('*').eq('id', params.id).single(),
    supabase.from('wines').select('*').order('name', { ascending: true }),
    supabase.from('glass_wines').select('wine_id'),
  ]);

  if (!glassWine) {
    notFound();
  }

  const usedWineIds = (glassWines ?? []).map((gw) => gw.wine_id);

  return (
    <div className='space-y-4 md:space-y-6'>
      <div className='flex items-center gap-2'>
        <Link href='/dashboard/glass-wines' className='text-sm text-gray-500 hover:text-gray-700'>
          글라스 와인
        </Link>
        <span className='text-gray-400'>/</span>
        <span className='text-sm font-medium text-gray-900'>수정</span>
      </div>

      <h1 className='text-xl font-bold text-gray-900 md:text-2xl'>글라스 와인 수정</h1>

      <div className='bg-white rounded-lg shadow p-6'>
        <GlassWineForm wines={wines ?? []} glassWine={glassWine} usedWineIds={usedWineIds} />
      </div>
    </div>
  );
}
