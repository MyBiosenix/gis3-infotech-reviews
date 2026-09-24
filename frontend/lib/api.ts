const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export type ReviewSource = 'GIS3 Infotech' | 'Google' | 'Trustpilot' | 'Glassdoor';
export type ReviewStatus = 'pending' | 'approved' | 'rejected';
export type EmploymentStatus = '' | 'Current Employee' | 'Former Employee' | 'Intern' | 'Freelancer' | 'Contract Employee';
export type EmploymentDuration = '' | 'Less than 6 months' | '6 months - 1 year' | '1 - 2 years' | '2 - 5 years' | 'More than 5 years';

export type ReviewRatings = {
  workEnvironment: number;
  salaryBenefits: number;
  management: number;
  careerGrowth: number;
};

export type EmploymentDetails = {
  jobTitle: string;
  employmentStatus: EmploymentStatus;
  duration: EmploymentDuration;
};

export type Review = {
  _id: string;
  companyName: string;
  ratings: ReviewRatings;
  overallRating: number;
  employmentDetails: EmploymentDetails;
  experience: string;
  author: string;
  isAnonymous: boolean;
  source: ReviewSource;
  status: ReviewStatus;
  rejectionReason: string;
  createdAt: string;
  updatedAt: string;
  displayAuthor?: string;
};

export type AverageRatings = {
  workEnvironment: number;
  salaryBenefits: number;
  management: number;
  careerGrowth: number;
};

export type ReviewStats = {
  averageOverallRating: number;
  averageRatings: AverageRatings;
  count: number;
};

export type ReviewsPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type ReviewsResponse = {
  success: boolean;
  reviews: Review[];
  stats: ReviewStats;
  pagination: ReviewsPagination;
};

export type GetReviewsOptions = {
  companyName?: string;
  source?: ReviewSource;
  status?: ReviewStatus;
  employmentStatus?: Exclude<EmploymentStatus, ''>;
  minRating?: number;
  page?: number;
  limit?: number;
};

export async function getReviews(options: GetReviewsOptions = {}): Promise<ReviewsResponse> {
  const params = new URLSearchParams();
  if (options.companyName?.trim()) params.set('companyName', options.companyName.trim());
  if (options.source) params.set('source', options.source);
  if (options.status) params.set('status', options.status);
  if (options.employmentStatus) params.set('employmentStatus', options.employmentStatus);
  if (typeof options.minRating === 'number' && options.minRating >= 1 && options.minRating <= 5) {
    params.set('minRating', String(options.minRating));
  }
  if (typeof options.page === 'number' && options.page > 0) params.set('page', String(options.page));
  if (typeof options.limit === 'number' && options.limit > 0) params.set('limit', String(options.limit));

  const qs = params.toString();
  const response = await fetch(`${API_URL}/reviews${qs ? `?${qs}` : ''}`, {
    method: 'GET',
    cache: 'no-store',
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) throw await createApiError(response, 'Failed to load reviews');
  return response.json() as Promise<ReviewsResponse>;
}

export type NewReview = {
  companyName: string;
  ratings: ReviewRatings;
  employmentDetails?: {
    jobTitle?: string;
    employmentStatus?: EmploymentStatus;
    duration?: EmploymentDuration;
  };
  experience: string;
  author?: string;
  isAnonymous: boolean;
  source: ReviewSource;
};

export type CreateReviewResponse = { success: boolean; message: string; review: Review };

export async function createReview(data: NewReview): Promise<CreateReviewResponse> {
  const response = await fetch(`${API_URL}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw await createApiError(response, 'Failed to submit review');
  return response.json() as Promise<CreateReviewResponse>;
}

function adminHeaders(adminKey: string, withJson = false): HeadersInit {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'x-admin-key': adminKey,
  };
  if (withJson) headers['Content-Type'] = 'application/json';
  return headers;
}

export type AdminGetReviewsOptions = {
  status?: ReviewStatus | 'all';
  source?: ReviewSource | 'all';
  page?: number;
  limit?: number;
};

export async function getAdminReviews(adminKey: string, options: AdminGetReviewsOptions = {}): Promise<ReviewsResponse> {
  const params = new URLSearchParams();
  if (options.status && options.status !== 'all') params.set('status', options.status);
  if (options.source && options.source !== 'all') params.set('source', options.source);
  if (options.page) params.set('page', String(options.page));
  if (options.limit) params.set('limit', String(options.limit));

  const response = await fetch(`${API_URL}/admin/reviews${params.toString() ? `?${params}` : ''}`, {
    method: 'GET',
    cache: 'no-store',
    headers: adminHeaders(adminKey),
  });
  if (!response.ok) throw await createApiError(response, 'Failed to load admin reviews');
  return response.json() as Promise<ReviewsResponse>;
}

export type AdminReviewUpdate = {
  companyName: string;
  ratings: ReviewRatings;
  employmentDetails: EmploymentDetails;
  experience: string;
  author: string;
  isAnonymous: boolean;
  source: ReviewSource;
};

export async function updateAdminReview(adminKey: string, id: string, data: AdminReviewUpdate) {
  const response = await fetch(`${API_URL}/admin/reviews/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: adminHeaders(adminKey, true),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw await createApiError(response, 'Failed to update review');
  return response.json() as Promise<{ success: boolean; message: string; review: Review }>;
}

export async function updateAdminReviewStatus(
  adminKey: string,
  id: string,
  status: ReviewStatus,
  rejectionReason = ''
) {
  const response = await fetch(`${API_URL}/admin/reviews/${encodeURIComponent(id)}/status`, {
    method: 'PATCH',
    headers: adminHeaders(adminKey, true),
    body: JSON.stringify({ status, rejectionReason }),
  });
  if (!response.ok) throw await createApiError(response, 'Failed to update review status');
  return response.json() as Promise<{ success: boolean; message: string; review: Review }>;
}

export async function deleteAdminReview(adminKey: string, id: string) {
  const response = await fetch(`${API_URL}/admin/reviews/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: adminHeaders(adminKey),
  });
  if (!response.ok) throw await createApiError(response, 'Failed to delete review');
  return response.json() as Promise<{ success: boolean; message: string }>;
}

export function normalizeFiveStarRating(rating: number): number {
  return Math.max(1, Math.min(5, Math.round(rating)));
}

export function formatRating(rating: number): string {
  return Number.isFinite(rating) ? rating.toFixed(1) : '0.0';
}

type ApiErrorBody = { error?: string; message?: string; errors?: Record<string, string> };

async function createApiError(response: Response, fallbackMessage: string): Promise<Error> {
  const body = (await response.json().catch(() => null)) as ApiErrorBody | null;
  const validationMessages = body?.errors ? Object.values(body.errors) : [];
  return new Error(
    validationMessages.length > 0
      ? validationMessages.join(', ')
      : body?.message || body?.error || fallbackMessage
  );
}
