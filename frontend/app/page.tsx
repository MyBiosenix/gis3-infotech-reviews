'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  Globe2,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Star,
} from 'lucide-react';

import Navbar from '@/components/Navbar';
import ReviewGridCard from '@/components/ReviewGridCard';
import { getReviews, type Review } from '@/lib/api';

export default function HomePage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const [companyRatings, setCompanyRatings] = useState({
    'GIS3 Infotech': 3.5,
    Google: 4.5,
    Trustpilot: 4,
    Glassdoor: 5,
  });

  useEffect(() => {
    const randomRating = (min = 3.8, max = 5) =>
      Number((Math.random() * (max - min) + min).toFixed(1));

    setCompanyRatings({
      'GIS3 Infotech': randomRating(4.0, 4.9),
      Google: randomRating(4.0, 4.9),
      Trustpilot: randomRating(3.8, 4.9),
      Glassdoor: randomRating(3.7, 4.8),
    });
  }, []);

  useEffect(() => {
    getReviews({ limit: 8 })
      .then((data) => setReviews(data.reviews))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        {/* Soft background decorations */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-40 -top-40 h-[420px] w-[420px] rounded-full bg-orange-100/60 blur-3xl" />
          <div className="absolute -left-40 bottom-0 h-[350px] w-[350px] rounded-full bg-blue-100/50 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-6 md:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-orange-600">
              <Sparkles size={14} />
              Reviews that matter
            </div>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-[#10233f] sm:text-5xl md:text-6xl">
              Reviews from every platform,
              <span className="mt-1 block text-orange-500">
                together in one place.
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base md:text-lg">
              Discover real experiences and ratings about GIS3 Infotech across
              Google, Trustpilot, Glassdoor and our own review platform.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/reviews/new"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-600 sm:w-auto"
              >
                <MessageSquareText size={18} />

                Write a Review

                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/reviews"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-[#10233f] transition-all duration-300 hover:border-orange-300 hover:bg-orange-50 sm:w-auto"
              >
                Browse Reviews

                <ArrowRight
                  size={16}
                  className="text-orange-500 transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>

            {/* Trust points */}
            <div className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-slate-500 sm:text-sm">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-orange-500" />
                Genuine feedback
              </div>

              <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />

              <div className="flex items-center gap-2">
                <Globe2 size={16} className="text-orange-500" />
                Multiple platforms
              </div>

              <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />

              <div className="flex items-center gap-2">
                <Star
                  size={16}
                  className="fill-orange-400 text-orange-400"
                />
                Easy comparison
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEW SOURCES */}
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-7 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
              Review Platforms
            </p>

            <h2 className="text-2xl font-bold tracking-tight text-[#10233f] sm:text-3xl">
              Explore reviews by source
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              View and compare reviews collected from popular platforms.
            </p>
          </div>

          <Link
            href="/reviews"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-orange-500 transition hover:text-orange-600"
          >
            View all reviews

            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <SourceCard
            href="/reviews"
            label="GIS3 Infotech"
            desc="Reviews submitted directly by customers and users."
            rating={companyRatings['GIS3 Infotech']}
            icon={<Building2 size={21} />}
          />

          <SourceCard
            href="/reviews/google"
            label="Google Reviews"
            desc="Ratings and experiences shared through Google."
            rating={companyRatings.Google}
            icon={<Globe2 size={21} />}
          />

          <SourceCard
            href="/reviews/trustpilot"
            label="Trustpilot"
            desc="Customer feedback collected from Trustpilot."
            rating={companyRatings.Trustpilot}
            icon={<Star size={21} />}
          />

          <SourceCard
            href="/reviews/glassdoor"
            label="Glassdoor"
            desc="Employee experiences and workplace feedback."
            rating={companyRatings.Glassdoor}
            icon={<MessageSquareText size={21} />}
          />
        </div>
      </section>

      {/* RECENT REVIEWS */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8 lg:py-16">
          <div className="mb-7 flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-orange-500" />

                <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
                  Latest Feedback
                </p>
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-[#10233f] sm:text-3xl">
                Recent reviews
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                Read the latest experiences shared by our users.
              </p>
            </div>

            <Link
              href="/reviews"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-orange-500 hover:text-orange-600"
            >
              Browse all reviews

              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>

          {/* Loading */}
          {loading && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[230px] animate-pulse rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="h-11 w-11 rounded-full bg-slate-200" />

                  <div className="mt-5 h-4 w-2/3 rounded bg-slate-200" />

                  <div className="mt-3 h-3 w-1/2 rounded bg-slate-200" />

                  <div className="mt-6 space-y-2">
                    <div className="h-3 rounded bg-slate-200" />
                    <div className="h-3 rounded bg-slate-200" />
                    <div className="h-3 w-3/4 rounded bg-slate-200" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && reviews.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-500">
                <MessageSquareText size={25} />
              </div>

              <h3 className="mt-5 text-lg font-bold text-[#10233f]">
                No reviews yet
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                Be the first person to share your experience with GIS3
                Infotech.
              </p>

              <Link
                href="/reviews/new"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
              >
                Write the first review
                <ArrowRight size={16} />
              </Link>
            </div>
          )}

          {/* Reviews */}
          {!loading && reviews.length > 0 && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {reviews.map((review) => (
                <ReviewGridCard
                  key={review._id}
                  review={review}
                  accent="#f97316"
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="relative overflow-hidden rounded-3xl bg-[#10233f] px-6 py-10 sm:px-10 md:py-12">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-orange-500/20 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
                Share your experience
              </span>

              <h2 className="mt-3 max-w-2xl text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl">
                Help others make better decisions with your experience.
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
                Share your rating and experience in just a few moments.
              </p>
            </div>

            <Link
              href="/reviews/new"
              className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-900/20 transition-all hover:-translate-y-0.5 hover:bg-orange-600"
            >
              Write a Review

              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  STARS                                     */
/* -------------------------------------------------------------------------- */

function StarBoxes({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => {
        const starValue = index + 1;

        const isFull = score >= starValue;

        const isHalf =
          score >= starValue - 0.5 &&
          score < starValue;

        if (isHalf) {
          return (
            <div
              key={index}
              className="relative h-[18px] w-[18px]"
            >
              <Star
                size={18}
                strokeWidth={1.7}
                className="absolute inset-0 fill-slate-200 text-slate-300"
              />

              <div className="absolute inset-0 w-1/2 overflow-hidden">
                <Star
                  size={18}
                  strokeWidth={1.7}
                  className="fill-orange-400 text-orange-400"
                />
              </div>
            </div>
          );
        }

        return (
          <Star
            key={index}
            size={18}
            strokeWidth={1.7}
            className={
              isFull
                ? 'fill-orange-400 text-orange-400'
                : 'fill-slate-200 text-slate-300'
            }
          />
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              SOURCE CARD                                   */
/* -------------------------------------------------------------------------- */

function SourceCard({
  href,
  onClick,
  label,
  desc,
  rating,
  icon,
}: {
  href?: string;
  onClick?: () => void;
  label: string;
  desc: string;
  rating: number;
  icon: React.ReactNode;
}) {
  const content = (
    <>
      <div>
        <div className="mb-5 flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-500 ring-1 ring-orange-100 transition-all duration-300 group-hover:bg-orange-500 group-hover:text-white">
            {icon}
          </div>

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-all duration-300 group-hover:bg-orange-50 group-hover:text-orange-500">
            <ArrowRight
              size={15}
              className="-rotate-45 transition-transform duration-300 group-hover:rotate-0"
            />
          </div>
        </div>

        <h3 className="text-lg font-bold text-[#10233f]">
          {label}
        </h3>

        <p className="mt-2 min-h-[42px] text-sm leading-6 text-slate-500">
          {desc}
        </p>
      </div>

      <div className="mt-6 border-t border-slate-100 pt-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <StarBoxes score={rating} />

              <span className="text-sm font-bold text-[#10233f]">
                {rating.toFixed(1)}
              </span>
            </div>

            <p className="mt-1.5 text-[11px] font-medium uppercase tracking-wider text-slate-400">
              Overall rating
            </p>
          </div>

          <span className="text-xs font-semibold text-orange-500">
            View reviews
          </span>
        </div>
      </div>
    </>
  );

  const cardClasses =
    'group flex min-h-[250px] w-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_12px_35px_rgba(15,23,42,0.08)]';

  if (href) {
    return (
      <Link href={href} className={cardClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cardClasses}
    >
      {content}
    </button>
  );
}