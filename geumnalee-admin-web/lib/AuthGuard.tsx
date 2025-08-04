'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from './AuthContext';
import LoginModal from '../components/auth/LoginModal';

interface AuthGuardProps {
	children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
	const { isAuthenticated, setIsAuthenticated } = useAuth();
	const pathname = usePathname();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/status`, {
					method: 'GET',
					credentials: 'include', // 쿠키 포함
				});

				const data = await response.json();

				if (data.success && data.authenticated) {
					setIsAuthenticated(true);
				} else {
					setIsAuthenticated(false);
				}
			} catch (error) {
				console.error('Auth check error:', error);
				setIsAuthenticated(false);
			} finally {
				setIsLoading(false);
			}
		};

		checkAuth();
	}, [pathname, setIsAuthenticated]); // pathname이 변경될 때마다 인증 검사

	// 로딩 중일 때 로딩 이미지 표시
	if (isLoading) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900'></div>
			</div>
		);
	}

	// 인증되지 않은 경우 로그인 모달만 표시
	if (!isAuthenticated) {
		return <LoginModal />;
	}

	// 인증된 경우 자식 컴포넌트 렌더링
	return <>{children}</>;
}
