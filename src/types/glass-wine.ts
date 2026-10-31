import type { Wine } from './wine';

export interface GlassWine {
  id: string;
  wine_id: string;
  glass_price: number;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  wine?: Wine;
}

export interface GlassWineFormData {
  wine_id: string;
  glass_price: number;
  is_active: boolean;
}
