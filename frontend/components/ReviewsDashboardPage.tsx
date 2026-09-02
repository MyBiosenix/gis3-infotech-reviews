'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  RefreshCw,
  SearchX,
  Star,
} from 'lucide-react';

import {
  getReviews,
  type Review,
  type ReviewSource,
  type ReviewStats,
} from '@/lib/api';

import Sidebar from './Sidebar';
import Topbar from './Topbar';
import ReviewGridCard from './ReviewGridCard';

type Props = {
  source?: ReviewSource;
  title: string;
  accent: string;
  badge?: React.ReactNode;
  emptyMessage: string;
};

const initialStats: ReviewStats = {
  averageOverallRating: 0,

  averageRatings: {
    workEnvironment: 0,
    salaryBenefits: 0,
    management: 0,
    careerGrowth: 0,
  },

  count: 0,
};

export default function ReviewsDashboardPage({
  source,
  title,
  accent,
  badge,
  emptyMessage,
}: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] =
    useState<ReviewStats>(initialStats);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadReviews() {
      try {
        setError(null);

        if (reviews.length === 0) {
          setLoading(true);
        } else {
          setRefreshing(true);
        }

        const data = await getReviews({
          source,
          status: 'approved',
          page: 1,
          limit: 100,
        });

        if (!active) {
          return;
        }

        setReviews(data.reviews);
        setStats(data.stats);
      } catch (err) {
        if (!active) {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : 'Could not reach the GIS3 Infotech API. Is the server running?'
        );
      } finally {
        if (active) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    }

    loadReviews();

    return () => {
      active = false;
    };
  }, [source, reloadKey]);

  const filteredReviews = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return reviews;
    }

    return reviews.filter((review) => {
      const displayAuthor =
        review.displayAuthor ||
        (review.isAnonymous
          ? 'Anonymous'
          : review.author || '');

      const searchableValues = [
        displayAuthor,
        review.companyName,
        review.experience,
        review.employmentDetails?.jobTitle,
        review.employmentDetails
          ?.employmentStatus,
        review.employmentDetails?.duration,
        review.source,
      ];

      return searchableValues.some((value) =>
        String(value || '')
          .toLowerCase()
          .includes(query)
      );
    });
  }, [reviews, search]);

  const today = useMemo(
    () =>
      new Date().toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    []
  );

  function handleRefresh() {
    if (loading || refreshing) {
      return;
    }

    setReloadKey((current) => current + 1);
  }

  return (
    <div className="flex min-h-screen bg-dash-bg">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <Topbar
          title={title}
          subtitle={today}
          search={search}
          onSearchChange={setSearch}
          badge={badge}
        />

        <main className="px-4 pb-12 sm:px-6 md:px-8">
          {!loading && !error && (
            <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              <StatCard
                label="Total Reviews"
                value={stats.count}
              />

              <StatCard
                label="Overall Rating"
                value={formatRating(
                  stats.averageOverallRating
                )}
                suffix="/5"
                icon={
                  <Star
                    size={18}
                    className="fill-[#F5A623] text-[#F5A623]"
                  />
                }
              />

              <StatCard
                label="Work Environment"
                value={formatRating(
                  stats.averageRatings
                    .workEnvironment
                )}
                suffix="/5"
              />

              <StatCard
                label="Salary & Benefits"
                value={formatRating(
                  stats.averageRatings
                    .salaryBenefits
                )}
                suffix="/5"
              />

              <StatCard
                label="Career Growth"
                value={formatRating(
                  stats.averageRatings.careerGrowth
                )}
                suffix="/5"
              />
            </section>
          )}

          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              {!loading && !error && (
                <p className="text-sm text-dash-muted">
                  {search.trim()
                    ? `${filteredReviews.length} review${
                        filteredReviews.length === 1
                          ? ''
                          : 's'
                      } found`
                    : `${reviews.length} review${
                        reviews.length === 1
                          ? ''
                          : 's'
                      }`}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={loading || refreshing}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-dash-border bg-dash-card px-4 py-2 text-sm font-medium text-dash-text transition hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={16}
                className={
                  refreshing
                    ? 'animate-spin'
                    : ''
                }
              />

              {refreshing
                ? 'Refreshing...'
                : 'Refresh'}
            </button>
          </div>

          {loading && <ReviewsLoadingGrid />}

          {error && !loading && (
            <div
              role="alert"
              className="rounded-2xl border border-red-200 bg-red-50 p-6"
            >
              <div className="flex items-start gap-3">
                <AlertCircle
                  size={22}
                  className="mt-0.5 shrink-0 text-red-600"
                />

                <div className="min-w-0">
                  <h2 className="font-semibold text-red-800">
                    Reviews could not be loaded
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-red-600">
                    {error}
                  </p>

                  <button
                    type="button"
                    onClick={handleRefresh}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-100"
                  >
                    <RefreshCw size={15} />
                    Try again
                  </button>
                </div>
              </div>
            </div>
          )}

          {!loading &&
            !error &&
            reviews.length === 0 && (
              <EmptyState message={emptyMessage} />
            )}

          {!loading &&
            !error &&
            reviews.length > 0 &&
            filteredReviews.length === 0 && (
              <EmptyState
                message={`No reviews match “${search.trim()}”.`}
                searchResult
              />
            )}

          {!loading &&
            !error &&
            filteredReviews.length > 0 && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {filteredReviews.map(
                  (review, index) => (
                    <ReviewGridCard
                      key={review._id}
                      review={review}
                      accent={accent}
                      highlighted={
                        index === 0 &&
                        !search.trim()
                      }
                    />
                  )
                )}
              </div>
            )}
        </main>
      </div>
    </div>
  );
}

type StatCardProps = {
  label: string;
  value: string | number;
  suffix?: string;
  icon?: React.ReactNode;
};

function StatCard({
  label,
  value,
  suffix,
  icon,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-dash-border bg-dash-card p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="truncate text-xs font-medium uppercase tracking-[0.08em] text-dash-muted">
          {label}
        </p>

        {icon}
      </div>

      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-2xl font-bold text-dash-text">
          {value}
        </span>

        {suffix && (
          <span className="text-sm font-medium text-dash-muted">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

function EmptyState({
  message,
  searchResult = false,
}: {
  message: string;
  searchResult?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-dash-border bg-dash-card p-10 text-center">
      {searchResult && (
        <SearchX
          size={36}
          className="mx-auto mb-4 text-dash-muted"
        />
      )}

      <p className="text-sm leading-6 text-dash-muted">
        {message}
      </p>
    </div>
  );
}

function ReviewsLoadingGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {Array.from({ length: 8 }).map(
        (_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-2xl border border-dash-border bg-dash-card p-5"
          >
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-full bg-black/10" />

              <div className="flex-1">
                <div className="h-4 w-28 rounded bg-black/10" />
                <div className="mt-2 h-3 w-24 rounded bg-black/10" />
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <div className="h-3 w-full rounded bg-black/10" />
              <div className="h-3 w-full rounded bg-black/10" />
              <div className="h-3 w-4/5 rounded bg-black/10" />
            </div>

            <div className="mt-6 border-t border-dash-border pt-4">
              <div className="h-3 w-32 rounded bg-black/10" />
            </div>
          </div>
        )
      )}
    </div>
  );
}

function formatRating(value: number): string {
  return Number.isFinite(value)
    ? value.toFixed(1)
    : '0.0';
}