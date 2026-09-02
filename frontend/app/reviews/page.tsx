import ReviewsDashboardPage from '@/components/ReviewsDashboardPage';

export const metadata = { title: 'Reviews — GIS3 Infotech' };

export default function AllReviewsPage() {
  return (
    <ReviewsDashboardPage
      title="Review"
      accent="#F5A623"
      emptyMessage="No reviews yet — be the first to click in a score."
    />
  );
}
