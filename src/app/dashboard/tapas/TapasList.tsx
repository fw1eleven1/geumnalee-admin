'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
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
	useSortable,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button, ConfirmModal } from '@/components/ui';
import { deleteTapas, toggleTapasActive, updateTapasOrder } from '@/actions/tapas';
import type { Tapas } from '@/types';

interface DeleteTarget {
	id: string;
	name: string;
}

interface TapasListProps {
	tapas: Tapas[];
}

function DragHandle({ className }: { className?: string }) {
	return (
		<svg className={className} fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor'>
			<path strokeLinecap='round' strokeLinejoin='round' d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5' />
		</svg>
	);
}

function SortableTapasCard({
	item,
	onDelete,
	onToggleActive,
	deletingId,
	togglingId,
}: {
	item: Tapas;
	onDelete: (id: string, name: string) => void;
	onToggleActive: (id: string, currentActive: boolean) => void;
	deletingId: string | null;
	togglingId: string | null;
}) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	return (
		<div ref={setNodeRef} style={style} className='bg-white rounded-lg shadow p-4'>
			<div className='flex gap-4'>
				<button
					{...attributes}
					{...listeners}
					className='flex-shrink-0 cursor-grab active:cursor-grabbing touch-none p-1 -ml-1 text-gray-400 hover:text-gray-600'>
					<DragHandle className='h-5 w-5' />
				</button>
				{item.image_url && (
					<div className='h-16 w-16 relative flex-shrink-0'>
						<Image src={item.image_url} alt={item.name} fill className='object-cover rounded-md' unoptimized />
					</div>
				)}
				<div className='flex-1 min-w-0'>
					<div className='flex items-start justify-between gap-2'>
						<div>
							<h3 className='text-sm font-medium text-gray-900'>{item.name}</h3>
							{item.description && <p className='text-xs text-gray-500 line-clamp-2 mt-0.5'>{item.description}</p>}
						</div>
						<button
							onClick={() => onToggleActive(item.id, item.is_active)}
							disabled={togglingId === item.id}
							className={`flex-shrink-0 px-2 py-1 text-xs font-medium rounded-full ${
								item.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
							}`}>
							{togglingId === item.id ? '...' : item.is_active ? '활성' : '비활성'}
						</button>
					</div>
					<div className='mt-2 flex items-center gap-2'>
						<span
							className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
								item.category === 'main' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'
							}`}>
							{item.category === 'main' ? '메인' : '사이드'}
						</span>
						<span className='text-sm font-medium text-gray-900'>{item.price.toLocaleString('ko-KR')}원</span>
					</div>
				</div>
			</div>
			<div className='mt-3 flex justify-end gap-2 border-t pt-3'>
				<Link href={`/dashboard/tapas/${item.id}/edit`}>
					<Button variant='ghost' size='sm'>
						수정
					</Button>
				</Link>
				<Button
					variant='ghost'
					size='sm'
					onClick={() => onDelete(item.id, item.name)}
					disabled={deletingId === item.id}
					className='text-red-600 hover:text-red-700 hover:bg-red-50'>
					{deletingId === item.id ? '...' : '삭제'}
				</Button>
			</div>
		</div>
	);
}

function SortableTapasRow({
	item,
	onDelete,
	onToggleActive,
	deletingId,
	togglingId,
}: {
	item: Tapas;
	onDelete: (id: string, name: string) => void;
	onToggleActive: (id: string, currentActive: boolean) => void;
	deletingId: string | null;
	togglingId: string | null;
}) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	return (
		<tr ref={setNodeRef} style={style} className='hover:bg-gray-50'>
			<td className='px-3 py-4 whitespace-nowrap'>
				<button
					{...attributes}
					{...listeners}
					className='cursor-grab active:cursor-grabbing touch-none p-1 text-gray-400 hover:text-gray-600'>
					<DragHandle className='h-5 w-5' />
				</button>
			</td>
			<td className='px-6 py-4 whitespace-nowrap'>
				<div className='flex items-center'>
					{item.image_url && (
						<div className='h-12 w-12 relative flex-shrink-0 mr-3'>
							<Image src={item.image_url} alt={item.name} fill className='object-cover rounded-md' unoptimized />
						</div>
					)}
					<div>
						<div className='text-sm font-medium text-gray-900'>{item.name}</div>
						{item.description && <div className='text-sm text-gray-500 truncate max-w-xs'>{item.description}</div>}
					</div>
				</div>
			</td>
			<td className='px-6 py-4 whitespace-nowrap text-center'>
				<span
					className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
						item.category === 'main' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'
					}`}>
					{item.category === 'main' ? '메인' : '사이드'}
				</span>
			</td>
			<td className='px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900'>
				{item.price.toLocaleString('ko-KR')}원
			</td>
			<td className='px-6 py-4 whitespace-nowrap text-center'>
				<button
					onClick={() => onToggleActive(item.id, item.is_active)}
					disabled={togglingId === item.id}
					className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
						item.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
					}`}>
					{togglingId === item.id ? '...' : item.is_active ? '활성화' : '비활성화'}
				</button>
			</td>
			<td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
				<div className='flex justify-end gap-2'>
					<Link href={`/dashboard/tapas/${item.id}/edit`}>
						<Button variant='ghost' size='sm'>
							수정
						</Button>
					</Link>
					<Button
						variant='ghost'
						size='sm'
						onClick={() => onDelete(item.id, item.name)}
						disabled={deletingId === item.id}
						className='text-red-600 hover:text-red-700 hover:bg-red-50'>
						{deletingId === item.id ? '...' : '삭제'}
					</Button>
				</div>
			</td>
		</tr>
	);
}

export default function TapasList({ tapas: initialTapas }: TapasListProps) {
	const [tapas, setTapas] = useState(initialTapas);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [togglingId, setTogglingId] = useState<string | null>(null);
	const [isSaving, setIsSaving] = useState(false);
	const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

	// props 변경 시 state 동기화
	useEffect(() => {
		setTapas(initialTapas);
	}, [initialTapas]);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const handleDeleteClick = (id: string, name: string) => {
		setDeleteTarget({ id, name });
	};

	const handleDeleteConfirm = async () => {
		if (!deleteTarget) return;

		setDeletingId(deleteTarget.id);
		try {
			await deleteTapas(deleteTarget.id);
			setTapas((prev) => prev.filter((t) => t.id !== deleteTarget.id));
			setDeleteTarget(null);
		} catch (error) {
			console.error('Delete error:', error);
			alert('삭제 중 오류가 발생했습니다.');
		} finally {
			setDeletingId(null);
		}
	};

	const handleDeleteCancel = () => {
		setDeleteTarget(null);
	};

	const handleToggleActive = async (id: string, currentActive: boolean) => {
		setTogglingId(id);
		try {
			await toggleTapasActive(id, !currentActive);
			setTapas((prev) => prev.map((t) => (t.id === id ? { ...t, is_active: !currentActive } : t)));
		} catch (error) {
			console.error('Toggle error:', error);
			alert('상태 변경 중 오류가 발생했습니다.');
		} finally {
			setTogglingId(null);
		}
	};

	const handleDragEnd = async (event: DragEndEvent) => {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			const oldIndex = tapas.findIndex((t) => t.id === active.id);
			const newIndex = tapas.findIndex((t) => t.id === over.id);

			const newTapas = arrayMove(tapas, oldIndex, newIndex);
			setTapas(newTapas);

			// Save new order to database
			setIsSaving(true);
			try {
				const orderUpdates = newTapas.map((item, index) => ({
					id: item.id,
					display_order: index + 1,
				}));
				await updateTapasOrder(orderUpdates);
			} catch (error) {
				console.error('Order update error:', error);
				alert('순서 저장 중 오류가 발생했습니다.');
				setTapas(initialTapas);
			} finally {
				setIsSaving(false);
			}
		}
	};

	if (tapas.length === 0) {
		return <div className='bg-white rounded-lg shadow p-8 text-center text-gray-500'>등록된 타파스가 없습니다.</div>;
	}

	return (
		<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
			{isSaving && <div className='text-sm text-gray-500 mb-2'>순서 저장 중...</div>}

			{/* 모바일 카드 레이아웃 */}
			<div className='grid grid-cols-1 gap-4 lg:hidden'>
				<SortableContext items={tapas.map((t) => t.id)} strategy={verticalListSortingStrategy}>
					{tapas.map((item) => (
						<SortableTapasCard
							key={item.id}
							item={item}
							onDelete={handleDeleteClick}
							onToggleActive={handleToggleActive}
							deletingId={deletingId}
							togglingId={togglingId}
						/>
					))}
				</SortableContext>
			</div>

			{/* 데스크톱 테이블 레이아웃 */}
			<div className='hidden lg:block bg-white rounded-lg shadow overflow-x-auto'>
				<table className='min-w-full divide-y divide-gray-200'>
					<thead className='bg-gray-50'>
						<tr>
							<th className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10'></th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>타파스</th>
							<th className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>카테고리</th>
							<th className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>가격</th>
							<th className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>상태</th>
							<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>작업</th>
						</tr>
					</thead>
					<tbody className='bg-white divide-y divide-gray-200'>
						<SortableContext items={tapas.map((t) => t.id)} strategy={verticalListSortingStrategy}>
							{tapas.map((item) => (
								<SortableTapasRow
									key={item.id}
									item={item}
									onDelete={handleDeleteClick}
									onToggleActive={handleToggleActive}
									deletingId={deletingId}
									togglingId={togglingId}
								/>
							))}
						</SortableContext>
					</tbody>
				</table>
			</div>

			<ConfirmModal
				isOpen={deleteTarget !== null}
				title="타파스 삭제"
				message={`"${deleteTarget?.name}" 타파스를 삭제하시겠습니까?`}
				confirmText="삭제"
				cancelText="취소"
				onConfirm={handleDeleteConfirm}
				onCancel={handleDeleteCancel}
				isLoading={deletingId !== null}
			/>
		</DndContext>
	);
}
