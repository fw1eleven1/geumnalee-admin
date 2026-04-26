export type WineCategory = 'conventional' | 'natural';
export type WineType = 'Red' | 'White' | 'Orange' | 'Sparkling' | 'Champagne';

export interface WineRating {
  id: string;
  wine_id: string;
  rating_type: string;
  rating: number;
  max_rating: number;
}

export interface Wine {
  id: string;
  name: string;
  eng_name: string;
  category: WineCategory;
  type: WineType;
  year: string | null;
  alcohol: string | null;
  origin: string | null;
  grape: string | null;
  price: number;
  description: string | null;
  opinion: string | null;
  image_url: string | null;
  vivino: string | null;
  is_active: boolean;
  display_order: number;
  stock: number;
  created_at: string;
  updated_at: string;
  ratings?: WineRating[];
}

export interface WineFormData {
  name: string;
  eng_name: string;
  category: WineCategory;
  type: WineType;
  year: string;
  alcohol: string;
  origin: string;
  grape: string;
  price: number;
  description: string;
  opinion: string;
  image_url: string;
  vivino: string;
  is_active: boolean;
  display_order: number;
}

export interface WineRatingInput {
  rating_type: string;
  rating: number;
  max_rating: number;
}

export const WINE_TYPES: WineType[] = ['Red', 'White', 'Orange', 'Sparkling', 'Champagne'];
export const WINE_CATEGORIES: WineCategory[] = ['conventional', 'natural'];
export const RATING_TYPES = ['바디', '산미', '당도'];
