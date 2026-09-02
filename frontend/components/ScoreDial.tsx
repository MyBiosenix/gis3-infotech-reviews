type ScoreDialProps = {
  score: number;
  size?: 'sm' | 'lg';
};

// Renders a score like a stadium scoreboard digit tile.
// Color shifts from cyan (low) through amber (mid) to a hot amber (high)
// so the tile itself communicates the verdict at a glance.
// Ratings across the app are on a 1-5 scale, so thresholds are scaled to match.
export default function ScoreDial({ score, size = 'sm' }: ScoreDialProps) {
  const rounded = Math.round(score * 10) / 10;
  const tone = rounded >= 3.75 ? 'text-amber border-amber/40' : rounded >= 2.25 ? 'text-cyan border-cyan/40' : 'text-ink-muted border-court-line';

  const dims = size === 'lg' ? 'w-24 h-24 text-5xl' : 'w-14 h-14 text-2xl';

  return (
    <div
      className={`shrink-0 ${dims} rounded-md bg-court border ${tone} flex items-center justify-center font-mono font-medium tabular shadow-[inset_0_0_12px_rgba(0,0,0,0.5)]`}
      aria-label={`Score ${rounded} out of 5`}
    >
      {rounded.toFixed(1)}
    </div>
  );
}
