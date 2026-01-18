export type TapasCategory = 'main' | 'side';

export interface Tapas {
  id: string;
  name: string;
  category: TapasCategory;
  price: number;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface TapasFormData {
  name: string;
  category: TapasCategory;
  price: number;
  description: string;
  image_url: string;
  is_active: boolean;
  display_order: number;
}

export const TAPAS_CATEGORIES: TapasCategory[] = ['main', 'side'];
