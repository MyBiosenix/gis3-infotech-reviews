"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

import {
  FaCheckCircle,
  FaClock,
  FaGlobe,
  FaMapMarkerAlt,
  FaPhone,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
} from "react-icons/fa";

import { MdReviews } from "react-icons/md";

import Navbar from "@/components/Navbar";
import { getReviews, type Review } from "@/lib/api";

import mymap from "@/assets/mymap.png";
import building from "@/assets/building.webp";
import indooroffice from "@/assets/indooroffice.jpg";

import user4 from "@/assets/user4.jpeg";
import profile_02 from "@/assets/profile_02.png";
import profile_03 from "@/assets/profile_03.png";
import profile_04 from "@/assets/profile_04.png";
import profile_06 from "@/assets/profile_06.png";
import profile_05 from "@/assets/profile_05.png";
import profile_08 from "@/assets/profile_08.png";
import profile_10 from "@/assets/profile_10.png";

import review4 from "@/assets/review4.jpg";
import review9 from "@/assets/review9.jpg";
import review6 from "@/assets/review6.jpg";
import review5 from "@/assets/review5.jpg";
import review8 from "@/assets/review8.jpg";

import user10 from "@/assets/user10.jpeg";

/* =========================================================
   TYPES
========================================================= */

type ReviewItem = {
  name: string;
  image: StaticImageData;
  review: string;
  time: string;
  rating: number;
  reply?: string;
};

type WorkingHour = {
  day: string;
  time: string;
  isToday: boolean;
};

/* =========================================================
   STATIC REVIEWS
========================================================= */

const allReviews: ReviewItem[] = [
  {
    name: "Vishal Yadav",
    image: profile_02,
    rating: 4.5,
    review:
      "A trustworthy platform—easy onboarding and genuine work opportunities.",
    time: "1 Month ago",
    reply: "Thank you for your valuable feedback.",
  },

  {
    name: "Sakshi Jadhav",
    image: profile_03,
    rating: 4,
    review:
      "I appreciate how smooth and transparent the entire process is, from applying to getting paid.",
    time: "1 Month ago",
  },

  {
    name: "Mayuri Chouhan",
    image: user4,
    rating: 5,
    review:
      "The support team is quick to respond and the projects are legit. Great experience so far.",
    time: "1 Month ago",
  },

  {
    name: "Sameer Shaikh",
    image: profile_04,
    rating: 4,
    review:
      "One of the few freelancing sites that actually delivers on its promises. Highly recommended.",
    time: "1 Month ago",
  },

  {
    name: "Rupali Nikam",
    image: profile_06,
    rating: 4.5,
    review:
      "Great experience! I've completed multiple tasks and every payment came through without delay.",
    time: "1 Month ago",
  },

  {
    name: "Pranit Pandey",
    image: profile_05,
    rating: 3.5,
    review:
      "A fantastic platform for anyone starting out in remote work. Clear instructions and helpful team.",
    time: "1 Month ago",
  },

  {
    name: "Pranita Sharma",
    image: profile_08,
    rating: 5,
    review:
      "Simple, efficient, and trustworthy. Finally found a freelancing space that respects time and skill.",
    time: "1 Month ago",
  },

  {
    name: "Amit Roy",
    image: profile_10,
    rating: 3,
    review: "This is a legitimate work-from-home opportunity.",
    time: "18 days ago",
  },

  {
    name: "Rohan Desai",
    image: review4,
    rating: 4,
    review: "Genuine payment and real work.",
    time: "27 days ago",
  },

  {
    name: "Preeti Singh",
    image: review9,
    rating: 3.5,
    review: "Supportive team and smooth onboarding.",
    time: "1 Month ago",
  },

  {
    name: "Raju Karira",
    image: user10,
    rating: 5,
    review:
      "Great experience so far! Completed 3 projects and got paid on time each time. Totally legit.",
    time: "2 days ago",
    reply: "Thank you, Raju! Glad to know you had a great experience.",
  },

  {
    name: "Kajal Kamra",
    image: review6,
    rating: 4.5,
    review:
      "This isn’t just a platform—it’s a supportive community for remote job seekers. I highly appreciate that.",
    time: "12 days ago",
    reply: "Thank you for your valuable feedback.",
  },

  {
    name: "Vivek Sharma",
    image: review5,
    rating: 4,
    review: "Super easy to use. Good for beginners.",
    time: "13 days ago",
  },

  {
    name: "Neha Gupta",
    image: review8,
    rating: 5,
    review: "Excellent experience with this freelancing service.",
    time: "17 days ago",
  },
];

