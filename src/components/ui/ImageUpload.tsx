'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui';

interface ImageUploadProps {
	currentImage: string | null;
	onUpload: (url: string) => void;
	folder: string;
}

export default function ImageUpload({ currentImage, onUpload, folder }: ImageUploadProps) {
	const [uploading, setUploading] = useState(false);
	const [preview, setPreview] = useState<string | null>(currentImage);
	const [error, setError] = useState('');
	const inputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// 파일 크기 체크
		if (file.size > 5 * 1024 * 1024) {
			setError('파일 크기는 5MB 이하여야 합니다.');
			return;
		}

		// 파일 타입 체크
		if (!file.type.startsWith('image/')) {
			setError('이미지 파일만 업로드할 수 있습니다.');
			return;
		}

		setError('');

		// 미리보기
		const reader = new FileReader();
		reader.onload = (e) => setPreview(e.target?.result as string);
		reader.readAsDataURL(file);

		// 업로드
		setUploading(true);
		try {
			const formData = new FormData();
			formData.append('file', file);
			formData.append('folder', folder);

			const response = await fetch('/api/upload', {
				method: 'POST',
				body: formData,
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Upload failed');
			}

			const { url } = await response.json();
			onUpload(url);
		} catch (err) {
			console.error('Upload error:', err);
			setError('이미지 업로드에 실패했습니다.');
			setPreview(currentImage);
		} finally {
			setUploading(false);
		}
	};

	const handleRemove = () => {
		setPreview(null);
		onUpload('');
		if (inputRef.current) {
			inputRef.current.value = '';
		}
	};

	return (
		<div className='space-y-4'>
			{preview && (
				<div>
					<div className='relative inline-block'>
						<div className='relative w-32 h-40 border rounded-md overflow-hidden bg-gray-50'>
							<Image src={preview} alt='Preview' fill className='object-contain' unoptimized />
						</div>
						<button
							type='button'
							onClick={handleRemove}
							className='absolute -top-3 -right-3 w-8 h-8 sm:w-7 sm:h-7 bg-red-500 text-white rounded-full text-base sm:text-sm font-medium hover:bg-red-600 flex items-center justify-center shadow-md'>
							×
						</button>
					</div>
				</div>
			)}

			{error && <p className='text-sm text-red-600'>{error}</p>}

			<input ref={inputRef} type='file' accept='image/*' onChange={handleFileChange} className='hidden' />

			<Button type='button' variant='secondary' onClick={() => inputRef.current?.click()} disabled={uploading}>
				{uploading ? '업로드 중...' : preview ? '이미지 변경' : '이미지 업로드'}
			</Button>
		</div>
	);
}
