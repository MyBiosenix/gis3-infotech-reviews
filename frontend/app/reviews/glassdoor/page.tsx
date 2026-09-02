"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ExternalLink,
  MapPin,
  MessageSquareText,
  Star,
  Users,
} from "lucide-react";
import Navbar from "@/components/Navbar";

const numberFormatter = new Intl.NumberFormat("en-US");

const company = {
  name: "Glassdoor",
  score: 4.2,
  reviewCount: 184526,
  ratingLabel: "Excellent",
  website: "https://www.glassdoor.com",
};

const ratingDistribution = [
  { stars: 5, percentage: 67 },
  { stars: 4, percentage: 18 },
  { stars: 3, percentage: 8 },
  { stars: 2, percentage: 4 },
  { stars: 1, percentage: 3 },
];

const reviews = [
  {
    id: 1,
    name: "Rahul Sharma",
    role: "Software Engineer",
    location: "Bengaluru, India",
    rating: 5,
    date: "August 24, 2026",
    title: "Great place to grow professionally",
    comment:
      "The work culture is supportive and the team provides plenty of opportunities to learn new technologies. Management is approachable and the overall experience has been positive.",
    pros: "Supportive management, good learning opportunities and flexible work culture.",
    cons: "Some projects can become demanding during peak periods.",
    verified: true,
  },
  {
    id: 2,
    name: "Priya Mehta",
    role: "Marketing Executive",
    location: "Mumbai, India",
    rating: 4,
    date: "August 19, 2026",
    title: "Positive working environment",
    comment:
      "My experience has been good overall. The company provides a professional environment and employees get opportunities to take ownership of their work.",
    pros: "Friendly colleagues, flexible environment and good exposure.",
    cons: "Internal communication could sometimes be faster.",
    verified: true,
  },
  {
    id: 3,
    name: "Aman Verma",
    role: "Business Development Executive",
    location: "Delhi, India",
    rating: 5,
    date: "August 15, 2026",
    title: "Good company with supportive colleagues",
    comment:
      "A collaborative workplace with helpful teammates. I particularly liked the freedom to contribute ideas and work independently.",
    pros: "Team support, learning environment and career opportunities.",
    cons: "Occasional workload pressure.",
    verified: true,
  },
  {
    id: 4,
    name: "Neha Kapoor",
    role: "HR Executive",
    location: "Noida, India",
    rating: 4,
    date: "August 10, 2026",
    title: "Good learning experience",
    comment:
      "A good organization for people who want to develop their professional skills. The workplace encourages collaboration and continuous learning.",
    pros: "Good team, professional exposure and supportive seniors.",
    cons: "Processes can be improved further.",
    verified: true,
  },
];

type StarsProps = {
  rating: number;
  size?: "sm" | "md" | "lg";
};

