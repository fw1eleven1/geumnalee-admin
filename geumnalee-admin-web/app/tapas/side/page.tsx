'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import TapasList from '../_components/TapasList';
import TapasTabs from '../_components/TapasTabs';
import NewTapasButton from '../_components/NewTapasButton';
import SortableTapasList from '../_components/SortableTapasList';

export default function TapasSidePage() {
	const [sideData, setSideData] = useState<TapasSideType[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isSortMode, setIsSortMode] = useState(false);
	const [sortedData, setSortedData] = useState<TapasSideType[]>([]);
	const { isAuthenticated } = useAuth();

	// API fetch 함수
	const fetchSideData = async () => {
		try {
			setLoading(true);
			setError(null);

			const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tapas/side`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
			});

			if (!response.ok) {
				throw new Error(`API 요청 실패: ${response.status} ${response.statusText}`);
			}

			const data = await response.json();
			setSideData(data.data || []);
		} catch (error) {
			console.error('사이드 타파스 데이터 fetch 오류:', error);
			setError('데이터를 불러오는 중 오류가 발생했습니다.');
		} finally {
			setLoading(false);
		}
	};

	// 순서 변경 API 함수
	const updateOrder = async (newOrder: TapasSideType[]) => {
		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tapas/side/order`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({ order: newOrder.map((item) => item.id) }),
			});

			if (!response.ok) {
				throw new Error(`순서 변경 실패: ${response.status} ${response.statusText}`);
			}

			// 성공 시 로컬 상태 업데이트
			setSideData(newOrder);
			setIsSortMode(false);
		} catch (error) {
			console.error('순서 변경 오류:', error);
			setError('순서 변경 중 오류가 발생했습니다.');
		}
	};

	// 순서 변경 모드 토글 함수
	const toggleSortMode = () => {
		if (isSortMode) {
			// 순서 변경 완료 버튼 클릭 시 변경사항 저장
			updateOrder(sortedData);
		} else {
			// 순서 변경 모드 진입
			setSortedData([...sideData]);
			setIsSortMode(true);
		}
	};

	// 드래그 앤 드롭으로 순서가 변경될 때 호출
	const handleOrderChange = (newOrder: TapasSideType[]) => {
		setSortedData(newOrder);
	};

	// 초기 데이터 로드
	useEffect(() => {
		if (isAuthenticated) {
			fetchSideData();
		}
	}, [isAuthenticated]);

	// 인증되지 않은 경우 로딩 표시
	if (!isAuthenticated) {
		return (
			<div className='min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center'>
				<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-2 py-10 lg:p-6 lg:py-20'>
			<div className='max-w-6xl mx-auto'>
				<div className='text-center mb-12'>
					<h1 className='text-5xl font-bold text-gray-100 mb-4'>TAPAS</h1>
					<div className='w-24 h-1 bg-gray-600 mx-auto rounded-full'></div>
				</div>

				{/* 탭 네비게이션 */}
				<TapasTabs />

				{/* 에러 메시지 */}
				{error && (
					<div className='bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6 text-center'>
						<p className='text-red-400'>{error}</p>
					</div>
				)}

				{/* 컨텐츠 영역 */}
				<div className='bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-700'>
					{/* 탭 헤더 */}
					<div className='flex justify-between items-center mb-6'>
						<h2 className='text-2xl font-semibold text-gray-200 flex items-center'>
							<span className='w-3 h-3 bg-gray-500 rounded-full mr-3'></span>
							사이드
						</h2>
						<div className='flex items-center gap-3'>
							{/* 순서 변경 버튼 */}
							<button
								onClick={toggleSortMode}
								className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
									isSortMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-600 hover:bg-gray-700 text-gray-200'
								}`}>
								{isSortMode ? '순서 변경 완료' : '순서 변경'}
							</button>
							<NewTapasButton type='side' />
						</div>
					</div>

					{/* 순서 변경 모드 안내 */}
					{isSortMode && (
						<div className='bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 mb-6 text-center'>
							<p className='text-blue-400'>
								💡 메뉴를 드래그하여 순서를 변경할 수 있습니다. 변경이 완료되면 "순서 변경 완료" 버튼을 클릭하세요.
							</p>
						</div>
					)}

					{/* 로딩 상태 */}
					{loading && (
						<div className='flex justify-center items-center py-12'>
							<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
							<span className='ml-3 text-gray-400'>데이터를 불러오는 중...</span>
						</div>
					)}

					{/* 데이터 표시 */}
					{!loading && (
						<div className='space-y-3'>
							{sideData && sideData.length > 0 ? (
								isSortMode ? (
									<SortableTapasList items={sortedData} onSave={handleOrderChange} onCancel={() => setIsSortMode(false)} />
								) : (
									sideData.map((item: TapasSideType) => <TapasList key={item.id} item={item} />)
								)
							) : (
								<div className='text-center py-8 text-gray-400'>등록된 사이드 TAPAS가 없습니다.</div>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
