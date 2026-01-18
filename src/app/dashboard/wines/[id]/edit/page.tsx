import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { WineForm } from '@/components/wines';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function EditWinePage({ params }: PageProps) {
  const supabase = createClient();

  const { data: wine, error } = await supabase
    .from('wines')
    .select('*, ratings:wine_ratings(*)')
    .eq('id', params.id)
    .single();

  if (error || !wine) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">와인 수정</h1>
        <p className="mt-1 text-sm text-gray-600">
          {wine.name} ({wine.eng_name})
        </p>
      </div>

      <WineForm wine={wine} mode="edit" />
    </div>
  );
}
