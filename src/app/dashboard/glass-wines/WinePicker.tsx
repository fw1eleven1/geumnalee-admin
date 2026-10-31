'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { clsx } from 'clsx';
import type { Wine, WineCategory, WineType } from '@/types';

const TYPES_BY_CATEGORY: Record<WineCategory, WineType[]> = {
  conventional: ['Red', 'White', 'Sparkling', 'Champagne'],
  natural: ['Red', 'White', 'Orange'],
};

interface WinePickerProps {
  wines: Wine[];
  /** 목록에는 보이지만 선택할 수 없는 와인 (이미 글라스로 등록된 와인) */
  disabledIds?: string[];
  value: string;
  onChange: (wineId: string) => void;
}

// 검색용 정규화: 대소문자·공백·악센트(é 등) 무시
function normalize(text: string) {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '').toLowerCase();
}

function tabClass(active: boolean, size: 'md' | 'sm' = 'md') {
  return clsx(
    'rounded-md text-sm font-medium transition-colors',
    size === 'md' ? 'px-4 py-2' : 'px-3 py-1.5',
    active ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
  );
}

export default function WinePicker({ wines, disabledIds = [], value, onChange }: WinePickerProps) {
  const initialWine = wines.find((w) => w.id === value);
  const [category, setCategory] = useState<WineCategory | ''>(initialWine?.category ?? '');
  const [wineType, setWineType] = useState<WineType | ''>('');
  const [query, setQuery] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

  const q = normalize(query);
  // 카테고리를 고르지 않아도 검색어가 있으면 전체 와인에서 찾는다
  const showList = Boolean(category) || q.length > 0;

  // 병 가격 높은 순, 같은 가격은 이름순
  const visibleWines = wines
    .filter(
      (w) =>
        (!category || w.category === category) &&
        (!wineType || w.type === wineType) &&
        (!q || normalize(w.name).includes(q) || normalize(w.eng_name).includes(q)),
    )
    .sort((a, b) => b.price - a.price || a.name.localeCompare(b.name, 'ko'));
  const selectableCount = visibleWines.filter((w) => !disabledIds.includes(w.id)).length;
  const selectedWine = wines.find((w) => w.id === value);

  // 수정 화면에서 처음 열었을 때 선택된 와인이 리스트 안에 보이도록 스크롤한다
  useEffect(() => {
    const list = listRef.current;
    const selected = list?.querySelector<HTMLElement>('[data-selected="true"]');
    if (list && selected) {
      list.scrollTop = selected.offsetTop - 8;
    }
  }, []);

  const handleCategoryChange = (cat: WineCategory) => {
    setCategory(cat);
    setWineType('');
    listRef.current?.scrollTo({ top: 0 });
  };

  const handleTypeChange = (type: WineType | '') => {
    setWineType(type);
    listRef.current?.scrollTo({ top: 0 });
  };

  const handleQueryChange = (text: string) => {
    setQuery(text);
    listRef.current?.scrollTo({ top: 0 });
  };

  return (
    <div className='space-y-3'>
      {/* 카테고리 탭 */}
      <div className='flex gap-2'>
        {(['conventional', 'natural'] as WineCategory[]).map((cat) => (
          <button key={cat} type='button' onClick={() => handleCategoryChange(cat)} className={tabClass(category === cat)}>
            {cat === 'conventional' ? 'Conventional' : 'Natural'}
          </button>
        ))}
      </div>

      {/* 이름 검색 */}
      <div className='relative'>
        <svg
          className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={2}
          stroke='currentColor'>
          <path strokeLinecap='round' strokeLinejoin='round' d='M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z' />
        </svg>
        <input
          type='text'
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          // 검색창에서 Enter 를 눌러도 폼이 저장되지 않도록 막는다
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.preventDefault();
          }}
          placeholder='와인 이름 검색 (한글/영문)'
          aria-label='와인 이름 검색'
          className='block w-full rounded-md border border-gray-300 py-2 pl-9 pr-9 text-sm shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500'
        />
        {query && (
          <button
            type='button'
            onClick={() => handleQueryChange('')}
            aria-label='검색어 지우기'
            className='absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600'>
            <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' strokeWidth={2} stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
        )}
      </div>

      {!showList ? (
        <div className='rounded-md border border-dashed border-gray-300 px-4 py-8 text-center text-sm text-gray-500'>
          카테고리를 선택하거나 이름으로 검색하세요.
        </div>
      ) : (
        <>
          {/* 타입 필터 */}
          {category && (
            <div className='flex gap-2 flex-wrap'>
              <button type='button' onClick={() => handleTypeChange('')} className={tabClass(wineType === '', 'sm')}>
                전체
              </button>
              {TYPES_BY_CATEGORY[category].map((type) => (
                <button key={type} type='button' onClick={() => handleTypeChange(type)} className={tabClass(wineType === type, 'sm')}>
                  {type}
                </button>
              ))}
            </div>
          )}

          <p className='text-xs text-gray-500'>
            {visibleWines.length}개 · 선택 가능 {selectableCount}개 (이미 글라스로 등록된 와인은 선택할 수 없습니다)
          </p>

          {/* 와인 리스트 (라디오 선택, 높이 제한 + 스크롤) */}
          <div
            ref={listRef}
            role='radiogroup'
            aria-label='와인 선택'
            className='relative max-h-96 overflow-y-auto rounded-md border border-gray-200 bg-white'>
            {visibleWines.length === 0 ? (
              <div className='px-4 py-8 text-center text-sm text-gray-500'>
                {q ? '검색 결과가 없습니다.' : '와인이 없습니다.'}
              </div>
            ) : (
              visibleWines.map((wine) => {
                const isSelected = wine.id === value;
                const isDisabled = disabledIds.includes(wine.id);
                return (
                  <label
                    key={wine.id}
                    data-selected={isSelected}
                    aria-disabled={isDisabled}
                    className={clsx(
                      'flex items-center gap-3 px-3 py-2 border-b border-gray-100 last:border-b-0 transition-colors',
                      isDisabled
                        ? 'cursor-not-allowed bg-gray-50 opacity-50'
                        : isSelected
                          ? 'cursor-pointer bg-gray-100'
                          : 'cursor-pointer hover:bg-gray-50',
                    )}>
                    <input
                      type='radio'
                      name='wine_id'
                      value={wine.id}
                      checked={isSelected}
                      disabled={isDisabled}
                      onChange={() => onChange(wine.id)}
                      className='h-4 w-4 shrink-0 accent-gray-900'
                    />
                    <div className='relative h-16 w-12 shrink-0 rounded bg-gray-50'>
                      {wine.image_url ? (
                        <Image src={wine.image_url} alt={wine.name} fill sizes='48px' className='object-contain' unoptimized />
                      ) : (
                        <span className='absolute inset-0 flex items-center justify-center text-[10px] text-gray-400'>
                          No img
                        </span>
                      )}
                    </div>
                    <div className='min-w-0 flex-1'>
                      <p className='text-sm font-medium text-gray-900 break-keep'>{wine.name}</p>
                      <p className='text-xs text-gray-500 truncate'>{wine.eng_name}</p>
                      <div className='mt-1 flex flex-wrap items-center gap-x-2 gap-y-1'>
                        {/* 카테고리 없이 검색 중이면 어느 카테고리 와인인지 같이 보여준다 */}
                        {!category && (
                          <span className='text-xs text-gray-400'>
                            {wine.category === 'conventional' ? 'Conventional' : 'Natural'}
                          </span>
                        )}
                        <span className='text-xs text-gray-500'>{wine.type}</span>
                        {wine.year && <span className='text-xs text-gray-400'>{wine.year}</span>}
                        {isDisabled && (
                          <span className='inline-flex px-1.5 py-0.5 text-[11px] rounded bg-gray-700 text-white'>
                            글라스 등록됨
                          </span>
                        )}
                        {!wine.is_active && (
                          <span className='inline-flex px-1.5 py-0.5 text-[11px] rounded border border-gray-300 text-gray-500'>
                            비활성
                          </span>
                        )}
                      </div>
                    </div>
                    <span className='shrink-0 text-sm font-medium text-gray-900'>
                      {wine.price.toLocaleString('ko-KR')}원
                    </span>
                  </label>
                );
              })
            )}
          </div>
        </>
      )}

      {selectedWine && (
        <p className='text-sm text-gray-600'>
          선택한 와인: <span className='font-medium text-gray-900'>{selectedWine.name}</span>
          <span className='text-gray-400'> · 병 {selectedWine.price.toLocaleString('ko-KR')}원</span>
        </p>
      )}
      {selectedWine && !selectedWine.is_active && (
        <p className='text-xs text-gray-500'>와인 관리에서 비활성인 와인이지만, 글라스 메뉴에는 표시됩니다.</p>
      )}
    </div>
  );
}
