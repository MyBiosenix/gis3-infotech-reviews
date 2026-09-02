"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  BarChart3,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  PenLine,
  Send,
  MessageCircle,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";

const company = {
  name: "Trustpilot",
  score: 4.4,
  ratingLabel: "Excellent",
  reviewCount: 529000,

  distribution: {
    five: 73,
    four: 7,
    three: 2,
    two: 2,
    one: 12,
  },
};

const topics = [
  {
    title: "User experience",
    description:
      "Reviewers highlight positive aspects of user experience, noting that the platform is simple, easy, and straightforward to use.",
  },
  {
    title: "Website",
    description:
      "Consumers find website to be ambiguous regarding its overall reliability and review moderation. Many people mention the website experience.",
  },
  {
    title: "Service",
    description:
      "Customers highlight their experiences with service, support, reliability, and communication from the company.",
  },
  {
    title: "Customer support",
    description:
      "Reviewers frequently discuss customer support, response times, problem solving, and overall assistance.",
  },
];

const reviews = [
  {
    name: "Tony Hillyard",
    initials: "TH",
    time: "3 days ago",
    rating: 5,
    invited: true,
    text: "Trustpilot appears to be one of the very few mechanisms that a customer can use to get noticed with an injustice. Most website these days seem to be designed to keep the customer at arms length...",
    avatarClass: "bg-[#fff1b8]",
  },
  {
    name: "Russell Finch",
    initials: "RF",
    time: "3 days ago",
    rating: 5,
    invited: true,
    text: "I was pleasantly surprised to see trustpilot put my review in print. It wasn’t a shining review for the Bradford Exchange. If I was successful putting my point across, it showed confusion in collecting...",
    avatarClass: "bg-[#fff1b8]",
  },
  {
    name: "Sheila Smith",
    initials: "SS",
    time: "3 days ago",
    rating: 4,
    invited: false,
    text: "I usually check Trustpilot if I have some doubt about a company. This time, I didn't receive my order. I tried contacting support but my bank eventually helped at the next stage...",
    avatarClass: "bg-[#d6f8db]",
  },
  {
    name: "David Martin",
    initials: "DM",
    time: "4 days ago",
    rating: 5,
    invited: true,
    text: "The platform has been helpful when researching companies before purchasing. Reviews are easy to understand and useful when making decisions.",
    avatarClass: "bg-[#dce8ff]",
  },
];

type ReviewSource = "GIS3 Infotech" | "Trustpilot" | "Glassdoor";

type CompanyReviewSummaryPageProps = {
  source: ReviewSource;
};

export default function CompanyReviewSummaryPage({
  source,
}: CompanyReviewSummaryPageProps) {
  const [activeTab, setActiveTab] = useState("summary");

  return (
    <main className="min-h-screen bg-white text-[#1f1f1f]">
      {/* Sticky top tabs */}
      <div className="sticky top-0 z-40 border-y border-[#dedede] bg-white shadow-[0_3px_9px_rgba(0,0,0,0.12)]">
     
      </div>

      <div className="mx-auto max-w-[1460px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_455px]">
          {/* LEFT */}
          <section className="min-w-0">
            {/* helpful */}
         

            {/* Topic section */}
            <section className="mt-12">
              <h2 className="text-[24px] font-bold">
                What people talk about most
              </h2>

              <div className="relative mt-5">
                <div className="flex gap-5 overflow-x-auto pb-3 pr-16 scrollbar-hide">
                  {topics.map((topic) => (
                    <TopicCard key={topic.title} {...topic} />
                  ))}
                </div>

                <button className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#e8edff] text-[#5470d8] shadow-sm">
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>
            </section>

            {/* Reviews shaping summary */}
            <section className="mt-11">
              <h2 className="text-[24px] font-bold">
                Reviews shaping this summary
              </h2>

              <div className="relative mt-5">
                <div className="flex gap-5 overflow-x-auto pb-4 pr-16 scrollbar-hide">
                  {reviews.map((review, index) => (
                    <ReviewSummaryCard
                      key={`${review.name}-${index}`}
                      review={review}
                    />
                  ))}
                </div>

                <button className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#f1f1f1] text-zinc-500 shadow-sm">
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>
            </section>
          </section>

          {/* RIGHT */}
          <aside className="space-y-4 lg:sticky lg:top-[110px] lg:self-start">
            <RatingCard />

            <SidebarCard
              icon={<Send className="h-6 w-6" />}
              title="Asks customers to review"
              description="This company invites their customers to review, whether positive or negative"
            />

            <SidebarCard
              icon={<MessageCircle className="h-6 w-6" />}
              title="Replied to 36% of negative reviews"
              description={
                <> 
                  Typically replies within 2 weeks
                  <br />
                  <span className="mt-1 inline-block">
                    May use AI-assist with replies
                  </span>
                </>
              }
              dropdown
            />

            <SidebarCard
              icon={<BarChart3 className="h-6 w-6" />}
              title="How this company uses Trustpilot"
              description="See how their reviews and ratings are sourced, scored, and moderated."
              external
            />
          </aside>
        </div>
      </div>
    </main>
  );
}

function TopicCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <article className="w-[380px] shrink-0 rounded-[20px] border border-[#9268ff] bg-gradient-to-b from-[#f0ebff] to-white px-5 py-5 sm:w-[390px]">
      <h3 className="text-[21px] font-semibold text-[#7248bf]">
        {title}
      </h3>

      <p className="mt-3 line-clamp-3 text-[17px] leading-[1.5] text-[#222]">
        {description}
      </p>

      <button className="mt-1 text-[17px] font-medium text-[#4057d5]">
        See more
      </button>
    </article>
  );
}

function ReviewSummaryCard({
  review,
}: {
  review: {
    name: string;
    initials: string;
    time: string;
    rating: number;
    invited: boolean;
    text: string;
    avatarClass: string;
  };
}) {
  return (
    <article className="w-[380px] shrink-0 rounded-[20px] border border-[#ded8cf] bg-white p-5 sm:w-[390px]">
      {/* user */}
      <div className="flex items-center gap-3">
        <div
          className={`flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-full text-[17px] font-semibold ${review.avatarClass}`}
        >
          {review.initials}
        </div>

        <div>
          <h3 className="text-[17px] font-semibold text-[#151515]">
            {review.name}
          </h3>

          <p className="mt-1 text-[15px] text-[#5e5e5e]">
            {review.time}
          </p>
        </div>
      </div>

      {/* stars + invited */}
      <div className="mt-5 flex items-center gap-5">
        <StarBoxes score={review.rating} />

        {review.invited && (
          <span className="flex items-center gap-2 text-[16px] text-[#087b43]">
            <Send className="h-[18px] w-[18px]" />
            Invited
          </span>
        )}
      </div>

      <p className="mt-4 line-clamp-6 text-[17px] leading-[1.5] text-[#111]">
        {review.text}
      </p>

      <button className="mt-1 text-[17px] font-medium text-[#4057d5]">
        See more
      </button>
    </article>
  );
}

function RatingCard() {
  return (
    <div className="overflow-hidden rounded-[20px] border border-[#ddd] bg-white shadow-[0_4px_18px_rgba(0,0,0,0.10)]">
      <div className="grid grid-cols-[125px_1fr] gap-8 px-10 py-10">
        <div>
          <div className="text-[59px] font-bold leading-none">
            {company.score.toFixed(1)}
          </div>

          <p className="mt-2 text-[17px] font-semibold">
            {company.ratingLabel}
          </p>

          <div className="mt-2">
            <StarBoxes score={company.score} />
          </div>

          <p className="mt-3 text-[14px] text-[#555]">
            {Math.round(company.reviewCount / 1000)}K reviews
          </p>
        </div>

        <div className="space-y-[15px] pt-1">
          <RatingRow
            label="5-star"
            value={company.distribution.five}
            color="bg-[#00b67a]"
          />

          <RatingRow
            label="4-star"
            value={company.distribution.four}
            color="bg-[#73cf11]"
          />

          <RatingRow
            label="3-star"
            value={company.distribution.three}
            color="bg-[#f6b800]"
          />

          <RatingRow
            label="2-star"
            value={company.distribution.two}
            color="bg-[#ff8c1a]"
          />

          <RatingRow
            label="1-star"
            value={company.distribution.one}
            color="bg-[#ff3722]"
          />
        </div>
      </div>

      <button className="w-full border-t border-[#ddd] px-6 py-6 text-[16px] text-[#606060] underline underline-offset-4">
        How is the TrustScore calculated?
      </button>
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
      <span className="text-[14px] text-[#555]">{label}</span>

      <div className="h-[10px] overflow-hidden rounded-full bg-[#d5d5d5]">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function StarBoxes({
  score,
}: {
  score: number;
}) {
  const filled = Math.round(score);

  return (
    <div className="flex gap-[2px]">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className={`flex h-[22px] w-[22px] items-center justify-center text-[13px] ${
            index < filled
              ? "bg-[#00b67a]"
              : "bg-[#d5eae3]"
          }`}
        >
          <span className="text-white">★</span>
        </div>
      ))}
    </div>
  );
}

function SidebarCard({
  icon,
  title,
  description,
  dropdown = false,
  external = false,
}: {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  dropdown?: boolean;
  external?: boolean;
}) {
  return (
    <div className="flex min-h-[112px] items-center gap-4 rounded-[20px] border border-[#ddd] bg-white px-5 py-5">
      <div className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-full bg-[#f2f0ed] text-[#444]">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-[16px] font-semibold leading-6 text-[#272727]">
          {title}
        </h3>

        <div className="text-[16px] leading-[1.45] text-[#666]">
          {description}
        </div>
      </div>

      {dropdown && (
        <ChevronDown className="h-5 w-5 shrink-0 text-[#333]" />
      )}

      {external && (
        <ArrowUpRight className="h-5 w-5 shrink-0 text-[#555]" />
      )}
    </div>
  );
}