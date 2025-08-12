'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useRouter, useSearchParams } from 'next/navigation';

export default function NewTapasForm() {
	const searchParams = useSearchParams();
	const type = searchParams.get('type');

	const [saving, setSaving] = useState(false);
	const [editedTapas, setEditedTapas] = useState({
		name: '',
		price: 0,
		type: type === 'side' ? 'side' : 'main',
		desc: '',
		img: '',
	});
	const [isDragOver, setIsDragOver] = useState(false);
	const [previewImage, setPreviewImage] = useState<string | null>(null);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const router = useRouter();

	const handleInputChange = (field: keyof typeof editedTapas, value: string | number) => {
		setEditedTapas({
			...editedTapas,
			[field]: value,
		});
	};

	const handleFileSelect = (file: File) => {
		if (!file) return;

		// 파일 타입 검증
		if (!file.type.startsWith('image/')) {
			toast.error('이미지 파일만 업로드 가능합니다.');
			return;
		}

		// 파일 크기 검증 (10MB)
		if (file.size > 10 * 1024 * 1024) {
			toast.error('파일 크기는 10MB 이하여야 합니다.');
			return;
		}

		// 파일을 미리보기용 URL로 변환
		const reader = new FileReader();
		reader.onload = (e) => {
			setPreviewImage(e.target?.result as string);
			setSelectedFile(file);
		};
		reader.readAsDataURL(file);
	};

	const handleDeleteImage = () => {
		setPreviewImage(null);
		setSelectedFile(null);
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(true);
	};

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(false);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(false);

		const files = e.dataTransfer.files;
		if (files.length > 0) {
			handleFileSelect(files[0]);
		}
	};

	const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files.length > 0) {
			handleFileSelect(files[0]);
		}
	};

	const handleSave = async () => {
		setSaving(true);
		try {
			if (editedTapas.name === '') {
				toast.error('이름을 입력해주세요.');
				return;
			}

			if (editedTapas.price === 0) {
				toast.error('가격을 입력해주세요.');
				return;
			}

			if (editedTapas.desc === '') {
				toast.error('설명을 입력해주세요.');
				return;
			}

			// FormData를 사용하여 이미지와 정보를 함께 전송
			const formData = new FormData();

			// 타파스 정보를 JSON으로 추가
			const tapasData = {
				...editedTapas,
				img: '', // 새로 생성하는 경우 빈 문자열
			};
			formData.append('data', JSON.stringify(tapasData));

			// 이미지가 있으면 추가
			if (selectedFile) {
				formData.append('image', selectedFile);
			}

			const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tapas`, {
				method: 'POST',
				body: formData,
				credentials: 'include', // 쿠키 포함
			});

			const data = await response.json();
			if (data.success) {
				const newMenuType = editedTapas.type;
				toast.success('새 메뉴가 추가되었어요.');
				router.push(`/tapas/${newMenuType}`);
			} else {
				toast.error('메뉴 추가에 실패했어요.');
			}
		} catch (error) {
			console.error('Error creating tapas:', error);
			toast.error('메뉴 추가에 실패했어요.');
		} finally {
			setTimeout(() => {
				setSaving(false);
			}, 1000);
		}
	};

	// 표시할 이미지 결정 (미리보기)
	const displayImage = previewImage;

	return (
		<div className='min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-2 py-10 lg:p-6 lg:py-20'>
			<div className='max-w-6xl mx-auto'>
				<div className='text-center mb-8'>
					<h1 className='text-4xl font-bold text-gray-100 mb-4'>새 메뉴 추가</h1>
					<div className='w-24 h-1 bg-gray-600 mx-auto rounded-full'></div>
				</div>

				<div className='bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-700'>
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
						{/* 이미지 섹션 */}
						<div className='space-y-4'>
							{/* 드래그앤드롭 영역 */}
							<div
								onDragOver={handleDragOver}
								onDragLeave={handleDragLeave}
								onDrop={handleDrop}
								onClick={() => fileInputRef.current?.click()}
								className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
									isDragOver ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 hover:border-gray-500'
								}`}>
								<div className='space-y-4'>
									<div className='text-gray-400'>
										<svg className='mx-auto h-12 w-12' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
											/>
										</svg>
									</div>
									<div>
										<p className='text-gray-300 font-medium'>이미지를 드래그하거나 클릭하여 업로드</p>
										<p className='text-gray-400 text-sm mt-1'>PNG, JPG, GIF 최대 10MB</p>
									</div>
									<button
										onClick={(e) => {
											e.stopPropagation();
											fileInputRef.current?.click();
										}}
										className='bg-gray-700 hover:bg-gray-600 text-gray-200 px-4 py-2 rounded-lg transition-colors'>
										파일 선택
									</button>
									<input ref={fileInputRef} type='file' accept='image/*' onChange={handleFileInputChange} className='hidden' />
								</div>
							</div>

							{/* 이미지 미리보기 */}
							{displayImage && (
								<div className='aspect-square bg-gray-700 rounded-lg overflow-hidden border border-gray-600 relative'>
									<Image
										src={displayImage}
										alt={editedTapas.name || '새 메뉴'}
										width={400}
										height={400}
										className='w-full h-full object-cover'
										unoptimized={true}
									/>
									{/* 삭제 버튼 */}
									<button
										onClick={handleDeleteImage}
										className='absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-lg'
										title='이미지 삭제'>
										<svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
											<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
										</svg>
									</button>
									<div className='absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded'>미리보기</div>
								</div>
							)}
						</div>

						{/* 정보 섹션 */}
						<div className='space-y-6'>
							{/* 기본 정보 */}
							<div className='space-y-4'>
								<div>
									<label className='block text-sm font-medium text-gray-300 mb-2'>이름</label>
									<input
										type='text'
										value={editedTapas?.name || ''}
										onChange={(e) => handleInputChange('name', e.target.value)}
										className='w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-gray-200 placeholder-gray-400'
										placeholder='메뉴 이름을 입력하세요'
									/>
								</div>

								<div>
									<label className='block text-sm font-medium text-gray-300 mb-2'>가격 (원)</label>
									<input
										type='number'
										value={editedTapas?.price || ''}
										onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
										className='w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-gray-200 placeholder-gray-400'
										placeholder='가격을 입력하세요'
									/>
								</div>

								<div>
									<label className='block text-sm font-medium text-gray-300 mb-2'>타입</label>
									<select
										value={editedTapas?.type}
										onChange={(e) => handleInputChange('type', e.target.value as 'main' | 'side')}
										className='w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-gray-200'>
										<option value='main' defaultChecked={type === 'main'}>
											메인
										</option>
										<option value='side' defaultChecked={type === 'side'}>
											사이드
										</option>
									</select>
								</div>

								<div>
									<label className='block text-sm font-medium text-gray-300 mb-2'>설명</label>
									<textarea
										value={editedTapas?.desc || ''}
										onChange={(e) => handleInputChange('desc', e.target.value)}
										rows={4}
										className='w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-gray-200 placeholder-gray-400 resize-none'
										placeholder='메뉴 설명을 입력하세요'
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
				<button
					onClick={handleSave}
					disabled={saving}
					className='w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-gray-200 px-6 py-2 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 border border-gray-600 hover:scale-105 cursor-pointer'>
					{saving ? '추가 중...' : '메뉴 추가'}
				</button>
			</div>
		</div>
	);
}
