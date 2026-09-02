'use client';

import { useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  Loader2,
  Star,
  X,
} from 'lucide-react';

import {
  createReview,
  type EmploymentDuration,
  type EmploymentStatus,
  type NewReview,
  type ReviewRatings,
} from '@/lib/api';

type Props = {
  onCreated: () => void;
  onClose?: () => void;
};

type RatingKey = keyof ReviewRatings;

const ratingFields: Array<{
  key: RatingKey;
  label: string;
}> = [
  {
    key: 'workEnvironment',
    label: 'Work Environment',
  },
  {
    key: 'salaryBenefits',
    label: 'Salary & Benefits',
  },
  {
    key: 'management',
    label: 'Management',
  },
  {
    key: 'careerGrowth',
    label: 'Career Growth',
  },
];

const employmentStatusOptions: Array<
  Exclude<EmploymentStatus, ''>
> = [
  'Current Employee',
  'Former Employee',
  'Intern',
  'Freelancer',
  'Contract Employee',
];

const durationOptions: Array<
  Exclude<EmploymentDuration, ''>
> = [
  'Less than 6 months',
  '6 months - 1 year',
  '1 - 2 years',
  '2 - 5 years',
  'More than 5 years',
];

const initialRatings: ReviewRatings = {
  workEnvironment: 0,
  salaryBenefits: 0,
  management: 0,
  careerGrowth: 0,
};

const inputClasses =
  'min-h-[56px] w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-[15px] text-neutral-800 shadow-[0_2px_8px_rgba(20,20,20,0.03)] outline-none transition placeholder:text-neutral-400 hover:border-neutral-300 focus:border-purple-700 focus:ring-4 focus:ring-purple-100 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-500';

