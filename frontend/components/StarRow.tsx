import { Star } from 'lucide-react';

export default function StarRow({
  filled,
  total = 5,
  color = '#F5A623',
  size = 14,
}: {
  filled: number;
  total?: number;
  color?: string;
  size?: number;
}) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${filled} out of ${total} stars`}>
      {Array.from({ length: total }, (_, i) => (
        <Star
          key={i}
          size={size}
          color={color}
          fill={i < filled ? color : 'none'}
          strokeWidth={i < filled ? 0 : 1.5}
        />
      ))}
    </div>
  );
}
