'use client';

import { useEffect, useState } from 'react';
import { Loader2, Star } from 'lucide-react';
import { getReviews, type Review, type ReviewSource } from '@/lib/api';

export default function ApprovedSourceReviews({ source }: { source: ReviewSource }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    getReviews({ source, limit: 50 })
      .then((data) => {
        if (active) setReviews(data.reviews);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'Unable to load reviews.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [source]);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Live from database</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900">Approved {source} reviews</h2>
        </div>
        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-500">
          {reviews.length} approved
        </span>
      </div>

      {loading && (
        <div className="flex min-h-32 items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div>
      )}

      {!loading && !error && reviews.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center text-sm text-slate-500">
          No approved {source} reviews yet. New submissions will appear here after admin approval.
        </div>
      )}

      {!loading && !error && reviews.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {reviews.map((review) => (
            <article key={review._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-slate-900">{review.author || 'Anonymous'}</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {review.employmentDetails?.jobTitle || review.employmentDetails?.employmentStatus || 'Reviewer'}
                  </p>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-sm font-semibold text-amber-700">
                  <Star className="h-4 w-4 fill-current" />
                  {Number(review.overallRating || 0).toFixed(1)}
                </div>
              </div>

              <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-700">{review.experience}</p>

              <div className="mt-5 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
                <span>Work: {review.ratings.workEnvironment}/5</span>
                <span>Salary: {review.ratings.salaryBenefits}/5</span>
                <span>Management: {review.ratings.management}/5</span>
                <span>Growth: {review.ratings.careerGrowth}/5</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
