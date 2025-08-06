'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TapasPage() {
	const router = useRouter();

	useEffect(() => {
		// 기본 페이지에서 메인 페이지로 리다이렉트
		router.replace('/tapas/main');
	}, [router]);

	// 리다이렉트 중 로딩 화면
	return (
		<div className='min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center'>
			<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
		</div>
	);
}