function Stars({ rating, size = "md" }: StarsProps) {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizes[size]} ${
            star <= Math.round(rating)
              ? "fill-[#0caa8f] text-[#0caa8f]"
              : "fill-slate-200 text-slate-200"
          }`}
        />
      ))}
    </div>
  );
}

export default function GlassdoorReviewsPage() {
  useEffect(() => {
    document.title = "Glassdoor Reviews — GIS3 Infotech";
  }, []);

  return (<>
  <Navbar></Navbar>
    <main className="min-h-screen bg-[#f7f8fa] text-slate-900">
      {/* Hero Section */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-start">
            <div className="flex flex-col gap-5 sm:flex-row">
              {/* Logo */}
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#e7f7f4] sm:h-24 sm:w-24">
                <Building2 className="h-10 w-10 text-[#0caa8f] sm:h-12 sm:w-12" />
              </div>

              {/* Company Details */}
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#e7f7f4] px-3 py-1 text-xs font-semibold text-[#087f6c]">
                    🏢 Glassdoor
                  </span>

                  <span className="flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Verified Profile
                  </span>
                </div>

                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  {company.name} Reviews
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                  Read employee experiences, workplace ratings and company
                  reviews associated with Glassdoor.
                </p>

                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#087f6c] transition hover:text-[#065f51]"
                >
                  Visit company website
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Write Review Button */}
            {/* <Link
              href="/reviews/new"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0caa8f] px-5 py-3.5 text-sm font-bold text-white shadow-[0_10px_30px_rgba(12,170,143,0.2)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#098f79]"
            >
              <MessageSquareText className="h-4 w-4" />
              Write a Review
            </Link> */}
          </div>
        </div>
      </section>

      {/* Rating Overview */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          {/* Overall Rating */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              Overall Rating
            </p>

            <div className="mt-3 flex items-end gap-3">
              <span className="text-5xl font-bold tracking-tight">
                {company.score}
              </span>

              <span className="mb-1 text-sm font-medium text-slate-400">
                / 5
              </span>
            </div>

            <div className="mt-4">
              <Stars rating={company.score} size="lg" />
            </div>

            <p className="mt-4 font-semibold text-[#087f6c]">
              {company.ratingLabel}
            </p>

           <p className="mt-1 text-sm text-slate-500">
              Based on {numberFormatter.format(company.reviewCount)} reviews
            </p>

            <div className="mt-6 border-t border-slate-100 pt-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Review source</span>

                <span className="font-semibold text-slate-800">
                  Glassdoor
                </span>
              </div>
            </div>
          </div>

          {/* Rating Breakdown */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-bold">Rating Breakdown</h2>

              <p className="mt-1 text-sm text-slate-500">
                Distribution of employee ratings
              </p>
            </div>

            <div className="space-y-5">
              {ratingDistribution.map((item) => (
                <div
                  key={item.stars}
                  className="grid grid-cols-[55px_1fr_45px] items-center gap-3"
                >
                  <div className="flex items-center gap-1 text-sm font-semibold text-slate-700">
                    {item.stars}

                    <Star className="h-3.5 w-3.5 fill-[#0caa8f] text-[#0caa8f]" />
                  </div>

                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-[#0caa8f] transition-all"
                      style={{
                        width: `${item.percentage}%`,
                      }}
                    />
                  </div>

                  <span className="text-right text-sm font-medium text-slate-500">
                    {item.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {/* Reviews */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#e7f7f4]">
              <Users className="h-5 w-5 text-[#0caa8f]" />
            </div>

            <p className="text-xl font-bold">184K+</p>

            <p className="mt-1 text-xs text-slate-500">
              Employee Reviews
            </p>
          </div>

          {/* Average */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#e7f7f4]">
              <Star className="h-5 w-5 text-[#0caa8f]" />
            </div>

            <p className="text-xl font-bold">4.2 / 5</p>

            <p className="mt-1 text-xs text-slate-500">
              Average Rating
            </p>
          </div>

          {/* Recommend */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#e7f7f4]">
              <BriefcaseBusiness className="h-5 w-5 text-[#0caa8f]" />
            </div>

            <p className="text-xl font-bold">73%</p>

            <p className="mt-1 text-xs text-slate-500">
              Would Recommend
            </p>
          </div>

          {/* Sentiment */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#e7f7f4]">
              <ArrowUpRight className="h-5 w-5 text-[#0caa8f]" />
            </div>

            <p className="text-xl font-bold">Positive</p>

            <p className="mt-1 text-xs text-slate-500">
              Overall Sentiment
            </p>
          </div>
        </div>
      </section>

      {/* Review List */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">
            Employee Reviews
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Latest workplace experiences and employee feedback
          </p>
        </div>

        <div className="space-y-5">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-6"
            >
              {/* Review Header */}
              <div className="flex flex-col justify-between gap-4 sm:flex-row">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e7f7f4] text-sm font-bold text-[#087f6c]">
                    {review.name
                      .split(" ")
                      .map((item) => item[0])
                      .join("")
                      .slice(0, 2)}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-slate-900">
                        {review.name}
                      </p>

                      {review.verified && (
                        <CheckCircle2 className="h-4 w-4 text-[#0caa8f]" />
                      )}
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <BriefcaseBusiness className="h-3.5 w-3.5" />
                        {review.role}
                      </span>

                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {review.location}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="sm:text-right">
                  <Stars rating={review.rating} />

                  <p className="mt-1.5 text-xs text-slate-400">
                    {review.date}
                  </p>
                </div>
              </div>

              {/* Review Content */}
              <div className="mt-5">
                <h3 className="text-lg font-bold text-slate-900">
                  {review.title}
                </h3>

                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {review.comment}
                </p>
              </div>

              {/* Pros / Cons */}
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {/* Pros */}
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-4">
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-emerald-700">
                    Pros
                  </p>

                  <p className="text-sm leading-6 text-slate-600">
                    {review.pros}
                  </p>
                </div>

                {/* Cons */}
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-600">
                    Cons
                  </p>

                  <p className="text-sm leading-6 text-slate-600">
                    {review.cons}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Load More Static Button */}
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:border-[#0caa8f] hover:text-[#087f6c]"
          >
            View More Reviews
          </button>
        </div>

        {/* Disclaimer */}
        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs leading-6 text-slate-500">
            GIS3 Infotech displays reviews and ratings for informational purposes.
            Individual employee experiences may vary. Brand names, logos and
            trademarks belong to their respective owners.
          </p>
        </div>
      </section>
    </main>
    </>
  );
}