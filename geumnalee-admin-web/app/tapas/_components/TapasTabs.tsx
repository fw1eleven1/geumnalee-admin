'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function TapasTabs() {
	const pathname = usePathname();
	const isMainActive = pathname === '/tapas/main';
	const isSideActive = pathname === '/tapas/side';

	return (
		<div className='flex justify-center mb-8'>
			<div className='flex justify-center items-center bg-gray-800 rounded-xl p-1 border border-gray-700'>
				<Link
					href='/tapas/main'
					className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
						isMainActive
							? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
							: 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
					}`}>
					메인
				</Link>
				<Link
					href='/tapas/side'
					className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
						isSideActive
							? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
							: 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
					}`}>
					사이드
				</Link>
			</div>
		</div>
	);
}
