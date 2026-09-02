const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export type ReviewSource =
  | 'GIS3 Infotech'
  | 'Trustpilot'
  | 'Glassdoor';

export type ReviewStatus =
  | 'pending'
  | 'approved'
  | 'rejected';

export type EmploymentStatus =
  | ''
  | 'Current Employee'
  | 'Former Employee'
  | 'Intern'
  | 'Freelancer'
  | 'Contract Employee';

export type EmploymentDuration =
  | ''
  | 'Less than 6 months'
  | '6 months - 1 year'
  | '1 - 2 years'
  | '2 - 5 years'
  | 'More than 5 years';

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

  /**
   * Calculated automatically by the backend model.
   * Rating range: 1–5.
   */
  overallRating: number;

  employmentDetails: EmploymentDetails;

  experience: string;

  /**
   * For anonymous reviews, the public API returns "Anonymous".
   */
  author: string;

  isAnonymous: boolean;

  source: ReviewSource;

  status: ReviewStatus;

  rejectionReason: string;

  createdAt: string;
  updatedAt: string;

  /**
   * Virtual field returned when Mongoose virtuals are enabled.
   */
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

/**
 * Get reviews with optional filters and pagination.
 */
export async function getReviews(
  options: GetReviewsOptions = {}
): Promise<ReviewsResponse> {
  const params = new URLSearchParams();

  if (options.companyName?.trim()) {
    params.set('companyName', options.companyName.trim());
  }

  if (options.source) {
    params.set('source', options.source);
  }

  if (options.status) {
    params.set('status', options.status);
  }

  if (options.employmentStatus) {
    params.set(
      'employmentStatus',
      options.employmentStatus
    );
  }

  if (
    typeof options.minRating === 'number' &&
    options.minRating >= 1 &&
    options.minRating <= 5
  ) {
    params.set(
      'minRating',
      String(options.minRating)
    );
  }

  if (
    typeof options.page === 'number' &&
    options.page > 0
  ) {
    params.set('page', String(options.page));
  }

  if (
    typeof options.limit === 'number' &&
    options.limit > 0
  ) {
    params.set('limit', String(options.limit));
  }

  const queryString = params.toString();

  const response = await fetch(
    `${API_URL}/reviews${
      queryString ? `?${queryString}` : ''
    }`,
    {
      method: 'GET',
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw await createApiError(
      response,
      'Failed to load reviews'
    );
  }

  return response.json() as Promise<ReviewsResponse>;
}

export type ReviewDetailsResponse = {
  success: boolean;
  review: Review;
};

/**
 * Get one review by MongoDB ID.
 */
export async function getReviewById(
  id: string
): Promise<Review> {
  if (!id.trim()) {
    throw new Error('Review ID is required');
  }

  const response = await fetch(
    `${API_URL}/reviews/${encodeURIComponent(id)}`,
    {
      method: 'GET',
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw await createApiError(
      response,
      'Failed to load review'
    );
  }

  const data =
    (await response.json()) as ReviewDetailsResponse;

  return data.review;
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

  /**
   * Optional only when isAnonymous is true.
   */
  author?: string;

  isAnonymous: boolean;

  source?: ReviewSource;
};

export type CreateReviewResponse = {
  success: boolean;
  message: string;
  review: Review;
};

/**
 * Submit a new review.
 *
 * The backend automatically:
 * - calculates overallRating;
 * - assigns status as pending;
 * - clears the author for anonymous reviews.
 */
export async function createReview(
  data: NewReview
): Promise<CreateReviewResponse> {
  const response = await fetch(`${API_URL}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw await createApiError(
      response,
      'Failed to submit review'
    );
  }

  return response.json() as Promise<CreateReviewResponse>;
}

export type UpdateReviewStatusData = {
  status: ReviewStatus;
  rejectionReason?: string;
};

export type UpdateReviewStatusResponse = {
  success: boolean;
  message: string;
  review: Review;
};

/**
 * Admin: approve, reject, or return a review to pending.
 *
 * Add your authorization token if this route is protected.
 */
export async function updateReviewStatus(
  id: string,
  data: UpdateReviewStatusData,
  token?: string
): Promise<UpdateReviewStatusResponse> {
  if (!id.trim()) {
    throw new Error('Review ID is required');
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_URL}/reviews/${encodeURIComponent(
      id
    )}/status`,
    {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw await createApiError(
      response,
      'Failed to update review status'
    );
  }

  return response.json() as Promise<UpdateReviewStatusResponse>;
}

export type DeleteReviewResponse = {
  success: boolean;
  message: string;
};

/**
 * Admin: permanently delete a review.
 */
export async function deleteReview(
  id: string,
  token?: string
): Promise<DeleteReviewResponse> {
  if (!id.trim()) {
    throw new Error('Review ID is required');
  }

  const headers: HeadersInit = {
    Accept: 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_URL}/reviews/${encodeURIComponent(id)}`,
    {
      method: 'DELETE',
      headers,
    }
  );

  if (!response.ok) {
    throw await createApiError(
      response,
      'Failed to delete review'
    );
  }

  return response.json() as Promise<DeleteReviewResponse>;
}

/**
 * Return a safe 1–5 star value.
 */
export function normalizeFiveStarRating(
  rating: number
): number {
  return Math.max(
    1,
    Math.min(5, Math.round(rating))
  );
}

/**
 * Format a rating with one decimal place.
 *
 * Example:
 * 4       → "4.0"
 * 4.25    → "4.3"
 */
export function formatRating(
  rating: number
): string {
  return Number.isFinite(rating)
    ? rating.toFixed(1)
    : '0.0';
}

type ApiErrorBody = {
  error?: string;
  message?: string;
  errors?: Record<string, string>;
};

/**
 * Extract a useful error message from API responses.
 */
async function createApiError(
  response: Response,
  fallbackMessage: string
): Promise<Error> {
  const body = (await response
    .json()
    .catch(() => null)) as ApiErrorBody | null;

  const validationMessages = body?.errors
    ? Object.values(body.errors)
    : [];

  const message =
    validationMessages.length > 0
      ? validationMessages.join(', ')
      : body?.message ||
        body?.error ||
        fallbackMessage;

  return new Error(message);
}