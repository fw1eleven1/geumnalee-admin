'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { clsx } from 'clsx';
import { useState } from 'react';

interface SubMenuItem {
	name: string;
	href: string;
	category: string;
}

interface NavItem {
	name: string;
	href: string;
	icon: React.ComponentType<{ className?: string }>;
	submenu?: SubMenuItem[];
}

const navigation: NavItem[] = [
	{ name: '대시보드', href: '/dashboard', icon: HomeIcon },
	{
		name: '와인 관리',
		href: '/dashboard/wines',
		icon: WineIcon,
		submenu: [
			{ name: 'Conventional', href: '/dashboard/wines?category=conventional&type=Red', category: 'conventional' },
			{ name: 'Natural', href: '/dashboard/wines?category=natural', category: 'natural' },
		],
	},
	{
		name: '타파스 관리',
		href: '/dashboard/tapas',
		icon: FoodIcon,
		submenu: [
			{ name: '메인', href: '/dashboard/tapas?category=main', category: 'main' },
			{ name: '사이드', href: '/dashboard/tapas?category=side', category: 'side' },
		],
	},
	{ name: '재고 관리', href: '/dashboard/inventory', icon: InventoryIcon },
];

function HomeIcon({ className }: { className?: string }) {
	return (
		<svg className={className} fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor'>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				d='M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25'
			/>
		</svg>
	);
}

function WineIcon({ className }: { className?: string }) {
	return (
		<svg className={className} fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor'>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				d='M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611l-2.819.47a18.13 18.13 0 01-6.633 0l-2.819-.47c-1.717-.293-2.299-2.379-1.067-3.61L5 14.5'
			/>
		</svg>
	);
}

function FoodIcon({ className }: { className?: string }) {
	return (
		<svg className={className} fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor'>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				d='M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.379a48.474 48.474 0 00-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M12.265 3.11a.375.375 0 11-.53 0L12 2.845l.265.265zm-3 0a.375.375 0 11-.53 0L9 2.845l.265.265zm6 0a.375.375 0 11-.53 0L15 2.845l.265.265z'
			/>
		</svg>
	);
}

function InventoryIcon({ className }: { className?: string }) {
	return (
		<svg className={className} fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor'>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				d='M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z'
			/>
		</svg>
	);
}

function ChevronIcon({ className, isOpen }: { className?: string; isOpen: boolean }) {
	return (
		<svg
			className={clsx(className, 'transition-transform duration-200', isOpen && 'rotate-180')}
			fill='none'
			viewBox='0 0 24 24'
			strokeWidth={2}
			stroke='currentColor'>
			<path strokeLinecap='round' strokeLinejoin='round' d='M19 9l-7 7-7-7' />
		</svg>
	);
}

interface SidebarProps {
	isOpen?: boolean;
	onClose?: () => void;
}

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const currentCategory = searchParams.get('category');
	const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

	const handleLinkClick = () => {
		if (onClose) {
			onClose();
		}
	};

	const toggleSubmenu = (menuName: string) => {
		setExpandedMenu(expandedMenu === menuName ? null : menuName);
	};

	const isSubMenuActive = (item: NavItem) => {
		if (!item.submenu) return false;
		return item.submenu.some((sub) => sub.category === currentCategory && pathname.startsWith(item.href.split('?')[0]));
	};

	return (
		<>
			{/* 모바일 오버레이 */}
			{isOpen && <div className='fixed inset-0 z-40 bg-black/50 lg:hidden' onClick={onClose} />}

			{/* 사이드바 */}
			<div
				className={clsx(
					'fixed inset-y-0 left-0 z-50 flex h-full w-64 flex-col bg-gray-900 transition-transform duration-300 lg:static lg:translate-x-0',
					isOpen ? 'translate-x-0' : '-translate-x-full',
				)}>
				<div className='flex h-16 shrink-0 items-center justify-between px-6'>
					<span className='text-xl font-bold text-white'>금나리</span>
					{/* 모바일 닫기 버튼 */}
					<button onClick={onClose} className='rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-white lg:hidden'>
						<svg className='h-5 w-5' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor'>
							<path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
						</svg>
					</button>
				</div>
				<nav className='flex flex-1 flex-col px-4 py-4'>
					<ul className='space-y-1'>
						{navigation.map((item) => {
							const basePath = item.href.split('?')[0];
							const isActive = pathname.startsWith(basePath);
							const hasSubmenu = Boolean(item.submenu && item.submenu.length > 0);
							const isExpanded = expandedMenu === item.name || (isActive && hasSubmenu);

							return (
								<li key={item.name}>
									{hasSubmenu ? (
										<button
											onClick={() => toggleSubmenu(item.name)}
											className={clsx(
												'group flex w-full items-center justify-between gap-x-3 rounded-md p-3 text-sm font-medium',
												isActive ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white',
											)}>
											<span className='flex items-center gap-x-3'>
												<item.icon className='h-5 w-5 shrink-0' />
												{item.name}
											</span>
											<ChevronIcon className='h-4 w-4' isOpen={isExpanded} />
										</button>
									) : (
										<Link
											href={item.href}
											onClick={handleLinkClick}
											className={clsx(
												'group flex items-center justify-between gap-x-3 rounded-md p-3 text-sm font-medium',
												isActive ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white',
											)}>
											<span className='flex items-center gap-x-3'>
												<item.icon className='h-5 w-5 shrink-0' />
												{item.name}
											</span>
										</Link>
									)}

									{/* 서브메뉴 */}
									{hasSubmenu && isExpanded && (
										<ul className='mt-1 space-y-1 pl-4'>
											{item.submenu!.map((subItem) => {
												const isSubActive = currentCategory === subItem.category && pathname.startsWith(basePath);
												return (
													<li key={subItem.name}>
														<Link
															href={subItem.href}
															onClick={handleLinkClick}
															className={clsx(
																'block rounded-md py-2 pl-6 pr-3 text-sm',
																isSubActive ? 'bg-gray-700 text-white font-medium' : 'text-gray-400 hover:bg-gray-700 hover:text-white',
															)}>
															{subItem.name}
														</Link>
													</li>
												);
											})}
										</ul>
									)}
								</li>
							);
						})}
					</ul>
				</nav>
			</div>
		</>
	);
}
