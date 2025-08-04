'use client';

import React, { useState } from 'react';
import { useAuth } from '../../lib/AuthContext';

export default function LoginModal() {
	const { login } = useAuth();
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setIsLoading(true);

		try {
			const success = await login(password);
			if (!success) {
				setError('비밀번호가 올바르지 않습니다.');
			}
		} catch (error) {
			console.error('Login error:', error);
			setError('서버 연결 오류가 발생했습니다.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
			<div className='bg-white rounded-lg p-8 w-full max-w-md mx-4'>
				<div className='text-center mb-6'>
					<h2 className='text-2xl font-bold text-gray-900 mb-2'>관리자 로그인</h2>
					<p className='text-gray-600'>비밀번호를 입력해주세요</p>
				</div>

				<form onSubmit={handleSubmit} className='space-y-4'>
					<div>
						<label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-2'>
							비밀번호
						</label>
						<input
							type='password'
							id='password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className='w-full px-3 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
							placeholder='비밀번호를 입력하세요'
							required
							disabled={isLoading}
						/>
					</div>

					{error && <div className='text-red-600 text-sm text-center'>{error}</div>}

					<button
						type='submit'
						disabled={isLoading || !password}
						className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'>
						{isLoading ? '로그인 중...' : '로그인'}
					</button>
				</form>

				<div className='mt-4 text-center'>
					<p className='text-xs text-gray-500'>* 이 페이지는 관리자만 접근할 수 있습니다.</p>
				</div>
			</div>
		</div>
	);
}
