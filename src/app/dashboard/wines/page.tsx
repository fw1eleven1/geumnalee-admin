import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui';
import WineList from './WineList';

interface SearchParams {
	// 'unused' 는 미활용 탭 (카테고리 구분 없이 미활용 와인만 표시)
	category?: 'conventional' | 'natural' | 'unused';
	type?: string;
}

export default async function WinesPage({ searchParams }: { searchParams: SearchParams }) {
	const supabase = createClient();
	const isUnusedTab = searchParams.category === 'unused';

	let query = supabase
		.from('wines')
		.select('*, ratings:wine_ratings(*)')
		.order('category', { ascending: true })
		.order('type', { ascending: true })
		.order('display_order', { ascending: true });

	// 미활용 와인은 미활용 탭에서만 보인다
	query = query.eq('is_unused', isUnusedTab);

	if (!isUnusedTab) {
		if (searchParams.category) {
			query = query.eq('category', searchParams.category);
		}
		if (searchParams.type) {
			query = query.eq('type', searchParams.type);
		}
	}

	const { data: wines, error } = await query;

	if (error) {
		console.error('Error fetching wines:', error);
	}

	return (
		<div className='space-y-4 md:space-y-6'>
			<div className='flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center'>
				<div>
					<h1 className='text-xl font-bold text-gray-900 md:text-2xl'>와인 관리</h1>
					<p className='mt-1 text-sm text-gray-600'>총 {wines?.length || 0}개의 와인</p>
				</div>
				<Link href='/dashboard/wines/new' className='self-start sm:self-auto'>
					<Button>새 와인 추가</Button>
				</Link>
			</div>

			{/* 카테고리 탭 */}
			<div className='flex gap-2'>
				<Link href='/dashboard/wines?category=conventional&type=Red'>
					<Button variant={searchParams.category === 'conventional' ? 'primary' : 'ghost'} size='sm'>
						Conventional
					</Button>
				</Link>
				<Link href='/dashboard/wines?category=natural'>
					<Button variant={searchParams.category === 'natural' ? 'primary' : 'ghost'} size='sm'>
						Natural
					</Button>
				</Link>
				<Link href='/dashboard/wines?category=unused'>
					<Button variant={isUnusedTab ? 'primary' : 'ghost'} size='sm'>
						미활용
					</Button>
				</Link>
			</div>

			{isUnusedTab && (
				<p className='text-sm text-gray-500'>
					미활용 와인은 메뉴에 표시되지 않습니다. 다시 사용하려면 수정 화면에서 미활용을 해제하세요.
				</p>
			)}

			{/* 컨벤셔널 타입 탭 */}
			{searchParams.category === 'conventional' && (
				<div className='flex gap-2 flex-wrap'>
					{['Red', 'White', 'Sparkling', 'Champagne'].map((type) => (
						<Link key={type} href={`/dashboard/wines?category=conventional&type=${type}`}>
							<Button
								variant='ghost'
								size='sm'
								className={searchParams.type === type ? 'bg-gray-900 text-white hover:bg-gray-800 hover:text-white' : ''}>
								{type}
							</Button>
						</Link>
					))}
				</div>
			)}

			<WineList
				wines={wines || []}
				sortable={!isUnusedTab}
				emptyMessage={isUnusedTab ? '미활용 와인이 없습니다.' : undefined}
			/>
		</div>
	);
}
