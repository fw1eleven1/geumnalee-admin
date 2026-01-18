'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Button from './Button';

interface ConfirmModalProps {
	isOpen: boolean;
	title: string;
	message: string;
	confirmText?: string;
	cancelText?: string;
	onConfirm: () => void;
	onCancel: () => void;
	isLoading?: boolean;
}

export default function ConfirmModal({
	isOpen,
	title,
	message,
	confirmText = '삭제',
	cancelText = '취소',
	onConfirm,
	onCancel,
	isLoading = false,
}: ConfirmModalProps) {
	const modalRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}

		return () => {
			document.body.style.overflow = '';
		};
	}, [isOpen]);

	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && isOpen && !isLoading) {
				onCancel();
			}
		};

		document.addEventListener('keydown', handleEscape);
		return () => document.removeEventListener('keydown', handleEscape);
	}, [isOpen, isLoading, onCancel]);

	if (!isOpen) return null;

	const handleBackdropClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget && !isLoading) {
			onCancel();
		}
	};

	return createPortal(
		<div
			className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'
			onClick={handleBackdropClick}>
			<div
				ref={modalRef}
				className='w-full max-w-sm bg-white rounded-lg shadow-xl'
				role='dialog'
				aria-modal='true'
				aria-labelledby='modal-title'>
				<div className='p-6'>
					<h2 id='modal-title' className='text-lg font-semibold text-gray-900'>
						{title}
					</h2>
					<p className='mt-2 text-sm text-gray-600'>{message}</p>
				</div>
				<div className='flex justify-end gap-2 px-6 pb-6'>
					<Button variant='ghost' size='sm' onClick={onCancel} disabled={isLoading}>
						{cancelText}
					</Button>
					<Button variant='danger' size='sm' onClick={onConfirm} disabled={isLoading}>
						{isLoading ? '삭제 중...' : confirmText}
					</Button>
				</div>
			</div>
		</div>,
		document.body
	);
}