export default function ReviewForm({
  onCreated,
  onClose,
}: Props) {
  const [companyName, setCompanyName] = useState('gisinfotech Solutions');
  const [jobTitle, setJobTitle] = useState('');

  const [employmentStatus, setEmploymentStatus] =
    useState<EmploymentStatus>('');

  const [duration, setDuration] =
    useState<EmploymentDuration>('');

  const [experience, setExperience] = useState('');
  const [author, setAuthor] = useState('');
  const [anonymous, setAnonymous] = useState(false);

  const [ratings, setRatings] =
    useState<ReviewRatings>(initialRatings);

  const [hoveredRatings, setHoveredRatings] =
    useState<Partial<ReviewRatings>>({});

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] =
    useState<string | null>(null);

  const [successMessage, setSuccessMessage] =
    useState<string | null>(null);

  function updateRating(
    key: RatingKey,
    value: number
  ) {
    setRatings((previous) => ({
      ...previous,
      [key]: value,
    }));

    setError(null);
  }

  function resetForm() {
    setCompanyName('');
    setJobTitle('');
    setEmploymentStatus('');
    setDuration('');
    setExperience('');
    setAuthor('');
    setAnonymous(false);
    setRatings(initialRatings);
    setHoveredRatings({});
    setError(null);
  }

  function validateForm(): string | null {
    if (!companyName.trim()) {
      return 'Please enter the company name.';
    }

    const missingRating = ratingFields.find(
      ({ key }) => ratings[key] < 1
    );

    if (missingRating) {
      return `Please provide a rating for ${missingRating.label}.`;
    }

    if (!experience.trim()) {
      return 'Please summarize your experience.';
    }

    if (experience.trim().length < 10) {
      return 'Your experience must contain at least 10 characters.';
    }

    if (!anonymous && !author.trim()) {
      return 'Please enter your name or enable anonymous posting.';
    }

    return null;
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError(null);
    setSuccessMessage(null);

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    const payload: NewReview = {
      companyName: companyName.trim(),

      ratings: {
        workEnvironment:
          ratings.workEnvironment,

        salaryBenefits:
          ratings.salaryBenefits,

        management:
          ratings.management,

        careerGrowth:
          ratings.careerGrowth,
      },

      employmentDetails: {
        jobTitle: jobTitle.trim(),
        employmentStatus,
        duration,
      },

      experience: experience.trim(),

      author: anonymous
        ? ''
        : author.trim(),

      isAnonymous: anonymous,

      source: 'GIS3 Infotech',
    };

    try {
      setSubmitting(true);

      const response = await createReview(payload);

      setSuccessMessage(
        response.message ||
          'Your review has been submitted successfully.'
      );

      resetForm();
      onCreated();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong while submitting your review.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f0dcff] px-4 py-10 sm:px-6 lg:px-8">
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-5xl rounded-[28px] bg-white px-5 py-7 shadow-[0_25px_70px_rgba(79,18,128,0.14)] sm:px-8 sm:py-9 lg:px-10 lg:py-10"
      >
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close review form"
            disabled={submitting}
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-neutral-100 text-neutral-800 transition duration-200 hover:bg-neutral-200 focus:outline-none focus:ring-4 focus:ring-purple-100 disabled:cursor-not-allowed disabled:opacity-50 sm:right-8 sm:top-8"
          >
            <X
              size={24}
              strokeWidth={2.2}
            />
          </button>
        )}

        <div className="border-b border-neutral-200 pb-5 pr-14">
          <h2 className="text-[23px] font-semibold tracking-[0.04em] text-neutral-900 sm:text-[28px]">
            Give feedback about this Company
          </h2>

          <p className="mt-2 text-sm leading-6 tracking-[0.03em] text-neutral-500 sm:text-base">
            Share your experience to help others
            make better career decisions.
          </p>
        </div>

        <div className="mt-7">
          <Field
            label="Company Name"
            required
          >
            <input
              type="text"
              value={companyName}
              onChange={(event) => {
                setCompanyName(event.target.value);
                setError(null);
              }}
              placeholder="Enter company name"
              className={inputClasses}
              maxLength={120}
              disabled={submitting}
            />
          </Field>
        </div>

        <section className="mt-8">
          <p className="text-sm font-medium tracking-[0.08em] text-neutral-500 sm:text-base">
            How would you rate your
            experience?
          </p>

          <div className="mt-6 space-y-5">
            {ratingFields.map((field) => (
              <RatingRow
                key={field.key}
                label={field.label}
                value={ratings[field.key]}
                hoveredValue={
                  hoveredRatings[field.key] || 0
                }
                disabled={submitting}
                onChange={(value) =>
                  updateRating(field.key, value)
                }
                onHover={(value) =>
                  setHoveredRatings(
                    (previous) => ({
                      ...previous,
                      [field.key]: value,
                    })
                  )
                }
                onLeave={() =>
                  setHoveredRatings(
                    (previous) => ({
                      ...previous,
                      [field.key]: 0,
                    })
                  )
                }
              />
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h3 className="text-base font-medium tracking-[0.08em] text-neutral-500 sm:text-lg">
            Employment Details{' '}
            <span className="font-normal">
              (Optional)
            </span>
          </h3>

          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <Field label="Job Title">
              <input
                type="text"
                value={jobTitle}
                onChange={(event) =>
                  setJobTitle(event.target.value)
                }
                placeholder="Front End Developer"
                className={inputClasses}
                maxLength={100}
                disabled={submitting}
              />
            </Field>

            <Field label="Employment Status">
              <SelectField<
                EmploymentStatus
              >
                value={employmentStatus}
                onChange={setEmploymentStatus}
                placeholder="Select status"
                options={employmentStatusOptions}
                disabled={submitting}
              />
            </Field>

            <Field label="Duration">
              <SelectField<
                EmploymentDuration
              >
                value={duration}
                onChange={setDuration}
                placeholder="Select duration"
                options={durationOptions}
                disabled={submitting}
              />
            </Field>
          </div>
        </section>

        <section className="mt-8">
          <Field
            label="Summarize your experience"
            required
          >
            <textarea
              value={experience}
              onChange={(event) => {
                setExperience(event.target.value);
                setError(null);
              }}
              placeholder="Share details about your experience..."
              className={`${inputClasses} min-h-[190px] resize-y py-4`}
              minLength={10}
              maxLength={2000}
              disabled={submitting}
            />

            <div className="mt-2 flex items-center justify-between gap-3">
              <span className="text-xs text-neutral-400">
                Minimum 10 characters
              </span>

              <span className="text-xs text-neutral-400">
                {experience.length}/2000
              </span>
            </div>
          </Field>
        </section>

        {!anonymous && (
          <div className="mt-5 max-w-md">
            <Field
              label="Your Name"
              required
            >
              <input
                type="text"
                value={author}
                onChange={(event) => {
                  setAuthor(event.target.value);
                  setError(null);
                }}
                placeholder="Enter your name"
                className={inputClasses}
                maxLength={60}
                disabled={submitting}
              />
            </Field>
          </div>
        )}

        <div className="mt-7 flex items-start gap-3 sm:items-center">
          <button
            type="button"
            role="switch"
            aria-checked={anonymous}
            aria-label="Post review anonymously"
            disabled={submitting}
            onClick={() => {
              setAnonymous((current) => {
                const nextValue = !current;

                if (nextValue) {
                  setAuthor('');
                }

                return nextValue;
              });

              setError(null);
            }}
            className={`relative h-8 w-14 shrink-0 rounded-full transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-purple-100 disabled:cursor-not-allowed disabled:opacity-60 ${
              anonymous
                ? 'bg-[#3f007d]'
                : 'bg-neutral-200'
            }`}
          >
            <span
              className={`absolute left-0 top-1 h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-200 ${
                anonymous
                  ? 'translate-x-7'
                  : 'translate-x-1'
              }`}
            />
          </button>

          <p className="pt-1 text-sm leading-6 text-neutral-500 sm:pt-0 sm:text-base">
            <span className="font-semibold text-neutral-800">
              Post anonymously
            </span>{' '}
            (Your identity will not be shared
            publicly)
          </p>
        </div>

        {error && (
          <div
            role="alert"
            aria-live="assertive"
            className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
          >
            {error}
          </div>
        )}

        {successMessage && (
          <div
            role="status"
            aria-live="polite"
            className="mt-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm leading-6 text-green-700"
          >
            <CheckCircle2
              size={20}
              className="mt-0.5 shrink-0"
            />

            <span>{successMessage}</span>
          </div>
        )}

        <div className="mt-9 flex justify-center">
          <button
            type="submit"
            disabled={submitting}
            className="flex min-h-[56px] w-full max-w-[330px] items-center justify-center gap-2 rounded-lg bg-[#3f007d] px-8 py-3.5 text-base font-semibold text-white shadow-[0_12px_25px_rgba(63,0,125,0.22)] transition duration-200 hover:bg-[#52009f] focus:outline-none focus:ring-4 focus:ring-purple-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting && (
              <Loader2
                size={19}
                className="animate-spin"
              />
            )}

            {submitting
              ? 'Submitting...'
              : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
}

type FieldProps = {
  label: string;
  required?: boolean;
  children: React.ReactNode;
};

function Field({
  label,
  required = false,
  children,
}: FieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-neutral-700">
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </span>

      {children}
    </label>
  );
}

