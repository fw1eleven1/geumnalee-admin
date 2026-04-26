import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui';
import InventoryList from './InventoryList';

interface SearchParams {
	category?: 'conventional' | 'natural';
	type?: string;
	active?: string;
}

function buildUrl(params: { category: string; type?: string; active: string }) {
	const search = new URLSearchParams();
	search.set('category', params.category);
	if (params.type) search.set('type', params.type);
	search.set('active', params.active);
	return `/dashboard/inventory?${search.toString()}`;
}

export default async function InventoryPage({ searchParams }: { searchParams: SearchParams }) {
	const supabase = createClient();

	const category = searchParams.category ?? 'conventional';
	const type = searchParams.type ?? (category === 'conventional' ? 'Red' : undefined);
	const activeOnly = (searchParams.active ?? 'true') === 'true';

	let query = supabase
		.from('wines')
		.select('*')
		.order('category', { ascending: true })
		.order('type', { ascending: true })
		.order('display_order', { ascending: true });

	query = query.eq('category', category);
	if (type) {
		query = query.eq('type', type);
	}
	if (activeOnly) {
		query = query.eq('is_active', true);
	}

	const { data: wines, error } = await query;

	if (error) {
		console.error('Error fetching wines:', error);
	}

	const activeParam = activeOnly ? 'true' : 'false';

	return (
		<div className='space-y-4 md:space-y-6'>
			<div>
				<h1 className='text-xl font-bold text-gray-900 md:text-2xl'>재고 관리</h1>
				<p className='mt-1 text-sm text-gray-600'>총 {wines?.length || 0}개의 와인</p>
			</div>

			{/* 카테고리 탭 */}
			<div className='flex gap-2'>
				<Link href={buildUrl({ category: 'conventional', type: 'Red', active: activeParam })}>
					<Button variant={category === 'conventional' ? 'primary' : 'ghost'} size='sm'>
						Conventional
					</Button>
				</Link>
				<Link href={buildUrl({ category: 'natural', active: activeParam })}>
					<Button variant={category === 'natural' ? 'primary' : 'ghost'} size='sm'>
						Natural
					</Button>
				</Link>
			</div>

			{/* 컨벤셔널 타입 탭 */}
			{category === 'conventional' && (
				<div className='flex gap-2 flex-wrap'>
					{['Red', 'White', 'Sparkling', 'Champagne'].map((t) => (
						<Link key={t} href={buildUrl({ category: 'conventional', type: t, active: activeParam })}>
							<Button
								variant='ghost'
								size='sm'
								className={type === t ? 'bg-gray-900 text-white hover:bg-gray-800 hover:text-white' : ''}>
								{t}
							</Button>
						</Link>
					))}
				</div>
			)}

			{/* 활성화 필터 탭 */}
			<div className='flex gap-2'>
				<Link href={buildUrl({ category, type, active: 'true' })}>
					<Button
						variant='ghost'
						size='sm'
						className={activeOnly ? 'bg-green-600 text-white hover:bg-green-700 hover:text-white' : ''}>
						활성화만 보기
					</Button>
				</Link>
				<Link href={buildUrl({ category, type, active: 'false' })}>
					<Button
						variant='ghost'
						size='sm'
						className={!activeOnly ? 'bg-gray-900 text-white hover:bg-gray-800 hover:text-white' : ''}>
						전체 보기
					</Button>
				</Link>
			</div>

			<InventoryList wines={wines || []} />
		</div>
	);
}
