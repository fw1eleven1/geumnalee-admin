import { TapasForm } from '@/components/tapas';

export default function NewTapasPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">새 타파스 추가</h1>
        <p className="mt-1 text-sm text-gray-600">
          새로운 타파스 정보를 입력하세요.
        </p>
      </div>

      <TapasForm mode="create" />
    </div>
  );
}
