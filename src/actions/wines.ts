'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { deleteFromR2 } from '@/lib/cloudflare/r2';
import { revalidateMenuPages } from '@/lib/revalidate-menu';
import type { WineFormData, WineRatingInput } from '@/types';

export async function createWine(
  formData: WineFormData,
  ratings: WineRatingInput[],
  redirectUrl?: string
) {
  const supabase = createClient();

  const { data: wine, error: wineError } = await supabase
    .from('wines')
    .insert({
      name: formData.name,
      eng_name: formData.eng_name,
      category: formData.category,
      type: formData.type,
      year: formData.year || null,
      alcohol: formData.alcohol || null,
      origin: formData.origin || null,
      grape: formData.grape || null,
      price: formData.price,
      description: formData.description || null,
      opinion: formData.opinion || null,
      image_url: formData.image_url || null,
      vivino: formData.vivino || null,
      is_active: formData.is_active,
      display_order: formData.display_order,
    })
    .select()
    .single();

  if (wineError) {
    throw new Error(wineError.message);
  }

  if (ratings.length > 0) {
    const ratingData = ratings
      .filter(r => r.rating > 0)
      .map(r => ({
        wine_id: wine.id,
        rating_type: r.rating_type,
        rating: r.rating,
        max_rating: r.max_rating,
      }));

    if (ratingData.length > 0) {
      const { error: ratingError } = await supabase
        .from('wine_ratings')
        .insert(ratingData);

      if (ratingError) {
        throw new Error(ratingError.message);
      }
    }
  }

  revalidatePath('/dashboard/wines');
  revalidateMenuPages(); // menu 앱 캐시 갱신
  redirect(redirectUrl || '/dashboard/wines');
}

export async function updateWine(
  id: string,
  formData: WineFormData,
  ratings: WineRatingInput[],
  redirectUrl?: string
) {
  const supabase = createClient();

  // 기존 이미지 URL 조회
  const { data: existingWine } = await supabase
    .from('wines')
    .select('image_url')
    .eq('id', id)
    .single();

  const oldImageUrl = existingWine?.image_url;
  const newImageUrl = formData.image_url || null;

  // 이미지가 변경되었고 기존 이미지가 있으면 R2에서 삭제
  if (oldImageUrl && oldImageUrl !== newImageUrl) {
    try {
      await deleteFromR2(oldImageUrl);
    } catch (error) {
      console.error('Failed to delete old image from R2:', error);
    }
  }

  const { error: wineError } = await supabase
    .from('wines')
    .update({
      name: formData.name,
      eng_name: formData.eng_name,
      category: formData.category,
      type: formData.type,
      year: formData.year || null,
      alcohol: formData.alcohol || null,
      origin: formData.origin || null,
      grape: formData.grape || null,
      price: formData.price,
      description: formData.description || null,
      opinion: formData.opinion || null,
      image_url: formData.image_url || null,
      vivino: formData.vivino || null,
      is_active: formData.is_active,
      display_order: formData.display_order,
    })
    .eq('id', id);

  if (wineError) {
    throw new Error(wineError.message);
  }

  // 기존 평점 삭제
  await supabase.from('wine_ratings').delete().eq('wine_id', id);

  // 새 평점 추가
  if (ratings.length > 0) {
    const ratingData = ratings
      .filter(r => r.rating > 0)
      .map(r => ({
        wine_id: id,
        rating_type: r.rating_type,
        rating: r.rating,
        max_rating: r.max_rating,
      }));

    if (ratingData.length > 0) {
      const { error: ratingError } = await supabase
        .from('wine_ratings')
        .insert(ratingData);

      if (ratingError) {
        throw new Error(ratingError.message);
      }
    }
  }

  revalidatePath('/dashboard/wines');
  revalidatePath(`/dashboard/wines/${id}`);
  revalidateMenuPages(); // menu 앱 캐시 갱신
  redirect(redirectUrl || '/dashboard/wines');
}

export async function deleteWine(id: string) {
  const supabase = createClient();

  // 삭제 전 이미지 URL 조회
  const { data: wine } = await supabase
    .from('wines')
    .select('image_url')
    .eq('id', id)
    .single();

  const { error } = await supabase
    .from('wines')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  // 이미지가 있으면 R2에서 삭제
  if (wine?.image_url) {
    try {
      await deleteFromR2(wine.image_url);
    } catch (error) {
      console.error('Failed to delete image from R2:', error);
    }
  }

  revalidatePath('/dashboard/wines');
  revalidateMenuPages(); // menu 앱 캐시 갱신
}

export async function toggleWineActive(id: string, isActive: boolean) {
  const supabase = createClient();

  const { error } = await supabase
    .from('wines')
    .update({ is_active: isActive })
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/dashboard/wines');
  revalidateMenuPages(); // menu 앱 캐시 갱신
}

export async function updateWineOrder(items: { id: string; display_order: number }[]) {
  const supabase = createClient();

  for (const item of items) {
    const { error } = await supabase
      .from('wines')
      .update({ display_order: item.display_order })
      .eq('id', item.id);

    if (error) {
      throw new Error(error.message);
    }
  }

  revalidatePath('/dashboard/wines');
  revalidateMenuPages(); // menu 앱 캐시 갱신
}
