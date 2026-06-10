import type { Wine } from './wine';

export interface MonthlyWine {
  id: string;
  wine_id: string;
  discount_rate: number;
  round_down_100: boolean;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  wine?: Wine;
}

export interface MonthlyWineFormData {
  wine_id: string;
  discount_rate: number;
  round_down_100: boolean;
  is_active: boolean;
}

export function calcDiscountedPrice(originalPrice: number, discountRate: number, roundDown100: boolean): number {
  const discounted = Math.round(originalPrice * (1 - discountRate / 100));
  return roundDown100 ? Math.floor(discounted / 1000) * 1000 : discounted;
}
