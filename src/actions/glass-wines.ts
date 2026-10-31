'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { revalidateMenuPages } from '@/lib/revalidate-menu';
import type { GlassWineFormData } from '@/types';

function validate(formData: GlassWineFormData) {
  if (!formData.wine_id) {
    throw new Error('와인을 선택해주세요.');
  }
  if (!Number.isInteger(formData.glass_price) || formData.glass_price <= 0) {
    throw new Error('잔 가격을 입력해주세요.');
  }
}

export async function createGlassWine(formData: GlassWineFormData) {
  validate(formData);
  const supabase = createClient();

  const { data: existing } = await supabase
    .from('glass_wines')
    .select('id')
    .eq('wine_id', formData.wine_id)
    .maybeSingle();

  if (existing) {
    throw new Error('이미 글라스 와인으로 등록된 와인입니다.');
  }

  const { data: maxOrder } = await supabase
    .from('glass_wines')
    .select('display_order')
    .order('display_order', { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from('glass_wines').insert({
    wine_id: formData.wine_id,
    glass_price: formData.glass_price,
    is_active: formData.is_active,
    display_order: (maxOrder?.display_order ?? -1) + 1,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/dashboard/glass-wines');
  revalidateMenuPages();
  redirect('/dashboard/glass-wines');
}

export async function updateGlassWine(id: string, formData: GlassWineFormData) {
  validate(formData);
  const supabase = createClient();

  const { data: existing } = await supabase
    .from('glass_wines')
    .select('id')
    .eq('wine_id', formData.wine_id)
    .neq('id', id)
    .maybeSingle();

  if (existing) {
    throw new Error('이미 글라스 와인으로 등록된 와인입니다.');
  }

  const { error } = await supabase
    .from('glass_wines')
    .update({
      wine_id: formData.wine_id,
      glass_price: formData.glass_price,
      is_active: formData.is_active,
    })
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/dashboard/glass-wines');
  revalidateMenuPages();
  redirect('/dashboard/glass-wines');
}

export async function deleteGlassWine(id: string) {
  const supabase = createClient();

  const { error } = await supabase.from('glass_wines').delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/dashboard/glass-wines');
  revalidateMenuPages();
}

export async function toggleGlassWineActive(id: string, isActive: boolean) {
  const supabase = createClient();

  const { error } = await supabase
    .from('glass_wines')
    .update({ is_active: isActive })
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/dashboard/glass-wines');
  revalidateMenuPages();
}
