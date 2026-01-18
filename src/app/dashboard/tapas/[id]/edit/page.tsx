import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { TapasForm } from '@/components/tapas';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function EditTapasPage({ params }: PageProps) {
  const supabase = createClient();

  const { data: tapas, error } = await supabase
    .from('tapas')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !tapas) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">타파스 수정</h1>
        <p className="mt-1 text-sm text-gray-600">
          {tapas.name}
        </p>
      </div>

      <TapasForm tapas={tapas} mode="edit" />
    </div>
  );
}
