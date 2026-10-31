'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import { createGlassWine, updateGlassWine } from '@/actions/glass-wines';
import type { Wine, GlassWine } from '@/types';
import WinePicker from './WinePicker';

interface GlassWineFormProps {
  wines: Wine[];
  glassWine?: GlassWine;
  usedWineIds: string[];
}

export default function GlassWineForm({ wines, glassWine, usedWineIds }: GlassWineFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [wineId, setWineId] = useState(glassWine?.wine_id ?? '');
  const [glassPrice, setGlassPrice] = useState(glassWine ? String(glassWine.glass_price) : '');
  const [isActive, setIsActive] = useState(glassWine?.is_active ?? true);

  // 이미 글라스로 등록된 와인은 목록에 보이되 선택 불가 (수정 중인 자기 자신은 선택 가능)
  const disabledIds = usedWineIds.filter((id) => id !== glassWine?.wine_id);

  const glassPriceNum = parseInt(glassPrice) || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!wineId) {
      setError('와인을 선택해주세요.');
      return;
    }

    if (glassPriceNum <= 0) {
      setError('잔 가격을 입력해주세요.');
      return;
    }

    startTransition(async () => {
      try {
        const formData = {
          wine_id: wineId,
          glass_price: glassPriceNum,
          is_active: isActive,
        };

        if (glassWine) {
          await updateGlassWine(glassWine.id, formData);
        } else {
          await createGlassWine(formData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '저장 중 오류가 발생했습니다.');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {error && (
        <div className='rounded-md bg-red-50 p-4 text-sm text-red-700'>{error}</div>
      )}

      {/* 와인 선택 */}
      <div className='space-y-3'>
        <label className='block text-sm font-medium text-gray-700'>
          와인 선택 <span className='text-red-500'>*</span>
        </label>
        <WinePicker wines={wines} disabledIds={disabledIds} value={wineId} onChange={setWineId} />
      </div>

      {/* 잔 가격 */}
      <div>
        <Input
          id='glass_price'
          label='잔 가격 (원)'
          type='number'
          min={0}
          step={100}
          inputMode='numeric'
          value={glassPrice}
          onChange={(e) => setGlassPrice(e.target.value)}
          placeholder='예: 15000'
        />
      </div>

      {/* 활성화 여부 */}
      <div className='flex items-center gap-3'>
        <input
          id='is_active'
          type='checkbox'
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className='h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500'
        />
        <label htmlFor='is_active' className='text-sm font-medium text-gray-700'>
          활성화 (메뉴에 표시)
        </label>
      </div>

      {/* 버튼 */}
      <div className='flex gap-3'>
        <Button type='submit' disabled={isPending}>
          {isPending ? '저장 중...' : '저장'}
        </Button>
        <Button
          type='button'
          variant='ghost'
          onClick={() => router.push('/dashboard/glass-wines')}
          disabled={isPending}>
          취소
        </Button>
      </div>
    </form>
  );
}
