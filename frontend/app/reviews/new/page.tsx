'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ReviewForm from '@/components/ReviewForm';

export default function NewReviewPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-court px-4 py-10 md:py-14">
      <div className="mx-auto max-w-xl">
        <Link href="/reviews" className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">
          ← Back to reviews
        </Link>
        <h1 className="mt-3 font-display text-3xl font-bold uppercase tracking-wide text-ink">
          Write a review
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          Click in a score and tell people what to expect.
        </p>

        <div className="mt-6">
          <ReviewForm onCreated={() => router.push('/reviews')} />
        </div>
      </div>
    </main>
  );
}