/* =========================================================
   WORKING HOURS
========================================================= */

const hoursMap: Record<string, string> = {
  Monday: "10:00 AM – 7:00 PM",
  Tuesday: "10:00 AM – 7:00 PM",
  Wednesday: "10:00 AM – 7:00 PM",
  Thursday: "10:00 AM – 7:00 PM",
  Friday: "10:00 AM – 7:00 PM",
  Saturday: "10:00 AM – 7:00 PM",
  Sunday: "Closed",
};

function getOrderedWeekDays(): WorkingHour[] {
  const weekDays = Object.keys(hoursMap);

  const todayIndex = new Date().getDay();

  const jsToCustomIndex = [6, 0, 1, 2, 3, 4, 5];

  const todayCustomIndex = jsToCustomIndex[todayIndex];

  const ordered: WorkingHour[] = [
    {
      day: weekDays[todayCustomIndex],
      time: hoursMap[weekDays[todayCustomIndex]],
      isToday: true,
    },
  ];

  for (let i = 1; i < 7; i++) {
    const nextIndex = (todayCustomIndex + i) % 7;

    ordered.push({
      day: weekDays[nextIndex],
      time: hoursMap[weekDays[nextIndex]],
      isToday: false,
    });
  }

  return ordered;
}

/* =========================================================
   STAR RATING COMPONENT
========================================================= */

function StarRating({
  rating,
  size = "text-[13px]",
}: {
  rating: number;
  size?: string;
}) {
  return (
    <div
      className={`flex items-center gap-[2px] ${size} text-[#f5ad17]`}
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        if (rating >= star) {
          return <FaStar key={star} />;
        }

        if (rating >= star - 0.5) {
          return <FaStarHalfAlt key={star} />;
        }

        return <FaRegStar key={star} className="text-slate-300" />;
      })}
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

