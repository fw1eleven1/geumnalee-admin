'use client';

import Link from 'next/link';
import { useState } from 'react';
import { toggleMonthlyWineActive, deleteMonthlyWine } from '@/actions/monthly-wines';
import { calcDiscountedPrice } from '@/types';
import { ConfirmModal } from '@/components/ui';
import type { MonthlyWine } from '@/types';

interface MonthlyWineListProps {
  monthlyWines: MonthlyWine[];
}

export default function MonthlyWineList({ monthlyWines: initialList }: MonthlyWineListProps) {
  const [list, setList] = useState(initialList);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    setTogglingId(id);
    try {
      await toggleMonthlyWineActive(id, !currentActive);
      setList((prev) => prev.map((item) => (item.id === id ? { ...item, is_active: !currentActive } : item)));
    } catch {
      alert('상태 변경 중 오류가 발생했습니다.');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteMonthlyWine(id);
      setList((prev) => prev.filter((item) => item.id !== id));
    } catch {
      alert('삭제 중 오류가 발생했습니다.');
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  if (list.length === 0) {
    return (
      <div className='bg-white rounded-lg shadow p-8 text-center text-gray-500'>
        등록된 이 달의 와인이 없습니다.
      </div>
    );
  }

  return (
    <>
      {/* 모바일 카드 */}
      <div className='grid grid-cols-1 gap-4 lg:hidden'>
        {list.map((item) => {
          const wine = item.wine!;
          const discountedPrice = calcDiscountedPrice(wine.price, item.discount_rate, item.round_down_100);
          return (
            <div key={item.id} className='bg-white rounded-lg shadow p-4'>
              <div className='flex items-start justify-between gap-2'>
                <div className='min-w-0 flex-1'>
                  <p className='text-sm font-medium text-gray-900 truncate'>{wine.name}</p>
                  <p className='text-xs text-gray-500 truncate'>{wine.eng_name}</p>
                  <div className='mt-2 flex flex-wrap items-center gap-2'>
                    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${wine.category === 'conventional' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                      {wine.category === 'conventional' ? 'Conventional' : 'Natural'}
                    </span>
                    <span className='text-xs text-gray-500'>{wine.type}</span>
                  </div>
                  <div className='mt-2 flex items-center gap-2'>
                    <span className='text-xs text-gray-400 line-through'>{wine.price.toLocaleString('ko-KR')}원</span>
                    <span className='text-sm font-semibold text-rose-600'>{discountedPrice.toLocaleString('ko-KR')}원</span>
                    <span className='inline-flex px-1.5 py-0.5 text-xs font-bold rounded bg-rose-100 text-rose-700'>{item.discount_rate}%</span>
                    {item.round_down_100 && (
                      <span className='inline-flex px-1.5 py-0.5 text-xs rounded bg-gray-100 text-gray-600'>백원절삭</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleToggleActive(item.id, item.is_active)}
                  disabled={togglingId === item.id}
                  className={`flex-shrink-0 px-2 py-1 text-xs font-medium rounded-full ${item.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {togglingId === item.id ? '...' : item.is_active ? '활성' : '비활성'}
                </button>
              </div>
              <div className='mt-3 flex items-center justify-end gap-2 border-t pt-3'>
                <Link
                  href={`/dashboard/monthly-wines/${item.id}/edit`}
                  className='px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200'>
                  수정
                </Link>
                <button
                  onClick={() => setConfirmId(item.id)}
                  disabled={deletingId === item.id}
                  className='px-3 py-1.5 text-xs font-medium rounded-md bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50'>
                  {deletingId === item.id ? '삭제 중...' : '삭제'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 데스크톱 테이블 */}
      <div className='hidden lg:block bg-white rounded-lg shadow overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>와인</th>
              <th className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>카테고리</th>
              <th className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>원가</th>
              <th className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>할인율</th>
              <th className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>할인가</th>
              <th className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>백원절삭</th>
              <th className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>상태</th>
              <th className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>관리</th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {list.map((item) => {
              const wine = item.wine!;
              const discountedPrice = calcDiscountedPrice(wine.price, item.discount_rate, item.round_down_100);
              return (
                <tr key={item.id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm font-medium text-gray-900'>{wine.name}</div>
                    <div className='text-sm text-gray-500'>{wine.eng_name}</div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-center'>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${wine.category === 'conventional' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                      {wine.category === 'conventional' ? 'Conventional' : 'Natural'}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500'>
                    {wine.price.toLocaleString('ko-KR')}원
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-center'>
                    <span className='inline-flex px-2 py-1 text-xs font-bold rounded bg-rose-100 text-rose-700'>
                      {item.discount_rate}%
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-center text-sm font-semibold text-rose-600'>
                    {discountedPrice.toLocaleString('ko-KR')}원
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500'>
                    {item.round_down_100 ? '✓' : '-'}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-center'>
                    <button
                      onClick={() => handleToggleActive(item.id, item.is_active)}
                      disabled={togglingId === item.id}
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${item.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {togglingId === item.id ? '...' : item.is_active ? '활성화' : '비활성화'}
                    </button>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-center'>
                    <div className='flex items-center justify-center gap-2'>
                      <Link
                        href={`/dashboard/monthly-wines/${item.id}/edit`}
                        className='px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200'>
                        수정
                      </Link>
                      <button
                        onClick={() => setConfirmId(item.id)}
                        disabled={deletingId === item.id}
                        className='px-3 py-1.5 text-xs font-medium rounded-md bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50'>
                        {deletingId === item.id ? '삭제 중...' : '삭제'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={confirmId !== null}
        title='이 달의 와인 삭제'
        message='이 항목을 삭제하시겠습니까?'
        onConfirm={() => confirmId && handleDelete(confirmId)}
        onCancel={() => setConfirmId(null)}
      />
    </>
  );
}
