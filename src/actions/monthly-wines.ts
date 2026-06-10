'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { revalidateMenuPages } from '@/lib/revalidate-menu';
import type { MonthlyWineFormData } from '@/types';

export async function createMonthlyWine(formData: MonthlyWineFormData) {
  const supabase = createClient();

  const { data: existing } = await supabase
    .from('monthly_wines')
    .select('id')
    .eq('wine_id', formData.wine_id)
    .single();

  if (existing) {
    throw new Error('이미 이 달의 와인으로 등록된 와인입니다.');
  }

  const { data: maxOrder } = await supabase
    .from('monthly_wines')
    .select('display_order')
    .order('display_order', { ascending: false })
    .limit(1)
    .single();

  const { error } = await supabase.from('monthly_wines').insert({
    wine_id: formData.wine_id,
    discount_rate: formData.discount_rate,
    round_down_100: formData.round_down_100,
    is_active: formData.is_active,
    display_order: (maxOrder?.display_order ?? -1) + 1,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/dashboard/monthly-wines');
  revalidateMenuPages();
  redirect('/dashboard/monthly-wines');
}

export async function updateMonthlyWine(id: string, formData: MonthlyWineFormData) {
  const supabase = createClient();

  const { data: existing } = await supabase
    .from('monthly_wines')
    .select('id')
    .eq('wine_id', formData.wine_id)
    .neq('id', id)
    .single();

  if (existing) {
    throw new Error('이미 이 달의 와인으로 등록된 와인입니다.');
  }

  const { error } = await supabase
    .from('monthly_wines')
    .update({
      wine_id: formData.wine_id,
      discount_rate: formData.discount_rate,
      round_down_100: formData.round_down_100,
      is_active: formData.is_active,
    })
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/dashboard/monthly-wines');
  revalidateMenuPages();
  redirect('/dashboard/monthly-wines');
}

export async function deleteMonthlyWine(id: string) {
  const supabase = createClient();

  const { error } = await supabase.from('monthly_wines').delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/dashboard/monthly-wines');
  revalidateMenuPages();
}

export async function toggleMonthlyWineActive(id: string, isActive: boolean) {
  const supabase = createClient();

  const { error } = await supabase
    .from('monthly_wines')
    .update({ is_active: isActive })
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/dashboard/monthly-wines');
  revalidateMenuPages();
}
