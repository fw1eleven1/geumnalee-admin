'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';

export default function Header() {
	const { logout } = useAuth();

	return (
		<header className='flex items-center justify-between px-4 py-4 w-full max-w-5xl mx-auto'>
			<div>GEUMNALEE</div>
			<div className='flex items-center gap-4'>
				<Link href='/tapas' className='hover:underline-offset-4 hover:underline hover:text-blue-500'>
					TAPAS
				</Link>
				<Link href='/wine' className='hover:underline-offset-4 hover:underline hover:text-blue-500'>
					WINE
				</Link>
				<button
					onClick={logout}
					className='px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors'>
					로그아웃
				</button>
			</div>
		</header>
	);
}
