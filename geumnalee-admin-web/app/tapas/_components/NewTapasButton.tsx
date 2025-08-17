'use client';

import { useRouter } from 'next/navigation';

export default function NewTapasButton({ type }: { type: 'main' | 'side' }) {
	const router = useRouter();

	return (
		<>
			{/* 데스크톱 버전 - 기존 스타일 */}
			<button
				onClick={() => router.push(`/tapas/new?type=${type}`)}
				className='hidden md:block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer transition-colors duration-200'>
				새 메뉴 추가
			</button>

			{/* 모바일 버전 - Floating + 버튼 */}
			<button
				onClick={() => router.push(`/tapas/new?type=${type}`)}
				className='md:hidden fixed bottom-6 right-6 w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg cursor-pointer transition-all duration-200 z-50 flex flex-col items-center justify-center text-2xl font-bold hover:scale-110'>
				<p>+</p>
			</button>
		</>
	);
}
