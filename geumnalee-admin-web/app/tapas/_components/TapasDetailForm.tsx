'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface TapasDetailFormProps {
	tapas: TapasMainType | TapasSideType;
}

export default function TapasDetailForm({ tapas }: TapasDetailFormProps) {
	const [saving, setSaving] = useState(false);
	const [editedTapas, setEditedTapas] = useState<TapasMainType | TapasSideType>(tapas);
	const [isDragOver, setIsDragOver] = useState(false);
	const [previewImage, setPreviewImage] = useState<string | null>(null);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [isImageDeleted, setIsImageDeleted] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const router = useRouter();

	const handleInputChange = (field: keyof TapasType, value: string | number) => {
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
			setIsImageDeleted(false); // 새 이미지가 선택되면 삭제 상태 해제
		};
		reader.readAsDataURL(file);
	};

	const handleDeleteImage = () => {
		setPreviewImage(null);
		setSelectedFile(null);
		setIsImageDeleted(true);
		// 기존 이미지도 삭제 상태로 설정
		setEditedTapas({
			...editedTapas,
			img: '',
		});
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
				img: selectedFile ? '' : isImageDeleted ? '' : editedTapas.img, // 새 이미지가 있거나 삭제된 경우 빈 문자열로 설정
			};
			formData.append('data', JSON.stringify(tapasData));

			// 새 이미지가 있으면 추가
			if (selectedFile) {
				formData.append('image', selectedFile);
			}

			// 이미지가 삭제된 경우 삭제 플래그 추가
			if (isImageDeleted) {
				formData.append('deleteImage', 'true');
			}

			const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tapas/${editedTapas.id}`, {
				method: 'PUT',
				body: formData,
				credentials: 'include', // 쿠키 포함
			});

			const data = await response.json();
			if (data.success) {
				toast.success('저장되었어요.');
				router.push(`/tapas`);
				// 저장 성공 후 미리보기 초기화
			} else {
				toast.error('저장에 실패했어요.');
			}
		} catch (error) {
			console.error('Error saving tapas:', error);
			toast.error('저장에 실패했어요.');
		} finally {
			setTimeout(() => {
				setSaving(false);
			}, 1000);
		}
	};

	const handleDelete = async () => {
		setShowDeleteModal(true);
	};

	const confirmDelete = async () => {
		setShowDeleteModal(false);
		setSaving(true);
		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tapas/${editedTapas.id}`, {
				method: 'DELETE',
				credentials: 'include', // 쿠키 포함
			});

			const data = await response.json();
			if (data.success) {
				toast.success('삭제되었어요.');
				router.push(`/tapas`);
			} else {
				toast.error('삭제에 실패했어요.');
			}
		} catch (error) {
			console.error('Error deleting tapas:', error);
			toast.error('삭제에 실패했어요.');
		} finally {
			setTimeout(() => {
				setSaving(false);
			}, 1000);
		}
	};

	// 표시할 이미지 결정 (미리보기 > 기존 이미지)
	const displayImage = previewImage || (isImageDeleted ? null : editedTapas?.img) || null;

	return (
		<div className='min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-2 py-10 lg:p-6 lg:py-20'>
			<div className='max-w-6xl mx-auto'>
				<div className='text-center mb-8'>
					<h1 className='text-4xl font-bold text-gray-100 mb-4'>상세 정보</h1>
					<div className='w-24 h-1 bg-gray-600 mx-auto rounded-full'></div>
				</div>

				<div className='bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-700'>
					{/* 헤더 */}
					<div className='flex items-center justify-between mb-6'>
						<h2 className='text-2xl font-semibold text-gray-200 flex items-center'>
							<span className='w-3 h-3 bg-gray-500 rounded-full mr-3'></span>
							{editedTapas?.type === 'main' ? '메인' : '사이드'}
						</h2>
					</div>

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
										alt={editedTapas.name}
										width={400}
										height={400}
										className='w-full h-full object-cover'
										unoptimized={true}
										onError={(e) => {
											e.currentTarget.src = 'https://geumnalee.pjsk.kr/tapas/empty.png';
										}}
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
									{previewImage && (
										<div className='absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded'>미리보기</div>
									)}
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
										placeholder='타파스 이름을 입력하세요'
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
										value={editedTapas?.type || 'main'}
										onChange={(e) => handleInputChange('type', e.target.value as 'main' | 'side')}
										className='w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-gray-200'>
										<option value='main'>메인</option>
										<option value='side'>사이드</option>
									</select>
								</div>

								<div>
									<label className='block text-sm font-medium text-gray-300 mb-2'>설명</label>
									<textarea
										value={editedTapas?.desc || ''}
										onChange={(e) => handleInputChange('desc', e.target.value)}
										rows={4}
										className='w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-gray-200 placeholder-gray-400 resize-none'
										placeholder='타파스 설명을 입력하세요'
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
					{saving ? '저장 중...' : '저장'}
				</button>
				<button
					onClick={handleDelete}
					disabled={saving}
					className='w-full mt-4 bg-red-600 text-gray-200 px-6 py-2 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 border border-gray-600 hover:scale-105 cursor-pointer'>
					{saving ? '삭제 중...' : '삭제'}
				</button>
			</div>

			{/* 삭제 확인 모달 */}
			{showDeleteModal && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
					<div className='bg-gray-800 rounded-2xl p-6 max-w-md w-full border border-gray-700'>
						<div className='text-center'>
							<div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4'>
								<svg className='h-6 w-6 text-red-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
									/>
								</svg>
							</div>
							<h3 className='text-lg font-medium text-gray-200 mb-2'>타파스 삭제</h3>
							<p className='text-gray-400 mb-6'>
								<strong className='text-gray-200'>{editedTapas?.name}</strong>을(를) 정말로 삭제하시겠습니까?
							</p>
							<div className='flex space-x-3'>
								<button
									onClick={() => setShowDeleteModal(false)}
									className='flex-1 px-4 py-2 bg-gray-600 text-gray-200 rounded-lg hover:bg-gray-500 transition-colors'>
									취소
								</button>
								<button
									onClick={confirmDelete}
									disabled={saving}
									className='flex-1 px-4 py-2 bg-red-600 text-gray-200 rounded-lg hover:bg-red-500 transition-colors disabled:opacity-50'>
									{saving ? '삭제 중...' : '삭제'}
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
