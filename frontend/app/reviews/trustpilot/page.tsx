"use client";

import { useEffect, useState } from "react";

import {
  ChevronDown,
  Info,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import CompanyReviewSummaryPage from "@/components/CompanyReviewSummaryPage";

import {
  getReviews,
  type Review,
} from "@/lib/api";

/* =========================================================
   COMPANY DATA
========================================================= */

const company = {
  name: "Trustpilot",
  reviewCount: 529322,
  score: 4.4,
  ratingLabel: "Excellent",
  website: "https://www.trustpilot.com",
  sourceName: "Review Site",

  distribution: {
    five: 73,
    four: 7,
    three: 2,
    two: 2,
    one: 12,
  },

  summary: `Evaluating 115,967 reviews, reviewers overwhelmingly had a great
experience with this company. Customers frequently mention that the online
platform is extremely easy to navigate, making the entire user experience
smooth, clear, and very helpful for making daily purchasing decisions.
Consumers genuinely appreciate the efficient service, noting that daily
communication is great and the dedicated team consistently offers reliable
support.`,

  negativeSummary: `However, some customers also noted frustration when their
positive reviews were removed unexpectedly without any clear explanations
provided by the platform management. A few other people also felt that certain
interactive elements and collection processes found across the website can
sometimes feel confusing or unclear.`,
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function ReviewPage() {
  /*
   * Approved Trustpilot reviews from database
   */
  const [approvedReviews, setApprovedReviews] =
    useState<Review[]>([]);

  /*
   * Loading state
   */
  const [loading, setLoading] =
    useState(true);

  /*
   * Error state
   */
  const [error, setError] =
    useState<string | null>(null);

  /*
   * Number of approved database reviews visible
   */
  const [visibleCount, setVisibleCount] =
    useState(5);

  /* =========================================================
     PAGE TITLE
  ========================================================= */

  useEffect(() => {
    document.title =
      "Trustpilot Reviews — GIS3 Infotech";
  }, []);

  /* =========================================================
     FETCH APPROVED TRUSTPILOT REVIEWS
  ========================================================= */

  useEffect(() => {
    let active = true;

    const loadTrustpilotReviews =
      async () => {
        try {
          setLoading(true);
          setError(null);

          const data =
            await getReviews({
              source: "Trustpilot",
              limit: 50,
            });

          if (active) {
            setApprovedReviews(
              data.reviews || []
            );
          }
        } catch (err) {
          console.error(
            "Unable to load approved Trustpilot reviews:",
            err
          );

          if (active) {
            setError(
              err instanceof Error
                ? err.message
                : "Unable to load reviews."
            );
          }
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      };

    loadTrustpilotReviews();

    return () => {
      active = false;
    };
  }, []);

  /* =========================================================
     LOAD MORE
  ========================================================= */

  const loadMoreReviews = () => {
    setVisibleCount((prev) =>
      Math.min(
        prev + 5,
        approvedReviews.length
      )
    );
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white text-[#1f1f1f]">

        {/* =================================================
            TRUSTPILOT HEADER
        ================================================= */}

        <div className="mx-auto max-w-[1320px] px-4 py-8 sm:px-6 lg:px-8">

          <div className="grid gap-14 lg:grid-cols-[1fr_455px]">

            {/* LEFT */}

            <section className="min-w-0">

              {/* Company Header */}

              <div className="flex items-start gap-6">

                {/* Logo */}

                <div className="flex h-[72px] w-[150px] shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#00b67a]">

                  <div className="text-center text-white">

                    <div className="text-xl font-bold">
                      ★ Trustpilot
                    </div>

                  </div>

                </div>

                {/* Company Details */}

                <div className="min-w-0">

                  <h1 className="text-[38px] font-bold leading-none tracking-tight">

                    {company.name}

                  </h1>

                  <div className="mt-5 flex flex-wrap items-center gap-3 text-[16px]">

                    <button
                      type="button"
                      className="border-b border-black"
                    >

                      Reviews{" "}
                      {company.reviewCount.toLocaleString()}

                    </button>

                    <span className="text-zinc-400">
                      •
                    </span>

                    <StarBoxes
                      score={company.score}
                    />

                    <span className="text-[17px] font-semibold">

                      {company.score.toFixed(1)}

                    </span>

                    <Info className="h-[18px] w-[18px] text-zinc-500" />

                  </div>

                  <p className="mt-3 text-[17px] text-[#4054c7]">

                    {company.sourceName}

                  </p>

                </div>

              </div>

              <div className="my-10 border-t border-[#dedede]" />

              {/* =================================================
                  INTEGRITY NOTICE
              ================================================= */}

              <button
                type="button"
                className="flex w-full items-center gap-4 rounded-xl border border-[#ded8cc] bg-[#fcfaf4] px-5 py-5 text-left"
              >

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#dce7ff] text-[#2357b8] shadow">

                  <ShieldCheck className="h-6 w-6" />

                </div>

                <p className="flex-1 text-[16px] font-semibold">

                  Click in your own score, or browse what people are already
                  saying across Trustpilot

                </p>

                <ChevronDown className="h-5 w-5" />

              </button>

            </section>

          </div>

        </div>

        {/* =================================================
            EXISTING TRUSTPILOT SUMMARY / STATIC CONTENT
        ================================================= */}

        <CompanyReviewSummaryPage
          source="Trustpilot"
        />

        {/* =================================================
            APPROVED DATABASE TRUSTPILOT REVIEWS
        ================================================= */}

        <section className="bg-[#f8f8f8] py-12">

          <div className="mx-auto max-w-[1000px] px-4 sm:px-6">

            {/* Heading */}

            <div className="mb-7 flex flex-wrap items-end justify-between gap-4">

              <div>

                <p className="text-[13px] font-semibold text-[#00b67a]">

                  Customer feedback

                </p>

                <h2 className="mt-1 text-2xl font-bold text-[#1f1f1f] sm:text-3xl">

                  Latest Trustpilot Reviews

                </h2>

                <p className="mt-2 text-sm text-zinc-500">

                  Approved reviews shared by our customers.

                </p>

              </div>

              {!loading &&
                approvedReviews.length >
                  0 && (

                  <span className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-500">

                    Showing{" "}
                    {Math.min(
                      visibleCount,
                      approvedReviews.length
                    )}{" "}
                    of{" "}
                    {
                      approvedReviews.length
                    }

                  </span>

                )}

            </div>

            {/* =================================================
                LOADING
            ================================================= */}

            {loading && (

              <div className="rounded-xl border border-zinc-200 bg-white px-5 py-12 text-center">

                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-[#00b67a]" />

                <p className="mt-4 text-sm text-zinc-500">

                  Loading reviews...

                </p>

              </div>

            )}

            {/* =================================================
                ERROR
            ================================================= */}

            {!loading &&
              error && (

                <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">

                  {error}

                </div>

              )}

            {/* =================================================
                NO REVIEWS
            ================================================= */}

            {!loading &&
              !error &&
              approvedReviews.length ===
                0 && (

                <div className="rounded-xl border border-dashed border-zinc-300 bg-white px-6 py-12 text-center">

                  <p className="font-semibold text-zinc-700">

                    No approved Trustpilot reviews yet.

                  </p>

                  <p className="mt-2 text-sm text-zinc-500">

                    New Trustpilot reviews will appear here after admin
                    approval.

                  </p>

                </div>

              )}

            {/* =================================================
                REVIEWS
            ================================================= */}

            {!loading &&
              !error &&
              approvedReviews.length >
                0 && (

                <div className="space-y-5">

                  {approvedReviews
                    .slice(
                      0,
                      visibleCount
                    )
                    .map((review) => {

                      const rating =
                        Number(
                          review.overallRating ||
                            0
                        );

                      const reviewerName =
                        review.author?.trim() ||
                        "Anonymous";

                      const initials =
                        reviewerName
                          .split(" ")
                          .filter(Boolean)
                          .map(
                            (word) =>
                              word[0]
                          )
                          .join("")
                          .slice(0, 2)
                          .toUpperCase();

                      const jobTitle =
                        review
                          .employmentDetails
                          ?.jobTitle ||
                        review
                          .employmentDetails
                          ?.employmentStatus ||
                        "";

                      return (

                        <article
                          key={review._id}
                          className="rounded-xl border border-[#dedede] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all duration-200 hover:border-zinc-300 hover:shadow-md sm:p-6"
                        >

                          {/* =================================
                              TOP AREA
                          ================================= */}

                          <div className="flex flex-col justify-between gap-5 sm:flex-row">

                            <div className="flex items-center gap-3">

                              {/* Avatar */}

                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e6f7f2] text-sm font-bold text-[#007f56]">

                                {initials ||
                                  "A"}

                              </div>

                              <div>

                                <div className="flex flex-wrap items-center gap-2">

                                  <h3 className="font-bold text-[#1f1f1f]">

                                    {
                                      reviewerName
                                    }

                                  </h3>

                                  <CheckCircle2 className="h-4 w-4 text-[#00b67a]" />

                                </div>

                                {jobTitle && (

                                  <p className="mt-1 text-xs text-zinc-500">

                                    {
                                      jobTitle
                                    }

                                  </p>

                                )}

                                <p className="mt-1 text-xs text-zinc-400">

                                  Recently

                                </p>

                              </div>

                            </div>

                            {/* Rating */}

                            <div className="shrink-0">

                              <StarBoxes
                                score={
                                  rating
                                }
                              />

                              <p className="mt-2 text-left text-xs font-medium text-zinc-500 sm:text-right">

                                {
                                  rating.toFixed(
                                    1
                                  )
                                }{" "}
                                out of 5

                              </p>

                            </div>

                          </div>

                          {/* =================================
                              REVIEW TITLE
                          ================================= */}

                          <div className="mt-5">

                            <h4 className="text-[17px] font-bold text-[#1f1f1f]">

                              Customer Review

                            </h4>

                            <p className="mt-2 whitespace-pre-wrap text-[15px] leading-7 text-zinc-700">

                              {
                                review.experience
                              }

                            </p>

                          </div>

                          {/* =================================
                              VERIFIED EXPERIENCE
                          ================================= */}

                          <div className="mt-5 flex items-center gap-2 border-t border-zinc-100 pt-4">

                            <ShieldCheck className="h-4 w-4 text-[#00b67a]" />

                            <span className="text-xs font-medium text-zinc-500">

                              Approved customer review

                            </span>

                          </div>

                        </article>

                      );

                    })}

                </div>

              )}

            {/* =================================================
                LOAD MORE
            ================================================= */}

            {!loading &&
              !error &&
              visibleCount <
                approvedReviews.length && (

                <div className="mt-8 flex justify-center">

                  <button
                    type="button"
                    onClick={
                      loadMoreReviews
                    }
                    className="rounded-full border border-[#4054c7] bg-white px-8 py-3 text-sm font-bold text-[#4054c7] transition hover:bg-[#f4f5ff]"
                  >

                    Show more reviews

                  </button>

                </div>

              )}

          </div>

        </section>

      </main>
    </>
  );
}

/* =========================================================
   TRUSTPILOT STAR BOXES
========================================================= */

function StarBoxes({
  score,
  size = "normal",
}: {
  score: number;
  size?: "small" | "normal";
}) {
  const sizeClass =
    size === "small"
      ? "h-[21px] w-[21px] text-[12px]"
      : "h-[22px] w-[22px] text-[13px]";

  /*
   * Support partial final star visually.
   *
   * 4.4 = 4 green + one partial-looking box
   */
  return (
    <div className="flex gap-[2px]">

      {[1, 2, 3, 4, 5].map(
        (star) => {

          const difference =
            score - (star - 1);

          /*
           * Full star
           */
          if (difference >= 1) {
            return (

              <div
                key={star}
                className={`flex items-center justify-center bg-[#00b67a] ${sizeClass}`}
              >

                <span className="text-white">
                  ★
                </span>

              </div>

            );
          }

          /*
           * Partial star
           */
          if (
            difference > 0 &&
            difference < 1
          ) {
            const percentage =
              Math.max(
                0,
                Math.min(
                  100,
                  difference * 100
                )
              );

            return (

              <div
                key={star}
                className={`relative overflow-hidden bg-zinc-300 ${sizeClass}`}
              >

                <div
                  className="absolute inset-y-0 left-0 bg-[#00b67a]"
                  style={{
                    width: `${percentage}%`,
                  }}
                />

                <span className="absolute inset-0 flex items-center justify-center text-white">

                  ★

                </span>

              </div>

            );
          }

          /*
           * Empty star
           */
          return (

            <div
              key={star}
              className={`flex items-center justify-center bg-zinc-300 ${sizeClass}`}
            >

              <span className="text-white">
                ★
              </span>

            </div>

          );
        }
      )}

    </div>
  );
}