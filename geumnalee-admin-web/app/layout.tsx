import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/common/Header';
import { AuthProvider } from '@/lib/AuthContext';
import AuthGuard from '@/lib/AuthGuard';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'GEUMNALEE ADMIN',
	description: '금나리 메뉴 관리 페이지',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='ko'>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<AuthProvider>
					<AuthGuard>
						<div className='min-h-screen h-full flex flex-col'>
							<Header />
							<div className='flex-1 flex flex-col lg:max-w-5xl lg:min-w-[800px] w-full h-full mx-auto px-4'>{children}</div>
						</div>
					</AuthGuard>
				</AuthProvider>
			</body>
		</html>
	);
}
