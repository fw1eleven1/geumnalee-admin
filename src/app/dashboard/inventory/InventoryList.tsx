'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { toggleWineActive, updateWineStock } from '@/actions/wines';
import type { Wine } from '@/types';

function StockEditor({ wine, onStockChange }: { wine: Wine; onStockChange: (id: string, stock: number) => void }) {
	const [strValue, setStrValue] = useState(String(wine.stock));
	const [isSaving, setIsSaving] = useState(false);

	const numValue = parseInt(strValue, 10) || 0;

	useEffect(() => {
		setStrValue(String(wine.stock));
	}, [wine.stock]);

	const saveStock = async (newStock: number) => {
		if (newStock < 0 || newStock === wine.stock) return;
		const prevStock = wine.stock;
		setIsSaving(true);
		onStockChange(wine.id, newStock);
		try {
			await updateWineStock(wine.id, newStock);
		} catch {
			onStockChange(wine.id, prevStock);
			setStrValue(String(prevStock));
			alert('재고 수정 중 오류가 발생했습니다.');
		} finally {
			setIsSaving(false);
		}
	};

	const handleDecrement = () => {
		const newVal = Math.max(0, numValue - 1);
		setStrValue(String(newVal));
		saveStock(newVal);
	};

	const handleIncrement = () => {
		const newVal = numValue + 1;
		setStrValue(String(newVal));
		saveStock(newVal);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const parsed = parseInt(e.target.value, 10);
		setStrValue(String(isNaN(parsed) ? 0 : Math.max(0, parsed)));
	};

	const handleBlur = () => {
		saveStock(numValue);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			saveStock(numValue);
		}
	};

	const stockColor =
		numValue === 0 ? 'text-red-600' : numValue <= 2 ? 'text-orange-500' : 'text-gray-900';

	return (
		<div className='flex items-center gap-1'>
			<button
				onClick={handleDecrement}
				disabled={isSaving || numValue === 0}
				className='flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'>
				-
			</button>
			<input
				type='number'
				min={0}
				value={strValue}
				onChange={handleInputChange}
				onBlur={handleBlur}
				onKeyDown={handleKeyDown}
				disabled={isSaving}
				className={`h-7 w-14 rounded-md border border-gray-300 text-center text-sm font-medium ${stockColor} disabled:opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
			/>
			<button
				onClick={handleIncrement}
				disabled={isSaving}
				className='flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'>
				+
			</button>
		</div>
	);
}

function StockBadge({ stock }: { stock: number }) {
	if (stock === 0) {
		return <span className='inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-800'>품절</span>;
	}
	if (stock <= 2) {
		return <span className='inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-orange-100 text-orange-800'>{stock}병</span>;
	}
	return <span className='inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-800'>{stock}병</span>;
}

interface InventoryListProps {
	wines: Wine[];
}

export default function InventoryList({ wines: initialWines }: InventoryListProps) {
	const [wines, setWines] = useState(initialWines);
	const [togglingId, setTogglingId] = useState<string | null>(null);

	useEffect(() => {
		setWines(initialWines);
	}, [initialWines]);

	const handleToggleActive = async (id: string, currentActive: boolean) => {
		setTogglingId(id);
		try {
			await toggleWineActive(id, !currentActive);
			setWines((prev) => prev.map((w) => (w.id === id ? { ...w, is_active: !currentActive } : w)));
		} catch {
			alert('상태 변경 중 오류가 발생했습니다.');
		} finally {
			setTogglingId(null);
		}
	};

	const handleStockChange = (id: string, stock: number) => {
		setWines((prev) => prev.map((w) => (w.id === id ? { ...w, stock } : w)));
	};

	if (wines.length === 0) {
		return <div className='bg-white rounded-lg shadow p-8 text-center text-gray-500'>등록된 와인이 없습니다.</div>;
	}

	return (
		<>
			{/* 모바일 카드 레이아웃 */}
			<div className='grid grid-cols-1 gap-4 lg:hidden'>
				{wines.map((wine) => (
					<div key={wine.id} className='bg-white rounded-lg shadow p-4'>
						<div className='flex gap-4'>
							{wine.image_url && (
								<div className='h-20 w-16 relative flex-shrink-0'>
									<Image src={wine.image_url} alt={wine.name} fill className='object-contain' unoptimized />
								</div>
							)}
							<div className='flex-1 min-w-0'>
								<div className='flex items-start justify-between gap-2'>
									<div>
										<h3 className='text-sm font-medium text-gray-900 truncate'>{wine.name}</h3>
										<p className='text-xs text-gray-500 truncate'>{wine.eng_name}</p>
									</div>
									<button
										onClick={() => handleToggleActive(wine.id, wine.is_active)}
										disabled={togglingId === wine.id}
										className={`flex-shrink-0 px-2 py-1 text-xs font-medium rounded-full ${
											wine.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
										}`}>
										{togglingId === wine.id ? '...' : wine.is_active ? '활성' : '비활성'}
									</button>
								</div>
								<div className='mt-2 flex flex-wrap items-center gap-2'>
									<span
										className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
											wine.category === 'conventional' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
										}`}>
										{wine.category === 'conventional' ? 'Conventional' : 'Natural'}
									</span>
									<span className='text-xs text-gray-500'>{wine.type}</span>
									<span className='text-sm font-medium text-gray-900'>{wine.price.toLocaleString('ko-KR')}원</span>
								</div>
							</div>
						</div>
						<div className='mt-3 flex items-center justify-between border-t pt-3'>
							<div className='flex items-center gap-2'>
								<span className='text-sm text-gray-600'>재고:</span>
								<StockBadge stock={wine.stock} />
							</div>
							<StockEditor wine={wine} onStockChange={handleStockChange} />
						</div>
					</div>
				))}
			</div>

			{/* 데스크톱 테이블 레이아웃 */}
			<div className='hidden lg:block bg-white rounded-lg shadow overflow-x-auto'>
				<table className='min-w-full divide-y divide-gray-200'>
					<thead className='bg-gray-50'>
						<tr>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>와인</th>
							<th className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>카테고리</th>
							<th className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>타입</th>
							<th className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>가격</th>
							<th className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>상태</th>
							<th className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>재고</th>
						</tr>
					</thead>
					<tbody className='bg-white divide-y divide-gray-200'>
						{wines.map((wine) => (
							<tr key={wine.id} className='hover:bg-gray-50'>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='flex items-center'>
										{wine.image_url && (
											<div className='h-12 w-10 relative flex-shrink-0 mr-3'>
												<Image src={wine.image_url} alt={wine.name} fill className='object-contain' unoptimized />
											</div>
										)}
										<div>
											<div className='text-sm font-medium text-gray-900'>{wine.name}</div>
											<div className='text-sm text-gray-500'>{wine.eng_name}</div>
										</div>
									</div>
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-center'>
									<span
										className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
											wine.category === 'conventional' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
										}`}>
										{wine.category === 'conventional' ? 'Conventional' : 'Natural'}
									</span>
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500'>{wine.type}</td>
								<td className='px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900'>
									{wine.price.toLocaleString('ko-KR')}원
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-center'>
									<button
										onClick={() => handleToggleActive(wine.id, wine.is_active)}
										disabled={togglingId === wine.id}
										className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
											wine.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
										}`}>
										{togglingId === wine.id ? '...' : wine.is_active ? '활성화' : '비활성화'}
									</button>
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-center'>
									<div className='flex justify-center'>
										<StockEditor wine={wine} onStockChange={handleStockChange} />
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</>
	);
}
