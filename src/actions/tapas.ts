'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { deleteFromR2 } from '@/lib/cloudflare/r2';
import type { TapasFormData } from '@/types';

export async function createTapas(formData: TapasFormData, redirectUrl?: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from('tapas')
    .insert({
      name: formData.name,
      category: formData.category,
      price: formData.price,
      description: formData.description || null,
      image_url: formData.image_url || null,
      is_active: formData.is_active,
      display_order: formData.display_order,
    });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/dashboard/tapas');
  redirect(redirectUrl || '/dashboard/tapas');
}

export async function updateTapas(id: string, formData: TapasFormData, redirectUrl?: string) {
  const supabase = createClient();

  // 기존 이미지 URL 조회
  const { data: existingTapas } = await supabase
    .from('tapas')
    .select('image_url')
    .eq('id', id)
    .single();

  const oldImageUrl = existingTapas?.image_url;
  const newImageUrl = formData.image_url || null;

  // 이미지가 변경되었고 기존 이미지가 있으면 R2에서 삭제
  if (oldImageUrl && oldImageUrl !== newImageUrl) {
    try {
      await deleteFromR2(oldImageUrl);
    } catch (error) {
      console.error('Failed to delete old image from R2:', error);
    }
  }

  const { error } = await supabase
    .from('tapas')
    .update({
      name: formData.name,
      category: formData.category,
      price: formData.price,
      description: formData.description || null,
      image_url: formData.image_url || null,
      is_active: formData.is_active,
      display_order: formData.display_order,
    })
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/dashboard/tapas');
  revalidatePath(`/dashboard/tapas/${id}`);
  redirect(redirectUrl || '/dashboard/tapas');
}

export async function deleteTapas(id: string) {
  const supabase = createClient();

  // 삭제 전 이미지 URL 조회
  const { data: tapas } = await supabase
    .from('tapas')
    .select('image_url')
    .eq('id', id)
    .single();

  const { error } = await supabase
    .from('tapas')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  // 이미지가 있으면 R2에서 삭제
  if (tapas?.image_url) {
    try {
      await deleteFromR2(tapas.image_url);
    } catch (error) {
      console.error('Failed to delete image from R2:', error);
    }
  }

  revalidatePath('/dashboard/tapas');
}

export async function toggleTapasActive(id: string, isActive: boolean) {
  const supabase = createClient();

  const { error } = await supabase
    .from('tapas')
    .update({ is_active: isActive })
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/dashboard/tapas');
}

export async function updateTapasOrder(items: { id: string; display_order: number }[]) {
  const supabase = createClient();

  for (const item of items) {
    const { error } = await supabase
      .from('tapas')
      .update({ display_order: item.display_order })
      .eq('id', item.id);

    if (error) {
      throw new Error(error.message);
    }
  }

  revalidatePath('/dashboard/tapas');
}
