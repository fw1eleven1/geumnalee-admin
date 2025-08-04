'use client';

import React from 'react';
import { useAuth } from '../../lib/AuthContext';
import LoginModal from './LoginModal';

interface ProtectedContentProps {
	children: React.ReactNode;
}

export default function ProtectedContent({ children }: ProtectedContentProps) {
	const { isAuthenticated } = useAuth();

	return false;

	if (!isAuthenticated) {
		return <LoginModal />;
	}

	return <>{children}</>;
}
