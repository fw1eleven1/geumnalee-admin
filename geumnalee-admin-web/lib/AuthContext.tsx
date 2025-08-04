'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
	isAuthenticated: boolean;
	setIsAuthenticated: (isAuthenticated: boolean) => void;
	login: (password: string) => Promise<boolean>;
	logout: () => void;
	verifyToken: (token: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export function AuthProvider({ children }: { children: ReactNode }) {
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		// 페이지 로드 시 토큰 확인
		checkAuthStatus();
	}, []);

	const checkAuthStatus = async () => {
		try {
			const response = await fetch(`${API_BASE_URL}/api/auth/status`, {
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
			console.error('Auth status check error:', error);
			setIsAuthenticated(false);
		}
	};

	const verifyToken = async (token: string): Promise<boolean> => {
		try {
			const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ token }),
			});

			const data = await response.json();

			if (data.success && data.valid) {
				setIsAuthenticated(true);
				return true;
			} else {
				return false;
			}
		} catch (error) {
			console.error('Token verification error:', error);
			return false;
		}
	};

	const login = async (password: string): Promise<boolean> => {
		try {
			const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ password }),
				credentials: 'include', // 쿠키 포함
			});

			const data = await response.json();

			if (data.success) {
				setIsAuthenticated(true);
				return true;
			} else {
				return false;
			}
		} catch (error) {
			console.error('Login error:', error);
			return false;
		}
	};

	const logout = async () => {
		try {
			await fetch(`${API_BASE_URL}/api/auth/logout`, {
				method: 'POST',
				credentials: 'include', // 쿠키 포함
			});
		} catch (error) {
			console.error('Logout error:', error);
		} finally {
			setIsAuthenticated(false);
		}
	};

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated,
				setIsAuthenticated,
				login,
				logout,
				verifyToken,
			}}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
}