function ReviewsComp() {
  const router = useRouter();

  const [visibleCount, setVisibleCount] = useState(5);

  const [showModal, setShowModal] = useState(false);

  /*
   * Approved Google reviews coming from database.
   */
  const [approvedReviews, setApprovedReviews] = useState<Review[]>([]);

  const orderedWeekDays = useMemo(() => getOrderedWeekDays(), []);

  const todayHours = orderedWeekDays[0];

  /* =========================================================
     FETCH APPROVED GOOGLE REVIEWS
  ========================================================= */

  useEffect(() => {
    let active = true;

    const loadApprovedReviews = async () => {
      try {
        const data = await getReviews({
          source: "Google",
          limit: 50,
        });

        if (active) {
          setApprovedReviews(data.reviews || []);
        }
      } catch (error) {
        console.error(
          "Unable to load approved Google reviews:",
          error
        );
      }
    };

    loadApprovedReviews();

    return () => {
      active = false;
    };
  }, []);

  /*
   * Static reviews + database approved Google reviews
   */
  const totalReviews =
    allReviews.length + approvedReviews.length;

  /* =========================================================
     LOAD MORE
  ========================================================= */

  const loadMoreReviews = () => {
    setVisibleCount((prev) =>
      Math.min(prev + 5, totalReviews)
    );
  };

  return (
    <>
      <Navbar />

      <section className="min-h-screen bg-[#f7f8fa]">

        {/* =================================================
            HERO
        ================================================= */}

        <div className="border-b border-slate-200 bg-white">

          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">

            <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">

              <div className="max-w-3xl">

                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5">

                  <FaStar className="text-xs text-[#ff5b02]" />

                  <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#ff5b02]">
                    Customer Reviews
                  </span>

                </div>

                <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">

                  See what people are saying about{" "}

                  <span className="text-[#ff5b02]">
                    GIS3 Infotech
                  </span>

                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">

                  Explore experiences and feedback shared by people who have
                  worked with GIS3 Infotech.

                </p>

              </div>

              <Link
                href="/reviews/new"
                className="inline-flex w-full shrink-0 items-center justify-center gap-2.5 rounded-xl bg-[#ff5b02] px-5 py-3.5 text-sm font-bold text-white shadow-[0_10px_30px_rgba(255,91,2,0.22)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#e94f00] hover:shadow-[0_14px_35px_rgba(255,91,2,0.28)] sm:w-auto"
              >
                <MdReviews className="text-lg" />

                Write a Review
              </Link>

            </div>

          </div>

        </div>

        {/* =================================================
            MAIN
        ================================================= */}

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-7 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_370px] lg:gap-8 lg:px-8 lg:py-12">

          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <main className="min-w-0">

            {/* =================================================
                RATING OVERVIEW
            ================================================= */}

            <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_5px_25px_rgba(15,23,42,0.04)]">

              <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">

                {/* Score */}

                <div className="flex items-center gap-4 p-5 sm:p-6">

                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#ff5b02] text-2xl font-black text-white shadow-[0_8px_22px_rgba(255,91,2,0.2)]">
                    4.2
                  </div>

                  <div>

                    <StarRating
                      rating={4}
                      size="text-[15px]"
                    />

                    <p className="mt-2 text-xs font-medium text-slate-500">
                      376 customer reviews
                    </p>

                  </div>

                </div>

                {/* Customer feedback */}

                <div className="flex items-center gap-4 p-5 sm:p-6">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50">

                    <FaCheckCircle className="text-xl text-[#ff5b02]" />

                  </div>

                  <div>

                    <p className="text-sm font-bold text-slate-800">
                      Customer feedback
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Experiences shared by our community.
                    </p>

                  </div>

                </div>

                {/* Share */}

                <div className="flex items-center gap-4 p-5 sm:p-6">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50">

                    <MdReviews className="text-xl text-[#ff5b02]" />

                  </div>

                  <div>

                    <p className="text-sm font-bold text-slate-800">
                      Share your experience
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Help others by leaving your feedback.
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* =================================================
                REVIEW HEADING
            ================================================= */}

            <div className="mb-4 flex items-center justify-between">

              <div>

                <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                  Customer Reviews
                </h2>

                <p className="mt-1 text-xs text-slate-500 sm:text-sm">

                  Showing{" "}
                  {Math.min(
                    visibleCount,
                    totalReviews
                  )}{" "}
                  of {totalReviews} reviews

                </p>

              </div>

            </div>

            {/* =================================================
                REVIEWS
            ================================================= */}

            <div className="space-y-4">

              {/* =================================================
                  STATIC REVIEWS
              ================================================= */}

              {allReviews
                .slice(
                  0,
                  Math.min(
                    visibleCount,
                    allReviews.length
                  )
                )
                .map((item, index) => (

                  <article
                    key={`${item.name}-${index}`}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_18px_rgba(15,23,42,0.035)] transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-[0_12px_30px_rgba(15,23,42,0.07)] sm:p-6"
                  >

                    {/* Reviewer */}

                    <div className="flex items-start justify-between gap-4">

                      <div className="flex min-w-0 items-center gap-3.5">

                        {/* Profile image */}

                        <div className="relative shrink-0">

                          <Image
                            src={item.image}
                            alt={item.name}
                            width={54}
                            height={54}
                            className="h-[50px] w-[50px] rounded-full border-2 border-white object-cover shadow-sm sm:h-[54px] sm:w-[54px]"
                          />

                          <span className="absolute -bottom-0.5 -right-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 border-white bg-[#ff5b02]">

                            <FaCheckCircle className="text-[9px] text-white" />

                          </span>

                        </div>

                        <div className="min-w-0">

                          <div className="flex flex-wrap items-center gap-2">

                            <h3 className="truncate text-sm font-bold text-slate-900 sm:text-[15px]">
                              {item.name}
                            </h3>

                            <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#ff5b02]">
                              Verified
                            </span>

                          </div>

                          {/* Rating */}

                          <div className="mt-1.5 flex flex-wrap items-center gap-2">

                            <StarRating rating={item.rating} />

                            <span className="text-[11px] font-semibold text-slate-500">
                              {item.rating.toFixed(1)}
                            </span>

                            <span className="text-slate-300">
                              •
                            </span>

                            <span className="text-[11px] text-slate-400">
                              {item.time}
                            </span>

                          </div>

                        </div>

                      </div>

                      {/* Desktop rating */}

                      <div className="hidden rounded-lg bg-slate-50 px-2.5 py-1 text-[10px] font-semibold text-slate-500 sm:block">

                        {item.rating.toFixed(1)}

                      </div>

                    </div>

                    {/* Review */}

                    <p className="mt-5 text-[13px] leading-7 text-slate-600 sm:text-sm">

                      “{item.review}”

                    </p>

                    {/* Company response */}

                    {item.reply && (

                      <div className="mt-5 rounded-xl border border-orange-100 bg-orange-50/60 p-4">

                        <div className="flex items-center gap-2">

                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ff5b02] text-[10px] font-black text-white">
                            S
                          </div>

                          <div>

                            <p className="text-xs font-bold text-slate-800">
                              GIS3 Infotech
                            </p>

                            <p className="text-[10px] text-slate-400">
                              Company response
                            </p>

                          </div>

                        </div>

                        <p className="mt-3 text-xs leading-6 text-slate-600 sm:text-[13px]">

                          {item.reply}

                        </p>

                      </div>

                    )}

                  </article>

                ))}

              {/* =================================================
                  DATABASE APPROVED GOOGLE REVIEWS

                  These start ONLY after all static reviews.
                  So they appear after Neha Gupta.
              ================================================= */}

              {visibleCount > allReviews.length &&
                approvedReviews
                  .slice(
                    0,
                    Math.max(
                      0,
                      visibleCount - allReviews.length
                    )
                  )
                  .map((review) => {

                    const rating = Number(
                      review.overallRating || 0
                    );

                    const reviewerName =
                      review.author?.trim() ||
                      "Anonymous";

                    const firstLetter =
                      reviewerName
                        .charAt(0)
                        .toUpperCase();

                    return (

                      <article
                        key={review._id}
                        className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_18px_rgba(15,23,42,0.035)] transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-[0_12px_30px_rgba(15,23,42,0.07)] sm:p-6"
                      >

                        {/* Reviewer */}

                        <div className="flex items-start justify-between gap-4">

                          <div className="flex min-w-0 items-center gap-3.5">

                            {/* Dynamic profile circle */}

                            <div className="relative shrink-0">

                              <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full border-2 border-white bg-[#ff5b02] text-lg font-black text-white shadow-sm sm:h-[54px] sm:w-[54px]">

                                {firstLetter}

                              </div>

                              <span className="absolute -bottom-0.5 -right-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 border-white bg-[#ff5b02]">

                                <FaCheckCircle className="text-[9px] text-white" />

                              </span>

                            </div>

                            <div className="min-w-0">

                              <div className="flex flex-wrap items-center gap-2">

                                <h3 className="truncate text-sm font-bold text-slate-900 sm:text-[15px]">

                                  {reviewerName}

                                </h3>

                                <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#ff5b02]">

                                  Verified

                                </span>

                              </div>

                              {/* Dynamic review rating */}

                              <div className="mt-1.5 flex flex-wrap items-center gap-2">

                                <StarRating rating={rating} />

                                <span className="text-[11px] font-semibold text-slate-500">

                                  {rating.toFixed(1)}

                                </span>

                                <span className="text-slate-300">
                                  •
                                </span>

                                <span className="text-[11px] text-slate-400">

                                  Recently

                                </span>

                              </div>

                            </div>

                          </div>

                          {/* Desktop rating */}

                          <div className="hidden rounded-lg bg-slate-50 px-2.5 py-1 text-[10px] font-semibold text-slate-500 sm:block">

                            {rating.toFixed(1)}

                          </div>

                        </div>

                        {/* Dynamic review */}

                        <p className="mt-5 whitespace-pre-wrap text-[13px] leading-7 text-slate-600 sm:text-sm">

                          “{review.experience}”

                        </p>

                      </article>

                    );

                  })}

            </div>

            {/* =================================================
                LOAD MORE
            ================================================= */}

            {visibleCount < totalReviews && (

              <div className="mt-7 flex justify-center">

                <button
                  type="button"
                  onClick={loadMoreReviews}
                  className="inline-flex min-w-[190px] items-center justify-center rounded-xl border border-[#ff5b02] bg-white px-6 py-3 text-sm font-bold text-[#ff5b02] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#ff5b02] hover:text-white hover:shadow-[0_8px_20px_rgba(255,91,2,0.18)]"
                >
                  Load More Reviews
                </button>

              </div>

            )}

          </main>

          {/* =================================================
              RIGHT SIDEBAR
          ================================================= */}

          <aside className="h-fit overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] lg:sticky lg:top-24">

            {/* =================================================
                GALLERY
            ================================================= */}

            <div className="grid h-[230px] grid-cols-[1.35fr_0.75fr] gap-1.5 bg-slate-100 p-1.5">

              <div className="group relative overflow-hidden rounded-l-xl">

                <Image
                  src={building}
                  alt="GIS3 Infotech office"
                  fill
                  sizes="(max-width: 1024px) 60vw, 250px"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />

              </div>

              <div className="grid min-h-0 grid-rows-2 gap-1.5">

                <div className="group relative min-h-0 overflow-hidden rounded-tr-xl">

                  <Image
                    src={indooroffice}
                    alt="GIS3 Infotech office interior"
                    fill
                    sizes="150px"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />

                </div>

                <div className="group relative min-h-0 overflow-hidden rounded-br-xl">

                  <Image
                    src={mymap}
                    alt="GIS3 Infotech office location"
                    fill
                    sizes="150px"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-slate-950/45" />

                  <div className="absolute inset-0 z-10 flex items-center justify-center">

                    <span className="flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-bold text-slate-800 shadow">

                      <FaMapMarkerAlt className="text-[#ff5b02]" />

                      Location

                    </span>

                  </div>

                </div>

              </div>

            </div>

            {/* =================================================
                COMPANY DETAILS
            ================================================= */}

            <div className="p-5 sm:p-6">

              <div className="flex items-start justify-between gap-4">

                <div>

                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">

                    Company profile

                  </span>

                  <div className="mt-1.5 flex items-center gap-2">

                    <h2 className="text-xl font-extrabold text-slate-900">

                      GIS3 Infotech

                    </h2>

                    <FaCheckCircle className="shrink-0 text-[15px] text-[#ff5b02]" />

                  </div>

                  <div className="mt-2 flex items-center gap-2">

                    <StarRating
                      rating={4}
                      size="text-xs"
                    />

                    <span className="text-[11px] text-slate-500">

                      376 reviews

                    </span>

                  </div>

                </div>

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-sm font-black text-white">

                  4.2

                </div>

              </div>

              {/* =================================================
                  CTA
              ================================================= */}

              <Link
                href="/reviews/new"
                className="mt-5 inline-flex w-full shrink-0 items-center justify-center gap-2.5 rounded-xl bg-[#ff5b02] px-5 py-3.5 text-sm font-bold text-white shadow-[0_10px_30px_rgba(255,91,2,0.22)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#e94f00] hover:shadow-[0_14px_35px_rgba(255,91,2,0.28)]"
              >

                <MdReviews className="text-lg" />

                Write a Review

              </Link>

              {/* =================================================
                  QUICK ACTIONS
              ================================================= */}

              <div className="mt-3 grid grid-cols-2 gap-2.5">

                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50"
                >

                  <FaGlobe className="text-[#ff5b02]" />

                  Website

                </button>

                <a
                  href="tel:+91XXXXXXXXXX"
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50"
                >

                  <FaPhone className="text-[#ff5b02]" />

                  Contact

                </a>

              </div>

              <div className="my-5 h-px bg-slate-100" />

              {/* =================================================
                  ADDRESS
              ================================================= */}

              <div className="flex gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50">

                  <FaMapMarkerAlt className="text-sm text-[#ff5b02]" />

                </div>

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">

                    Office Address

                  </p>

                  <p className="mt-1.5 text-xs leading-6 text-slate-600">

                    417, B Wing, Mittal Tower, M G Road,
                    Bangalore - 560001, India

                  </p>

                </div>

              </div>

              {/* =================================================
                  WORKING HOURS
              ================================================= */}

              <div className="mt-5 flex gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50">

                  <FaClock className="text-sm text-[#ff5b02]" />

                </div>

                <div className="min-w-0 flex-1">

                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">

                    Working Hours

                  </p>

                  <details className="group mt-1.5">

                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">

                      <div>

                        <p className="text-xs font-bold text-slate-800">

                          {todayHours.day}

                        </p>

                        <p
                          className={`mt-1 text-[11px] font-medium ${
                            todayHours.time === "Closed"
                              ? "text-red-500"
                              : "text-emerald-600"
                          }`}
                        >

                          {todayHours.time}

                        </p>

                      </div>

                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-sm font-medium text-slate-600 transition group-open:rotate-45">

                        +

                      </span>

                    </summary>

                    <div className="mt-3 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">

                      {orderedWeekDays
                        .slice(1)
                        .map(({ day, time }) => (

                          <div
                            key={day}
                            className="flex items-center justify-between border-b border-slate-100 px-3 py-2.5 text-[11px] last:border-none"
                          >

                            <span className="text-slate-500">

                              {day}

                            </span>

                            <span
                              className={
                                time === "Closed"
                                  ? "font-semibold text-red-500"
                                  : "font-semibold text-slate-700"
                              }
                            >

                              {time}

                            </span>

                          </div>

                        ))}

                    </div>

                  </details>

                </div>

              </div>

              {/* =================================================
                  CUSTOMER SUPPORT
              ================================================= */}

              <div className="mt-6 rounded-xl border border-orange-100 bg-orange-50 p-4">

                <div className="flex gap-3">

                  <FaCheckCircle className="mt-0.5 shrink-0 text-base text-[#ff5b02]" />

                  <div>

                    <p className="text-xs font-bold text-slate-800">

                      Customer Support

                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-slate-500">

                      Dedicated assistance and a transparent process
                      for our community.

                    </p>

                  </div>

                </div>

              </div>

            </div>

          </aside>

        </div>

        {/* =================================================
            REVIEW MODAL
        ================================================= */}

        {showModal && (

          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-[2px]"
            onClick={() => setShowModal(false)}
          >

            <div
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-7"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              <div className="flex items-start justify-between gap-4">

                <div>

                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#ff5b02]">

                    Customer Feedback

                  </span>

                  <h3 className="mt-1.5 text-xl font-extrabold text-slate-900">

                    Share your experience

                  </h3>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-lg text-slate-500 transition hover:bg-slate-200"
                  aria-label="Close review modal"
                >

                  ×

                </button>

              </div>

              <p className="mt-4 text-sm leading-6 text-slate-500">

                You&apos;ll be redirected to the GIS3 Infotech Reviews
                page where you can submit your feedback.

              </p>

              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >

                  Cancel

                </button>

                <Link
                  href="/reviews/new"
                  className="inline-flex w-full shrink-0 items-center justify-center gap-2.5 rounded-xl bg-[#ff5b02] px-5 py-3.5 text-sm font-bold text-white shadow-[0_10px_30px_rgba(255,91,2,0.22)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#e94f00] hover:shadow-[0_14px_35px_rgba(255,91,2,0.28)] sm:w-auto"
                >

                  <MdReviews className="text-lg" />

                  Write a Review

                </Link>

              </div>

            </div>

          </div>

        )}

      </section>

    </>
  );
}

export default ReviewsComp;