const express = require('express');
const mongoose = require('mongoose');
const Review = require('../models/Review');
const { requireAdminKey } = require('../middleware/adminAuth');

const router = express.Router();

router.use(requireAdminKey);

const ALLOWED_SOURCES = [
  'GIS3 Infotech',
  'Google',
  'Trustpilot',
  'Glassdoor',
];

const ALLOWED_STATUSES = [
  'pending',
  'approved',
  'rejected',
];

/**
 * GET /api/admin/reviews
 * Admin-only review listing. May return pending and rejected reviews.
 */
router.get('/', async (req, res, next) => {
  try {
    const {
      status,
      source,
      companyName,
      search,
      page = 1,
      limit = 50,
    } = req.query;

    const filter = {};

    if (status && status !== 'all') {
      if (!ALLOWED_STATUSES.includes(status)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid review status',
        });
      }
      filter.status = status;
    }

    if (source && source !== 'all') {
      if (!ALLOWED_SOURCES.includes(source)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid review source',
        });
      }
      filter.source = source;
    }

    if (companyName) {
      filter.companyName = {
        $regex: escapeRegex(String(companyName).trim()),
        $options: 'i',
      };
    }

    if (search) {
      const safeSearch = escapeRegex(String(search).trim());
      if (safeSearch) {
        filter.$or = [
          { companyName: { $regex: safeSearch, $options: 'i' } },
          { author: { $regex: safeSearch, $options: 'i' } },
          { experience: { $regex: safeSearch, $options: 'i' } },
          {
            'employmentDetails.jobTitle': {
              $regex: safeSearch,
              $options: 'i',
            },
          },
        ];
      }
    }

    const parsedPage = Math.max(Number.parseInt(page, 10) || 1, 1);
    const parsedLimit = Math.min(
      Math.max(Number.parseInt(limit, 10) || 50, 1),
      100
    );
    const skip = (parsedPage - 1) * parsedLimit;

    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parsedLimit)
        .lean({ virtuals: true }),
      Review.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      reviews,
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        total,
        totalPages: Math.ceil(total / parsedLimit),
        hasNextPage: skip + reviews.length < total,
        hasPreviousPage: parsedPage > 1,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: 'Invalid review ID' });
    }

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ success: false, error: 'Review not found' });
    }

    res.status(200).json({ success: true, review });
  } catch (err) {
    next(err);
  }
});

/**
 * Edit review content. Saving re-runs validation and recalculates overallRating.
 */
router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: 'Invalid review ID' });
    }

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ success: false, error: 'Review not found' });
    }

    const {
      companyName,
      ratings,
      employmentDetails,
      experience,
      author,
      isAnonymous,
      source,
    } = req.body;

    if (companyName !== undefined) review.companyName = companyName;

    if (ratings !== undefined) {
      review.ratings = {
        workEnvironment: ratings.workEnvironment ?? review.ratings.workEnvironment,
        salaryBenefits: ratings.salaryBenefits ?? review.ratings.salaryBenefits,
        management: ratings.management ?? review.ratings.management,
        careerGrowth: ratings.careerGrowth ?? review.ratings.careerGrowth,
      };
    }

    if (employmentDetails !== undefined) {
      review.employmentDetails = {
        jobTitle: employmentDetails.jobTitle ?? review.employmentDetails.jobTitle,
        employmentStatus:
          employmentDetails.employmentStatus ?? review.employmentDetails.employmentStatus,
        duration: employmentDetails.duration ?? review.employmentDetails.duration,
      };
    }

    if (experience !== undefined) review.experience = experience;
    if (isAnonymous !== undefined) review.isAnonymous = Boolean(isAnonymous);
    if (author !== undefined) review.author = author;

    if (source !== undefined) {
      if (!ALLOWED_SOURCES.includes(source)) {
        return res.status(400).json({ success: false, error: 'Invalid review source' });
      }
      review.source = source;
    }

    await review.save();

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      review,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Review validation failed',
        message: err.message,
        errors: formatValidationErrors(err),
      });
    }
    next(err);
  }
});

router.patch('/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason = '' } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: 'Invalid review ID' });
    }

    if (!ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Status must be pending, approved, or rejected',
      });
    }

    if (status === 'rejected' && !String(rejectionReason).trim()) {
      return res.status(400).json({
        success: false,
        error: 'Rejection reason is required when rejecting a review',
      });
    }

    const review = await Review.findByIdAndUpdate(
      id,
      {
        $set: {
          status,
          rejectionReason:
            status === 'rejected' ? String(rejectionReason).trim() : '',
        },
      },
      { new: true, runValidators: true }
    );

    if (!review) {
      return res.status(404).json({ success: false, error: 'Review not found' });
    }

    res.status(200).json({
      success: true,
      message: `Review marked as ${status}`,
      review,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Review validation failed',
        message: err.message,
        errors: formatValidationErrors(err),
      });
    }
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: 'Invalid review ID' });
    }

    const deletedReview = await Review.findByIdAndDelete(id);
    if (!deletedReview) {
      return res.status(404).json({ success: false, error: 'Review not found' });
    }

    res.status(200).json({ success: true, message: 'Review deleted successfully' });
  } catch (err) {
    next(err);
  }
});

function formatValidationErrors(error) {
  return Object.fromEntries(
    Object.entries(error.errors).map(([field, validationError]) => [
      field,
      validationError.message,
    ])
  );
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = router;
