import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

function calcDiscountedPrice(price: number, discountRate: number, roundDown100: boolean): number {
  const discounted = Math.round(price * (1 - discountRate / 100));
  return roundDown100 ? Math.floor(discounted / 1000) * 1000 : discounted;
}

export async function GET() {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('monthly_wines')
    .select('*, wine:wines(*, ratings:wine_ratings(*))')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const transformedData = data
    .filter((item) => item.wine && item.wine.is_active)
    .map((item) => {
      const wine = item.wine;
      return {
        id: item.id,
        discountRate: item.discount_rate,
        discountedPrice: calcDiscountedPrice(wine.price, item.discount_rate, item.round_down_100),
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
