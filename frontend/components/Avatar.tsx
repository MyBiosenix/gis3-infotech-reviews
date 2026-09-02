const PALETTE = [
  '#F97362', // coral
  '#F5A623', // amber
  '#4FB4D6', // sky
  '#5FC79E', // mint
  '#9B8BF4', // violet
  '#F471B5', // pink
  '#6BA6E8', // blue
  '#E0A458', // tan
];

function colorFor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

function initialsFor(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] || '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

export default function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-semibold text-white"
      style={{ width: size, height: size, background: colorFor(name), fontSize: size * 0.38 }}
      aria-hidden="true"
    >
      {initialsFor(name)}
    </div>
  );
}
