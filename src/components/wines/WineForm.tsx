'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Select, Textarea } from '@/components/ui';
import RatingInput from './RatingInput';
import ImageUpload from '@/components/ui/ImageUpload';
import { createWine, updateWine } from '@/actions/wines';
import {
  Wine,
  WineFormData,
  WineRatingInput,
  WINE_TYPES,
  WINE_CATEGORIES,
  RATING_TYPES,
} from '@/types';

interface WineFormProps {
  wine?: Wine;
  mode: 'create' | 'edit';
}

export default function WineForm({ wine, mode }: WineFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<WineFormData>({
    name: wine?.name || '',
    eng_name: wine?.eng_name || '',
    category: wine?.category || 'conventional',
    type: wine?.type || 'Red',
    year: wine?.year || '',
    alcohol: wine?.alcohol || '',
    origin: wine?.origin || '',
    grape: wine?.grape || '',
    price: wine?.price || 0,
    description: wine?.description || '',
    opinion: wine?.opinion || '',
    image_url: wine?.image_url || '',
    vivino: wine?.vivino || '',
    is_active: wine?.is_active ?? true,
    display_order: wine?.display_order || 0,
  });

  const [ratings, setRatings] = useState<WineRatingInput[]>(
    wine?.ratings?.length
      ? wine.ratings.map(r => ({
          rating_type: r.rating_type,
          rating: r.rating,
          max_rating: r.max_rating,
        }))
      : RATING_TYPES.map(type => ({
          rating_type: type,
          rating: 0,
          max_rating: 5,
        }))
  );

  const getRedirectUrl = () => {
    if (formData.category === 'conventional') {
      return `/dashboard/wines?category=conventional&type=${formData.type}`;
    }
    return `/dashboard/wines?category=natural`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const redirectUrl = getRedirectUrl();

    try {
      if (mode === 'create') {
        await createWine(formData, ratings, redirectUrl);
      } else if (wine) {
        await updateWine(wine.id, formData, ratings, redirectUrl);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  const updateField = <K extends keyof WineFormData>(
    field: K,
    value: WineFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateRating = (index: number, value: number) => {
    setRatings(prev => {
      const newRatings = [...prev];
      newRatings[index].rating = value;
      return newRatings;
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 max-w-2xl">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 md:p-4 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* 기본 정보 */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow space-y-4">
        <h2 className="text-base md:text-lg font-semibold text-gray-900">기본 정보</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="한글 이름 *"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            required
          />
          <Input
            label="영문 이름 *"
            value={formData.eng_name}
            onChange={(e) => updateField('eng_name', e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="카테고리 *"
            value={formData.category}
            onChange={(e) => updateField('category', e.target.value as 'conventional' | 'natural')}
            options={WINE_CATEGORIES.map(cat => ({
              value: cat,
              label: cat === 'conventional' ? 'Conventional' : 'Natural',
            }))}
          />
          <Select
            label="타입 *"
            value={formData.type}
            onChange={(e) => updateField('type', e.target.value as typeof WINE_TYPES[number])}
            options={WINE_TYPES.map(type => ({
              value: type,
              label: type,
            }))}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input
            label="빈티지"
            value={formData.year}
            onChange={(e) => updateField('year', e.target.value)}
            placeholder="2021"
          />
          <Input
            label="알코올 도수"
            value={formData.alcohol}
            onChange={(e) => updateField('alcohol', e.target.value)}
            placeholder="14%"
          />
          <Input
            label="가격 *"
            type="number"
            value={formData.price}
            onChange={(e) => updateField('price', parseInt(e.target.value) || 0)}
            required
          />
        </div>

        <Input
          label="생산지"
          value={formData.origin}
          onChange={(e) => updateField('origin', e.target.value)}
          placeholder="France > Bordeaux"
        />

        <Input
          label="포도 품종"
          value={formData.grape}
          onChange={(e) => updateField('grape', e.target.value)}
          placeholder="Cabernet Sauvignon 100%"
        />
      </div>

      {/* 설명 */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow space-y-4">
        <h2 className="text-base md:text-lg font-semibold text-gray-900">설명</h2>

        <Textarea
          label="와인 설명"
          value={formData.description}
          onChange={(e) => updateField('description', e.target.value)}
          rows={4}
        />

        <Textarea
          label="추가 의견"
          value={formData.opinion}
          onChange={(e) => updateField('opinion', e.target.value)}
          rows={2}
        />

        <Textarea
          label="Vivino 평점"
          value={formData.vivino}
          onChange={(e) => updateField('vivino', e.target.value)}
          rows={2}
          placeholder="Vivino 4.3&#10;Wine Spectator 92"
        />
      </div>

      {/* 평점 */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow space-y-4">
        <h2 className="text-base md:text-lg font-semibold text-gray-900">평점</h2>
        {ratings.map((rating, index) => (
          <RatingInput
            key={rating.rating_type}
            label={rating.rating_type}
            value={rating.rating}
            maxValue={rating.max_rating}
            onChange={(value) => updateRating(index, value)}
          />
        ))}
      </div>

      {/* 이미지 */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow space-y-4">
        <h2 className="text-base md:text-lg font-semibold text-gray-900">이미지</h2>
        <ImageUpload
          currentImage={formData.image_url}
          onUpload={(url) => updateField('image_url', url)}
          folder="wines"
        />
      </div>

      {/* 설정 */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow space-y-4">
        <h2 className="text-base md:text-lg font-semibold text-gray-900">설정</h2>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="is_active"
            checked={formData.is_active}
            onChange={(e) => updateField('is_active', e.target.checked)}
            className="h-5 w-5 rounded border-gray-300"
          />
          <label htmlFor="is_active" className="text-sm text-gray-700">
            메뉴에 표시
          </label>
        </div>

        <Input
          label="표시 순서"
          type="number"
          value={formData.display_order}
          onChange={(e) => updateField('display_order', parseInt(e.target.value) || 0)}
        />
      </div>

      <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
          className="w-full sm:w-auto"
        >
          취소
        </Button>
        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
          {loading ? '저장 중...' : mode === 'create' ? '추가' : '저장'}
        </Button>
      </div>
    </form>
  );
}
