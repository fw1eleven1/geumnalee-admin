'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { toggleGlassWineActive, deleteGlassWine, updateGlassWineOrder } from '@/actions/glass-wines';
import { ConfirmModal } from '@/components/ui';
import type { GlassWine, WineType } from '@/types';

interface GlassWineListProps {
  glassWines: GlassWine[];
}

// 메뉴 앱 /wines/glass 와 같은 종류·순서로 묶는다.
// 메뉴는 종류별로 나눠 보여주므로, 순서는 같은 종류 안에서만 바꿀 수 있게 한다.
const SECTIONS: { type: WineType; title: string }[] = [
  { type: 'Champagne', title: 'CHAMPAGNE' },
  { type: 'Sparkling', title: 'SPARKLING WINES' },
  { type: 'Red', title: 'RED WINES' },
  { type: 'White', title: 'WHITE WINES' },
  { type: 'Orange', title: 'ORANGE WINES' },
];

function groupByType(list: GlassWine[]) {
  return SECTIONS.map((section) => ({
    ...section,
    items: list.filter((item) => item.wine!.type === section.type),
  }));
}

interface ItemProps {
  item: GlassWine;
  togglingId: string | null;
  deletingId: string | null;
  onToggleActive: (id: string, currentActive: boolean) => void;
  onDelete: (id: string) => void;
}

function DragHandle({ className }: { className?: string }) {
  return (
    <svg className={className} fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor'>
      <path strokeLinecap='round' strokeLinejoin='round' d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5' />
    </svg>
  );
}

function CategoryBadge({ category }: { category: string }) {
  const isConventional = category === 'conventional';
  return (
    <span
      className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${isConventional ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
      {isConventional ? 'Conventional' : 'Natural'}
    </span>
  );
}

function useSortableStyle(id: string) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  return { attributes, listeners, setNodeRef, style };
}

