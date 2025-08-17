'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent,
} from '@dnd-kit/core';
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableTapasListProps<T extends TapasMainType | TapasSideType> {
	items: T[];
	onSave: (newOrder: T[]) => void;
	onCancel: () => void;
}

// 드래그 가능한 개별 아이템 컴포넌트
function SortableItem<T extends TapasMainType | TapasSideType>({ item }: { item: T }) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			className={`bg-gradient-to-r from-gray-700 to-gray-600 p-4 rounded-xl border border-gray-600 cursor-move transition-all duration-200 ${
				isDragging ? 'shadow-2xl scale-105 z-50' : 'hover:shadow-md'
			}`}>
			<div className='flex items-center gap-4'>
				{/* 드래그 핸들 아이콘 */}
				<div className='flex flex-col items-center justify-center text-gray-400'>
					<div className='w-6 h-1 bg-gray-400 rounded mb-1'></div>
					<div className='w-6 h-1 bg-gray-400 rounded mb-1'></div>
					<div className='w-6 h-1 bg-gray-400 rounded'></div>
				</div>

				<div>
					<Image
						src={item.img || 'https://geumnalee.pjsk.kr/tapas/empty.png'}
						alt={item.name}
						width={100}
						height={100}
						unoptimized={true}
						className='min-w-14 min-h-14 w-14 h-14 md:w-24 md:h-24 object-cover rounded-lg'
					/>
				</div>
				<div className='flex flex-col gap-1 md:gap-2'>
					<span className='text-base md:text-lg font-medium text-gray-200 tracking-tighter md:tracking-normal'>
						{item.name}
					</span>
					<span className='text-sm text-gray-400'>{item.price.toLocaleString()}원</span>
				</div>
			</div>
		</div>
	);
}

export default function SortableTapasList<T extends TapasMainType | TapasSideType>({
	items,
	onSave,
	onCancel,
}: SortableTapasListProps<T>) {
	const [localItems, setLocalItems] = useState<T[]>([...items]);
	const [pendingUpdate, setPendingUpdate] = useState<T[] | null>(null);

	// items prop이 변경될 때 localItems 업데이트
	useEffect(() => {
		setLocalItems([...items]);
	}, [items]);

	// pendingUpdate가 있을 때 부모 컴포넌트에 전달
	useEffect(() => {
		if (pendingUpdate) {
			onSave(pendingUpdate);
			setPendingUpdate(null);
		}
	}, [pendingUpdate, onSave]);

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const handleDragEnd = useCallback(
		(event: DragEndEvent) => {
			const { active, over } = event;

			if (active.id !== over?.id) {
				setLocalItems((currentItems) => {
					const oldIndex = currentItems.findIndex((item) => item.id === active.id);
					const newIndex = currentItems.findIndex((item) => item.id === over?.id);

					const newOrder = arrayMove(currentItems, oldIndex, newIndex);
					// pendingUpdate를 통해 다음 렌더링 사이클에서 부모 컴포넌트에 전달
					setPendingUpdate(newOrder);
					return newOrder;
				});
			}
		},
		[onSave]
	);

	return (
		<div className='space-y-4'>
			{/* 드래그 앤 드롭 영역 */}
			<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
				<SortableContext items={localItems} strategy={verticalListSortingStrategy}>
					<div className='space-y-3'>
						{localItems.map((item) => (
							<SortableItem key={item.id} item={item} />
						))}
					</div>
				</SortableContext>
			</DndContext>
		</div>
	);
}
