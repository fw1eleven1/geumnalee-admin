/**
 * menu 앱의 캐시를 갱신하는 유틸리티
 */

const MENU_APP_URL = process.env.MENU_APP_URL || 'http://localhost:3002';
const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET;

export async function revalidateMenuPages(paths?: string[]) {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (REVALIDATE_SECRET) {
      headers['x-revalidate-secret'] = REVALIDATE_SECRET;
    }

    const body = paths ? { path: paths[0] } : {};

    const response = await fetch(`${MENU_APP_URL}/api/revalidate`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error('Failed to revalidate menu pages:', await response.text());
    }
  } catch (error) {
    // menu 앱이 실행 중이 아닐 수 있으므로 에러 무시
    console.error('Failed to revalidate menu pages:', error);
  }
}

export async function revalidateWinePages() {
  return revalidateMenuPages(['/wines/conventional', '/wines/natural']);
}

export async function revalidateTapasPages() {
  return revalidateMenuPages(['/tapas']);
}