function SortableCard({ item, togglingId, deletingId, onToggleActive, onDelete }: ItemProps) {
  const { attributes, listeners, setNodeRef, style } = useSortableStyle(item.id);
  const wine = item.wine!;

  return (
    <div ref={setNodeRef} style={style} className='bg-white rounded-lg shadow p-4'>
      <div className='flex items-start gap-3'>
        <button
          {...attributes}
          {...listeners}
          aria-label='순서 변경'
          className='flex-shrink-0 cursor-grab active:cursor-grabbing touch-none p-1 -ml-1 text-gray-400 hover:text-gray-600'>
          <DragHandle className='h-5 w-5' />
        </button>
        <div className='min-w-0 flex-1'>
          <p className='text-sm font-medium text-gray-900 truncate'>{wine.name}</p>
          <p className='text-xs text-gray-500 truncate'>{wine.eng_name}</p>
          <div className='mt-2 flex flex-wrap items-center gap-2'>
            <CategoryBadge category={wine.category} />
            <span className='text-xs text-gray-500'>{wine.type}</span>
            {!wine.is_active && (
              <span className='inline-flex px-1.5 py-0.5 text-xs rounded bg-gray-100 text-gray-600'>비활성</span>
            )}
          </div>
          <div className='mt-2 flex items-center gap-2'>
            <span className='text-sm font-semibold text-gray-900'>잔 {item.glass_price.toLocaleString('ko-KR')}원</span>
            <span className='text-xs text-gray-400'>병 {wine.price.toLocaleString('ko-KR')}원</span>
          </div>
        </div>
        <button
          onClick={() => onToggleActive(item.id, item.is_active)}
          disabled={togglingId === item.id}
          className={`flex-shrink-0 px-2 py-1 text-xs font-medium rounded-full ${item.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {togglingId === item.id ? '...' : item.is_active ? '활성' : '비활성'}
        </button>
      </div>
      <div className='mt-3 flex items-center justify-end gap-2 border-t pt-3'>
        <Link
          href={`/dashboard/glass-wines/${item.id}/edit`}
          className='px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200'>
          수정
        </Link>
        <button
          onClick={() => onDelete(item.id)}
          disabled={deletingId === item.id}
          className='px-3 py-1.5 text-xs font-medium rounded-md bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50'>
          {deletingId === item.id ? '삭제 중...' : '삭제'}
        </button>
      </div>
    </div>
  );
}

function SortableRow({ item, togglingId, deletingId, onToggleActive, onDelete }: ItemProps) {
  const { attributes, listeners, setNodeRef, style } = useSortableStyle(item.id);
  const wine = item.wine!;

  return (
    <tr ref={setNodeRef} style={style} className='hover:bg-gray-50'>
      <td className='px-3 py-4 whitespace-nowrap'>
        <button
          {...attributes}
          {...listeners}
          aria-label='순서 변경'
          className='cursor-grab active:cursor-grabbing touch-none p-1 text-gray-400 hover:text-gray-600'>
          <DragHandle className='h-5 w-5' />
        </button>
      </td>
      <td className='px-6 py-4 whitespace-nowrap'>
        <div className='flex items-center gap-2 min-w-0'>
          <span className='text-sm font-medium text-gray-900 truncate' title={wine.name}>{wine.name}</span>
          {!wine.is_active && (
            <span className='flex-shrink-0 inline-flex px-1.5 py-0.5 text-xs rounded bg-gray-100 text-gray-600'>비활성</span>
          )}
        </div>
        <div className='text-sm text-gray-500 truncate' title={wine.eng_name}>{wine.eng_name}</div>
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-center'>
        <CategoryBadge category={wine.category} />
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500'>{wine.type}</td>
      <td className='px-6 py-4 whitespace-nowrap text-center text-sm font-semibold text-gray-900'>
        {item.glass_price.toLocaleString('ko-KR')}원
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500'>
        {wine.price.toLocaleString('ko-KR')}원
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-center'>
        <button
          onClick={() => onToggleActive(item.id, item.is_active)}
          disabled={togglingId === item.id}
          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${item.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {togglingId === item.id ? '...' : item.is_active ? '활성화' : '비활성화'}
        </button>
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-center'>
        <div className='flex items-center justify-center gap-2'>
          <Link
            href={`/dashboard/glass-wines/${item.id}/edit`}
            className='px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200'>
            수정
          </Link>
          <button
            onClick={() => onDelete(item.id)}
            disabled={deletingId === item.id}
            className='px-3 py-1.5 text-xs font-medium rounded-md bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50'>
            {deletingId === item.id ? '삭제 중...' : '삭제'}
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function GlassWineList({ glassWines: initialList }: GlassWineListProps) {
  const [list, setList] = useState(initialList.filter((item) => item.wine));
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // 서버에서 새 목록이 오면 화면도 맞춘다
  useEffect(() => {
    setList(initialList.filter((item) => item.wine));
  }, [initialList]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    setTogglingId(id);
    try {
      await toggleGlassWineActive(id, !currentActive);
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
      await deleteGlassWine(id);
      setList((prev) => prev.filter((item) => item.id !== id));
    } catch {
      alert('삭제 중 오류가 발생했습니다.');
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  // 한 종류 안에서 순서를 바꾼 뒤, 전체를 메뉴에 보이는 순서대로 다시 번호 매겨 저장한다
  const handleDragEnd = async (type: WineType, event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const prevList = list;
    const nextList = groupByType(prevList).flatMap((group) => {
      if (group.type !== type) return group.items;
      const oldIndex = group.items.findIndex((item) => item.id === active.id);
      const newIndex = group.items.findIndex((item) => item.id === over.id);
      if (oldIndex < 0 || newIndex < 0) return group.items;
      return arrayMove(group.items, oldIndex, newIndex);
    });

    setList(nextList);
    setIsSaving(true);
    try {
      await updateGlassWineOrder(nextList.map((item, index) => ({ id: item.id, display_order: index + 1 })));
    } catch {
      alert('순서 저장 중 오류가 발생했습니다.');
      setList(prevList);
    } finally {
      setIsSaving(false);
    }
  };

  if (list.length === 0) {
    return (
      <div className='bg-white rounded-lg shadow p-8 text-center text-gray-500'>
        등록된 글라스 와인이 없습니다.
      </div>
    );
  }

  const itemProps = {
    togglingId,
    deletingId,
    onToggleActive: handleToggleActive,
    onDelete: setConfirmId,
  };

  return (
    <>
      <p className='text-sm text-gray-500'>
        {isSaving ? '순서 저장 중...' : '왼쪽 ≡ 를 끌어서 순서를 바꿀 수 있습니다. 메뉴에는 종류별로 이 순서대로 표시됩니다.'}
      </p>

      {groupByType(list)
        .filter((group) => group.items.length > 0)
        .map((group) => {
          const ids = group.items.map((item) => item.id);
          const onDragEnd = (event: DragEndEvent) => handleDragEnd(group.type, event);

          // 모바일·데스크톱 목록은 같은 id 를 쓰므로 DndContext 를 따로 둔다
          return (
            <section key={group.type} className='space-y-3'>
              <h2 className='text-sm font-semibold tracking-wide text-gray-700'>{group.title}</h2>

              {/* 모바일 카드 */}
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                <div className='grid grid-cols-1 gap-4 lg:hidden'>
                  <SortableContext items={ids} strategy={verticalListSortingStrategy}>
                    {group.items.map((item) => (
                      <SortableCard key={item.id} item={item} {...itemProps} />
                    ))}
                  </SortableContext>
                </div>
              </DndContext>

              {/* 데스크톱 테이블 */}
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                <div className='hidden lg:block bg-white rounded-lg shadow overflow-x-auto'>
                  {/* 종류마다 표가 따로라 열 너비를 고정해 표끼리 열을 맞춘다 (남는 폭은 와인 열) */}
                  <table className='w-full min-w-[960px] table-fixed divide-y divide-gray-200'>
                    <thead className='bg-gray-50'>
                      <tr>
                        <th className='px-3 py-3 w-12'></th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>와인</th>
                        <th className='px-6 py-3 w-40 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>카테고리</th>
                        <th className='px-6 py-3 w-28 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>타입</th>
                        <th className='px-6 py-3 w-32 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>잔 가격</th>
                        <th className='px-6 py-3 w-32 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>병 가격</th>
                        <th className='px-6 py-3 w-28 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>상태</th>
                        <th className='px-6 py-3 w-40 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>관리</th>
                      </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
                        {group.items.map((item) => (
                          <SortableRow key={item.id} item={item} {...itemProps} />
                        ))}
                      </SortableContext>
                    </tbody>
                  </table>
                </div>
              </DndContext>
            </section>
          );
        })}

      <ConfirmModal
        isOpen={confirmId !== null}
        title='글라스 와인 삭제'
        message='글라스 메뉴에서 이 와인을 삭제하시겠습니까? (와인 자체는 삭제되지 않습니다)'
        onConfirm={() => confirmId && handleDelete(confirmId)}
        onCancel={() => setConfirmId(null)}
      />
    </>
  );
}
