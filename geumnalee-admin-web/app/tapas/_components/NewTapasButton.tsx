'use client';

import { useRouter } from 'next/navigation';

export default function NewTapasButton({ type }: { type: 'main' | 'side' }) {
	const router = useRouter();

	return (
		<>
			<button
				onClick={() => router.push(`/tapas/new?type=${type}`)}
				className='bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer'>
				새 메뉴 추가
			</button>
		</>
	);
}
