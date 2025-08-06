import { cookies } from 'next/headers';

export async function getAuthToken(): Promise<string | null> {
	const cookieStore = await cookies();
	const token = cookieStore.get('auth-token');
	return token?.value || null;
}

export async function getAuthHeaders(): Promise<Record<string, string> | null> {
	const token = await getAuthToken();

	// 토큰이 없으면 null 반환
	if (!token) {
		return null;
	}

	return {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	};
}
