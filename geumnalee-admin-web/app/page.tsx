'use client';

import { useAuth } from '@/lib/AuthContext';

export default function Home() {
	const { isAuthenticated } = useAuth();

	return (
		<div className='min-h-screen h-full w-full'>
			<h1 className='text-2xl font-bold mb-4'>관리자 대시보드</h1>
			{isAuthenticated && (
				<div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded'>
					✅ 인증되었습니다! 관리자 페이지에 접근할 수 있습니다.
				</div>
			)}
		</div>
	);
}
