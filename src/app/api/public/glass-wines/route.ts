import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function GET() {
  const supabase = getSupabaseClient();

  // 글라스 노출은 glass_wines.is_active 로 판단한다 (바틀 리스트에서 숨긴 와인도 글라스로 판매 가능)
  // 단, 미활용 와인은 메뉴 어디에도 노출하지 않는다
  const { data, error } = await supabase
    .from('glass_wines')
    .select('*, wine:wines(*, ratings:wine_ratings(*))')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: CORS_HEADERS });
  }

  const transformedData = data
    .filter((item) => item.wine && !item.wine.is_unused)
    .map((item) => {
      const wine = item.wine;
      return {
        id: item.id,
        glassPrice: item.glass_price,
        wine: {
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
        },
      };
    });

  return NextResponse.json(transformedData, { headers: CORS_HEADERS });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}
