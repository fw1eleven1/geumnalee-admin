'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Select, Textarea } from '@/components/ui';
import ImageUpload from '@/components/ui/ImageUpload';
import { createTapas, updateTapas } from '@/actions/tapas';
import { Tapas, TapasFormData, TAPAS_CATEGORIES } from '@/types';

interface TapasFormProps {
  tapas?: Tapas;
  mode: 'create' | 'edit';
}

export default function TapasForm({ tapas, mode }: TapasFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<TapasFormData>({
    name: tapas?.name || '',
    category: tapas?.category || 'main',
    price: tapas?.price || 0,
    description: tapas?.description || '',
    image_url: tapas?.image_url || '',
    is_active: tapas?.is_active ?? true,
    display_order: tapas?.display_order || 0,
  });

  const getRedirectUrl = () => {
    return `/dashboard/tapas?category=${formData.category}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const redirectUrl = getRedirectUrl();

    try {
      if (mode === 'create') {
        await createTapas(formData, redirectUrl);
      } else if (tapas) {
        await updateTapas(tapas.id, formData, redirectUrl);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  const updateField = <K extends keyof TapasFormData>(
    field: K,
    value: TapasFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

        <Input
          label="타파스 이름 *"
          value={formData.name}
          onChange={(e) => updateField('name', e.target.value)}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="카테고리 *"
            value={formData.category}
            onChange={(e) => updateField('category', e.target.value as 'main' | 'side')}
            options={TAPAS_CATEGORIES.map(cat => ({
              value: cat,
              label: cat === 'main' ? '메인 타파스' : '사이드 타파스',
            }))}
          />
          <Input
            label="가격 *"
            type="number"
            value={formData.price}
            onChange={(e) => updateField('price', parseInt(e.target.value) || 0)}
            required
          />
        </div>
      </div>

      {/* 설명 */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow space-y-4">
        <h2 className="text-base md:text-lg font-semibold text-gray-900">설명</h2>

        <Textarea
          label="타파스 설명"
          value={formData.description}
          onChange={(e) => updateField('description', e.target.value)}
          rows={4}
        />
      </div>

      {/* 이미지 */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow space-y-4">
        <h2 className="text-base md:text-lg font-semibold text-gray-900">이미지</h2>
        <ImageUpload
          currentImage={formData.image_url}
          onUpload={(url) => updateField('image_url', url)}
          folder="tapas"
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
