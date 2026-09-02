"use client";

import CompanyReviewSummaryPage from "@/components/CompanyReviewSummaryPage";
import Navbar from "@/components/Navbar";
import {
  ArrowUpRight,
  BarChart3,
  ChevronDown,
  ExternalLink,
  Info,
  MessageCircle,
  PenLine,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

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


export default function ReviewPage() {
  return (
    <>
    <Navbar />
    
    <main className="min-h-screen bg-white text-[#1f1f1f]">
      <div className="mx-auto max-w-[1320px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-[1fr_455px]">
          {/* LEFT SECTION */}
          <section className="min-w-0">
            {/* Company header */}
            <div className="flex items-start gap-6">
              {/* Logo box */}
              <div className="flex h-[72px] w-[150px] shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#00b67a]">
                <div className="text-center text-white">
                  <div className="text-xl font-bold">★ Trustpilot</div>
                </div>
              </div>

              <div className="min-w-0">
                <h1 className="text-[38px] font-bold leading-none tracking-tight">
                  {company.name}
                </h1>

                <div className="mt-5 flex flex-wrap items-center gap-3 text-[16px]">
                  <button className="border-b border-black">
                    Reviews {company.reviewCount.toLocaleString()}
                  </button>

                  <span className="text-zinc-400">•</span>

                  <StarBoxes score={company.score} />

                  <span className="text-[17px] font-semibold">
                    {company.score.toFixed(1)}
                  </span>

                  <Info className="h-[18px] w-[18px] text-zinc-500" />
                </div>

                <p className="mt-3 text-[17px] text-[#4054c7]">
                  {company.sourceName}
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  {/* <button className="flex h-[54px] items-center gap-3 rounded-full bg-[#4054cc] px-8 font-semibold text-white transition hover:bg-[#3447b5]">
                    <PenLine className="h-5 w-5" />
                    Write a review
                  </button> */}

                  {/* <button className="flex h-[54px] items-center gap-3 rounded-full border border-[#4054cc] px-8 font-semibold text-[#4054cc] transition hover:bg-[#f7f8ff]">
                    Visit website
                    <ExternalLink className="h-[18px] w-[18px]" />
                  </button> */}
                </div>
              </div>
            </div>

            <div className="my-10 border-t border-[#dedede]" />

            {/* Integrity notice */}
            <button className="flex w-full items-center gap-4 rounded-xl border border-[#ded8cc] bg-[#fcfaf4] px-5 py-5 text-left">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#dce7ff] text-[#2357b8] shadow">
                <ShieldCheck className="h-6 w-6" />
              </div>

              <p className="flex-1 text-[16px] font-semibold">
            Click in your own score, or browse what people are already saying across Trustpilot
              </p>

              <ChevronDown className="h-5 w-5" />
            </button>

       
      
          </section>

          {/* RIGHT SIDEBAR */}
       
        </div>
        
      </div>
       <div>
      <CompanyReviewSummaryPage
      source="Trustpilot"

      />
    </div>
    </main>
</> );
}

function StarBoxes({
  score,
  size = "normal",
}: {
  score: number;
  size?: "small" | "normal";
}) {
  const filled = Math.round(score);

  const sizeClass =
    size === "small"
      ? "h-[21px] w-[21px] text-[12px]"
      : "h-[22px] w-[22px] text-[13px]";

  return (
    <div className="flex gap-[2px]">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className={`flex items-center justify-center ${sizeClass} ${
            index < filled ? "bg-[#00b67a]" : "bg-zinc-300"
          }`}
        >
          <span className="text-white">★</span>
        </div>
      ))}
    </div>
  );
}

function RatingRow({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="grid grid-cols-[52px_1fr] items-center gap-3">
      <span className="text-[14px] text-zinc-700">{label}</span>

      <div className="h-[10px] overflow-hidden rounded-full bg-[#d6d6d6]">
        <div
          className={`h-full rounded-full ${color}`}
          style={{
            width: `${value}%`,
          }}
        />
      </div>
    </div>
  );
}

function SidebarCard({
  icon,
  title,
  description,
  arrow = false,
  external = false,
}: {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  arrow?: boolean;
  external?: boolean;
}) {
  return (<>
    <div className="flex min-h-[112px] items-center gap-4 rounded-2xl border border-[#ddd] bg-white px-5 py-5">
      <div className="flex h-[55px] w-[55px] shrink-0 items-center justify-center rounded-full bg-[#f3f1ed] text-zinc-700">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-[16px] font-semibold leading-6">{title}</h3>

        <div className="mt-1 text-[16px] leading-[1.45] text-zinc-600">
          {description}
        </div>
      </div>

      {arrow && <ChevronDown className="h-5 w-5 shrink-0" />}

      {external && (
        <ArrowUpRight className="h-5 w-5 shrink-0 text-zinc-700" />
      )}
    </div>
   
    </>
  );
}