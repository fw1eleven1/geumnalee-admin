import { getAuthHeaders } from '@/lib/auth-utils';
import NotFound from '@/app/not-found';
import TapasDetailForm from './_components/TapasDetailForm';

type TapasType = {
	id: number;
	type: 'main' | 'side';
	name: string;
	price: number;
	img: string;
	desc: string;
};

type TapasMainType = TapasType & {
	type: 'main';
};

type TapasSideType = TapasType & {
	type: 'side';
};

export default async function TapasDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;

	const headers = await getAuthHeaders();

	const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tapas/${id}`, {
		method: 'GET',
		headers,
	});

	const data = (await response.json()) as { success: boolean; data: TapasMainType | TapasSideType };
	if (!data.success) {
		return <NotFound />;
	}
	if (!data.data) {
		return <NotFound />;
	}

	return <TapasDetailForm tapas={data.data} />;
}
