import { cookies } from 'next/headers';

export async function getAuthToken(): Promise<string | null> {
	const cookieStore = await cookies();
	const token = cookieStore.get('auth-token');
	return token?.value || null;
}

export async function getAuthHeaders(): Promise<Record<string, string>> {
	const token = await getAuthToken();
	return {
		'Content-Type': 'application/json',
		...(token && { Authorization: `Bearer ${token}` }),
	};
}
