import {
  BriefcaseBusiness,
  CalendarDays,
  Clock3,
  UserRound,
} from 'lucide-react';

import type { Review } from '@/lib/api';
import ScoreDial from './ScoreDial';

function formatDate(iso: string) {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function ReviewCard({
  review,
}: {
  review: Review;
}) {
  const displayAuthor =
    review.displayAuthor ||
    (review.isAnonymous
      ? 'Anonymous'
      : review.author || 'Anonymous');

  const overallRating = Number.isFinite(
    review.overallRating
  )
    ? review.overallRating
    : 0;

  const employmentDetails = [
    review.employmentDetails?.jobTitle,
    review.employmentDetails?.employmentStatus,
    review.employmentDetails?.duration,
  ].filter(Boolean);

  return (
    <article className="flex flex-col gap-4 rounded-xl border border-court-line bg-court-panel p-4 transition-shadow hover:shadow-md sm:flex-row md:p-5">
      <div className="shrink-0">
        <ScoreDial score={overallRating} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
          <div className="min-w-0">
            <h3 className="truncate font-display text-lg font-semibold uppercase tracking-wide text-ink">
              {review.companyName}
            </h3>

            <div className="mt-1 flex items-center gap-2 text-xs text-ink-muted">
              <span className="font-mono tabular-nums">
                {overallRating.toFixed(1)}/5
              </span>

              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                  review.status === 'approved'
                    ? 'border-green-300 bg-green-50 text-green-700'
                    : review.status === 'rejected'
                      ? 'border-red-300 bg-red-50 text-red-700'
                      : 'border-amber-300 bg-amber-50 text-amber-700'
                }`}
              >
                {review.status}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-ink-muted">
            <CalendarDays
              size={14}
              className="shrink-0"
            />

            <span className="font-mono tabular-nums">
              {formatDate(review.createdAt)}
            </span>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2 text-xs text-ink-muted">
          <span className="inline-flex items-center gap-1.5 rounded-md border border-court-line px-2 py-1">
            <UserRound size={13} />
            {displayAuthor}
          </span>

          {review.employmentDetails?.jobTitle && (
            <span className="inline-flex items-center gap-1.5 rounded-md border border-court-line px-2 py-1">
              <BriefcaseBusiness size={13} />
              {review.employmentDetails.jobTitle}
            </span>
          )}

          {review.employmentDetails?.employmentStatus && (
            <span className="rounded-md border border-court-line px-2 py-1">
              {
                review.employmentDetails
                  .employmentStatus
              }
            </span>
          )}

          {review.employmentDetails?.duration && (
            <span className="inline-flex items-center gap-1.5 rounded-md border border-court-line px-2 py-1">
              <Clock3 size={13} />
              {review.employmentDetails.duration}
            </span>
          )}

          <span className="rounded-md border border-court-line px-2 py-1 uppercase tracking-wide">
            {review.source}
          </span>
        </div>

        <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-ink/90">
          {review.experience}
        </p>

        <div className="mt-5 grid gap-3 border-t border-court-line pt-4 sm:grid-cols-2 lg:grid-cols-4">
          <RatingItem
            label="Work Environment"
            value={
              review.ratings?.workEnvironment
            }
          />

          <RatingItem
            label="Salary & Benefits"
            value={review.ratings?.salaryBenefits}
          />

          <RatingItem
            label="Management"
            value={review.ratings?.management}
          />

          <RatingItem
            label="Career Growth"
            value={review.ratings?.careerGrowth}
          />
        </div>

        {employmentDetails.length === 0 && (
          <p className="mt-4 text-xs italic text-ink-muted">
            No employment details were provided.
          </p>
        )}
      </div>
    </article>
  );
}

function RatingItem({
  label,
  value,
}: {
  label: string;
  value?: number;
}) {
  const safeValue =
    typeof value === 'number' &&
    Number.isFinite(value)
      ? value
      : 0;

  return (
    <div className="rounded-lg border border-court-line bg-court px-3 py-2.5">
      <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-ink-muted">
        {label}
      </p>

      <div className="mt-1 flex items-baseline gap-1">
        <span className="font-mono text-base font-semibold tabular-nums text-ink">
          {safeValue}
        </span>

        <span className="text-xs text-ink-muted">
          /5
        </span>
      </div>
    </div>
  );
}