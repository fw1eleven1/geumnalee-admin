import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui';
import WineList from './WineList';

interface SearchParams {
	category?: 'conventional' | 'natural';
	type?: string;
}

export default async function WinesPage({ searchParams }: { searchParams: SearchParams }) {
	const supabase = createClient();

	let query = supabase
		.from('wines')
		.select('*, ratings:wine_ratings(*)')
		.order('category', { ascending: true })
		.order('type', { ascending: true })
		.order('display_order', { ascending: true });

	if (searchParams.category) {
		query = query.eq('category', searchParams.category);
	}
	if (searchParams.type) {
		query = query.eq('type', searchParams.type);
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
			</div>

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

			<WineList wines={wines || []} />
		</div>
	);
}
