type Props = {
  avgScore: number;
  count: number;
};

export default function ScoreboardStats({ avgScore, count }: Props) {
  return (
    <div className="flex items-stretch gap-px bg-court-line rounded-lg overflow-hidden border border-court-line">
      <StatCell label="Average" value={count ? avgScore.toFixed(1) : '—'} accent="amber" />
      <StatCell label="Reviews" value={String(count)} accent="cyan" />
    </div>
  );
}

function StatCell({ label, value, accent }: { label: string; value: string; accent: 'amber' | 'cyan' }) {
  const accentClass = accent === 'amber' ? 'text-amber' : 'text-cyan';
  return (
    <div className="flex-1 bg-court-panel px-6 py-4 min-w-[7rem]">
      <div className={`font-mono text-3xl md:text-4xl font-medium tabular ${accentClass}`}>{value}</div>
      <div className="mt-1 text-xs uppercase tracking-[0.18em] text-ink-muted">{label}</div>
    </div>
  );
}
