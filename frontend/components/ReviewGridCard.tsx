import {
  ArrowRight,
  BriefcaseBusiness,
} from 'lucide-react';

import Avatar from './Avatar';
import StarRow from './StarRow';

import {
  normalizeFiveStarRating,
  type Review,
} from '@/lib/api';

type Props = {
  review: Review;
  accent?: string;
  highlighted?: boolean;
};

export default function ReviewGridCard({
  review,
  accent = '#F5A623',
  highlighted = false,
}: Props) {
  const displayAuthor =
    review.displayAuthor ||
    (review.isAnonymous
      ? 'Anonymous'
      : review.author || 'Anonymous');

  const employmentLabel = [
    review.employmentDetails?.jobTitle,
    review.employmentDetails?.employmentStatus,
  ]
    .filter(Boolean)
    .join(' • ');

  return (
    <article
      className={`flex h-full flex-col rounded-2xl border p-5 transition-all duration-200 ${
        highlighted
          ? 'border-transparent bg-dash-card shadow-xl'
          : 'border-dash-border bg-dash-card hover:-translate-y-0.5 hover:shadow-md'
      }`}
    >
      <div className="flex items-start gap-3">
        <Avatar name={displayAuthor} />

        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-dash-text">
            {displayAuthor}
          </p>

          {employmentLabel && (
            <div className="mt-1 flex items-center gap-1.5 text-xs text-dash-muted">
              <BriefcaseBusiness
                size={13}
                className="shrink-0"
              />

              <span className="truncate">
                {employmentLabel}
              </span>
            </div>
          )}

          <div className="mt-2 flex items-center gap-2">
            <StarRow
              filled={normalizeFiveStarRating(
                review.overallRating
              )}
              color={accent}
            />

            <span className="text-xs font-medium text-dash-muted">
              {review.overallRating.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      <p className="mt-4 line-clamp-4 flex-1 text-sm leading-relaxed text-dash-muted">
        &ldquo;{review.experience}&rdquo;
      </p>

      <div className="mt-4 border-t border-dash-border pt-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-dash-text">
              {review.companyName}
            </p>

            {review.employmentDetails?.duration && (
              <p className="mt-1 truncate text-[11px] text-dash-muted">
                {review.employmentDetails.duration}
              </p>
            )}
          </div>

          <ArrowRight
            size={16}
            className="shrink-0 text-dash-muted"
          />
        </div>
      </div>
    </article>
  );
}