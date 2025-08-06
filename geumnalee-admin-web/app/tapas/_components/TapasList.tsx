import Image from 'next/image';
import Link from 'next/link';

export default function TapasList({ item }: { item: TapasMainType | TapasSideType }) {
	return (
		<Link
			href={`/tapas/${item.id}`}
			key={item.id}
			className='block bg-gradient-to-r from-gray-700 to-gray-600 p-4 rounded-xl border border-gray-600 hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer group'>
			<div className='flex items-center gap-4'>
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
					<span className='text-base md:text-lg font-medium text-gray-200 tracking-tighter md:tracking-normal group-hover:text-gray-100 transition-colors'>
						{item.name}
					</span>
					<span className='text-sm text-gray-400'>{item.price.toLocaleString()}원</span>
				</div>
			</div>
		</Link>
	);
}
