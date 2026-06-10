'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import { calcDiscountedPrice } from '@/types';
import { createMonthlyWine, updateMonthlyWine } from '@/actions/monthly-wines';
import type { Wine, MonthlyWine } from '@/types';

interface MonthlyWineFormProps {
  wines: Wine[];
  monthlyWine?: MonthlyWine;
  usedWineIds: string[];
}

export default function MonthlyWineForm({ wines, monthlyWine, usedWineIds }: MonthlyWineFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [wineId, setWineId] = useState(monthlyWine?.wine_id ?? '');
  const [discountRate, setDiscountRate] = useState(String(monthlyWine?.discount_rate ?? 0));
  const [roundDown100, setRoundDown100] = useState(monthlyWine?.round_down_100 ?? false);
  const [isActive, setIsActive] = useState(monthlyWine?.is_active ?? true);

  const availableWines = wines.filter(
    (w) => !usedWineIds.includes(w.id) || w.id === monthlyWine?.wine_id
  );

  const selectedWine = wines.find((w) => w.id === wineId);
  const discountRateNum = Math.min(100, Math.max(0, parseInt(discountRate) || 0));
  const discountedPrice = selectedWine
    ? calcDiscountedPrice(selectedWine.price, discountRateNum, roundDown100)
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!wineId) {
      setError('와인을 선택해주세요.');
      return;
    }

    startTransition(async () => {
      try {
        const formData = {
          wine_id: wineId,
          discount_rate: discountRateNum,
          round_down_100: roundDown100,
          is_active: isActive,
        };

        if (monthlyWine) {
          await updateMonthlyWine(monthlyWine.id, formData);
        } else {
          await createMonthlyWine(formData);
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
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          와인 선택 <span className='text-red-500'>*</span>
        </label>
        <select
          value={wineId}
          onChange={(e) => setWineId(e.target.value)}
          className='block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500'>
          <option value=''>-- 와인을 선택하세요 --</option>
          {availableWines.map((wine) => (
            <option key={wine.id} value={wine.id}>
              {wine.name} ({wine.eng_name}) — {wine.price.toLocaleString('ko-KR')}원
            </option>
          ))}
        </select>
      </div>

      {/* 할인율 */}
      <div>
        <Input
          id='discount_rate'
          label='할인율 (%)'
          type='number'
          min={0}
          max={100}
          value={discountRate}
          onChange={(e) => setDiscountRate(e.target.value)}
          placeholder='0'
        />
      </div>

      {/* 백원 단위 절삭 */}
      <div className='flex items-center gap-3'>
        <input
          id='round_down_100'
          type='checkbox'
          checked={roundDown100}
          onChange={(e) => setRoundDown100(e.target.checked)}
          className='h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500'
        />
        <label htmlFor='round_down_100' className='text-sm font-medium text-gray-700'>
          백원 단위 절삭
        </label>
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
          활성화
        </label>
      </div>

      {/* 미리보기 */}
      {selectedWine && (
        <div className='rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-2'>
          <p className='text-sm font-medium text-gray-700'>할인가 미리보기</p>
          <div className='flex items-center gap-3'>
            <span className='text-sm text-gray-400 line-through'>
              {selectedWine.price.toLocaleString('ko-KR')}원
            </span>
            <span className='text-lg font-bold text-rose-600'>
              {discountedPrice?.toLocaleString('ko-KR')}원
            </span>
            {discountRateNum > 0 && (
              <span className='inline-flex px-2 py-0.5 text-sm font-bold rounded bg-rose-100 text-rose-700'>
                {discountRateNum}% OFF
              </span>
            )}
          </div>
        </div>
      )}

      {/* 버튼 */}
      <div className='flex gap-3'>
        <Button type='submit' disabled={isPending}>
          {isPending ? '저장 중...' : '저장'}
        </Button>
        <Button
          type='button'
          variant='ghost'
          onClick={() => router.push('/dashboard/monthly-wines')}
          disabled={isPending}>
          취소
        </Button>
      </div>
    </form>
  );
}
