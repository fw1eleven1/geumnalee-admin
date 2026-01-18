import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function GET(request: NextRequest) {
  const supabase = getSupabaseClient();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const type = searchParams.get('type');
  const activeOnly = searchParams.get('active') !== 'false';

  let query = supabase
    .from('wines')
    .select('*, ratings:wine_ratings(*)')
    .order('display_order', { ascending: true });

  if (activeOnly) {
    query = query.eq('is_active', true);
  }

  if (category) {
    query = query.eq('category', category);
  }

  if (type) {
    query = query.eq('type', type);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // geumnalee-menu 형식으로 변환
  const transformedData = data.map(wine => ({
    id: wine.id,
    name: wine.name,
    engName: wine.eng_name,
    type: wine.type,
    year: wine.year || '',
    alc: wine.alcohol || '',
    made: wine.origin || '',
    grape: wine.grape || '',
    price: wine.price,
    desc: wine.description || '',
    opinion: wine.opinion || '',
    img: wine.image_url || '',
    rating: wine.ratings?.map((r: { rating_type: string; rating: number }) => ({
      type: r.rating_type,
      rating: r.rating,
    })) || [],
    maxRating: 5,
    vivino: wine.vivino || '',
  }));

  return NextResponse.json(transformedData, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
