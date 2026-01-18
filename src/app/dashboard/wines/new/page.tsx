import { WineForm } from '@/components/wines';

export default function NewWinePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">새 와인 추가</h1>
        <p className="mt-1 text-sm text-gray-600">
          새로운 와인 정보를 입력하세요.
        </p>
      </div>

      <WineForm mode="create" />
    </div>
  );
}
