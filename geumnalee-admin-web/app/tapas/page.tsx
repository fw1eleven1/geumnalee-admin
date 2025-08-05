import { getAuthHeaders } from '@/lib/auth-utils';
import TapasList from './_components/TapasList';

interface ApiResponse<T> {
	data: T[];
	success: boolean;
	message?: string;
}

// API fetch 함수들
async function fetchTapasData(endpoint: string, headers: HeadersInit) {
	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tapas/${endpoint}`, {
			method: 'GET',
			headers,
		});

		if (!response.ok) {
			throw new Error(`API 요청 실패: ${response.status} ${response.statusText}`);
		}

		return await response.json();
	} catch (error) {
		console.error(`Tapas ${endpoint} 데이터 fetch 오류:`, error);
		throw error;
	}
}

export default async function TapasPage() {
	const headers = await getAuthHeaders();

	// 병렬로 데이터 fetch
	const [mainResponse, sideResponse] = await Promise.all([
		fetchTapasData('main', headers),
		fetchTapasData('side', headers),
	]);

	const main = mainResponse as ApiResponse<TapasMainType>;
	const side = sideResponse as ApiResponse<TapasSideType>;

	return (
		<div className='min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6'>
			<div className='max-w-6xl mx-auto'>
				<div className='text-center mb-12'>
					<h1 className='text-5xl font-bold text-gray-100 mb-4'>TAPAS</h1>
					<div className='w-24 h-1 bg-gray-600 mx-auto rounded-full'></div>
				</div>

				<div className='grid grid-cols-1 gap-8'>
					<div className='bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-700'>
						<h2 className='text-2xl font-semibold text-gray-200 mb-6 flex items-center'>
							<span className='w-3 h-3 bg-gray-500 rounded-full mr-3'></span>
							메인
						</h2>
						<div className='space-y-3'>
							{main.data && main.data.length > 0 ? (
								main.data.map((item: TapasMainType) => <TapasList key={item.id} item={item} />)
							) : (
								<div className='text-center py-8 text-gray-400'>등록된 TAPAS가 없습니다.</div>
							)}
						</div>
					</div>

					<div className='bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-700'>
						<h2 className='text-2xl font-semibold text-gray-200 mb-6 flex items-center'>
							<span className='w-3 h-3 bg-gray-500 rounded-full mr-3'></span>
							사이드
						</h2>
						<div className='space-y-3'>
							{side.data && side.data.length > 0 ? (
								side.data.map((item: TapasSideType) => <TapasList key={item.id} item={item} />)
							) : (
								<div className='text-center py-8 text-gray-400'>등록된 TAPAS가 없습니다.</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
