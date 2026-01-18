'use client';

interface RatingInputProps {
  label: string;
  value: number;
  maxValue: number;
  onChange: (value: number) => void;
}

export default function RatingInput({ label, value, maxValue, onChange }: RatingInputProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
      <span className="text-sm font-medium text-gray-700 sm:w-12">{label}</span>
      <div className="flex gap-2 sm:gap-1">
        {Array.from({ length: maxValue }, (_, i) => i + 1).map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating === value ? 0 : rating)}
            className={`w-10 h-10 sm:w-8 sm:h-8 rounded-full border-2 text-sm font-medium transition-colors ${
              rating <= value
                ? 'bg-gray-900 border-gray-900 text-white'
                : 'bg-white border-gray-300 text-gray-400 hover:border-gray-400'
            }`}
          >
            {rating}
          </button>
        ))}
      </div>
      <span className="text-sm text-gray-500">{value}/{maxValue}</span>
    </div>
  );
}