type RatingRowProps = {
  label: string;
  value: number;
  hoveredValue: number;
  disabled?: boolean;
  onChange: (value: number) => void;
  onHover: (value: number) => void;
  onLeave: () => void;
};

function RatingRow({
  label,
  value,
  hoveredValue,
  disabled = false,
  onChange,
  onHover,
  onLeave,
}: RatingRowProps) {
  const visibleRating =
    hoveredValue || value;

  return (
    <div className="grid items-center gap-3 sm:grid-cols-[minmax(220px,1fr)_auto]">
      <div>
        <p className="text-base font-semibold tracking-[0.03em] text-neutral-800 sm:text-lg">
          {label}
        </p>

        {value > 0 && (
          <p className="mt-1 text-xs text-neutral-400 sm:hidden">
            {value} out of 5
          </p>
        )}
      </div>

      <div
        className="flex items-center gap-1 sm:gap-2"
        onMouseLeave={onLeave}
      >
        {[1, 2, 3, 4, 5].map(
          (number) => {
            const active =
              number <= visibleRating;

            return (
              <button
                key={number}
                type="button"
                disabled={disabled}
                onClick={() =>
                  onChange(number)
                }
                onMouseEnter={() =>
                  onHover(number)
                }
                aria-label={`${label}: ${number} out of 5 stars`}
                aria-pressed={
                  number === value
                }
                className="rounded-md p-0.5 transition duration-150 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Star
                  size={29}
                  strokeWidth={1.8}
                  className={`transition-colors duration-150 ${
                    active
                      ? 'fill-[#f7b928] text-[#f7b928]'
                      : 'fill-neutral-200 text-neutral-200'
                  }`}
                />
              </button>
            );
          }
        )}

        {value > 0 && (
          <span className="ml-2 hidden min-w-[45px] text-sm font-medium text-neutral-500 sm:block">
            {value}/5
          </span>
        )}
      </div>
    </div>
  );
}

type SelectFieldProps<T extends string> = {
  value: T;
  placeholder: string;
  options: readonly Exclude<T, ''>[];
  disabled?: boolean;
  onChange: (value: T) => void;
};

function SelectField<T extends string>({
  value,
  placeholder,
  options,
  disabled = false,
  onChange,
}: SelectFieldProps<T>) {
  return (
    <div className="relative">
      <select
        value={value}
        disabled={disabled}
        onChange={(event) =>
          onChange(event.target.value as T)
        }
        className={`${inputClasses} appearance-none pr-12`}
      >
        <option value="">
          {placeholder}
        </option>

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>

      <ChevronDown
        size={19}
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500"
      />
    </div>
  );
}