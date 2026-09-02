const express = require('express');
const mongoose = require('mongoose');
const Review = require('../models/Review');
const { sendModerationEmail } = require('../utils/mailer');
const { verifyModerationToken } = require('../utils/moderationToken');

const router = express.Router();

/**
 * GET /api/reviews
 *
 * Query parameters:
 * ?companyName=GIS3 Infotech
 * ?source=GIS3 Infotech
 * ?status=approved
 * ?employmentStatus=Former Employee
 * ?minRating=3
 * ?page=1
 * ?limit=20
 */
router.get('/', async (req, res, next) => {
  try {
    const {
      companyName,
      source,
      status,
      employmentStatus,
      minRating,
      page = 1,
      limit = 20,
    } = req.query;

    const filter = {};

    if (companyName) {
      filter.companyName = {
        $regex: escapeRegex(String(companyName).trim()),
        $options: 'i',
      };
    }

    if (source) {
      filter.source = source;
    }

    /*
     * For a public review page, it is better to show only approved reviews.
     * Passing ?status=pending or ?status=rejected can be used by an admin page.
     */
    filter.status = status || 'approved';

    if (employmentStatus) {
      filter['employmentDetails.employmentStatus'] = employmentStatus;
    }

    const parsedMinRating = Number(minRating);

    if (
      minRating !== undefined &&
      Number.isFinite(parsedMinRating) &&
      parsedMinRating >= 1 &&
      parsedMinRating <= 5
    ) {
      filter.overallRating = {
        $gte: parsedMinRating,
      };
    }

    const parsedPage = Math.max(Number.parseInt(page, 10) || 1, 1);
    const parsedLimit = Math.min(
      Math.max(Number.parseInt(limit, 10) || 20, 1),
      100
    );

    const skip = (parsedPage - 1) * parsedLimit;

    const [reviews, total, statsResult] = await Promise.all([
      Review.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parsedLimit)
        .lean(),

      Review.countDocuments(filter),

      Review.aggregate([
        {
          $match: filter,
        },
        {
          $group: {
            _id: null,

            averageOverallRating: {
              $avg: '$overallRating',
            },

            averageWorkEnvironment: {
              $avg: '$ratings.workEnvironment',
            },

            averageSalaryBenefits: {
              $avg: '$ratings.salaryBenefits',
            },

            averageManagement: {
              $avg: '$ratings.management',
            },

            averageCareerGrowth: {
              $avg: '$ratings.careerGrowth',
            },

            count: {
              $sum: 1,
            },
          },
        },
      ]),
    ]);

    const stats = statsResult[0];

    res.status(200).json({
      success: true,

      reviews: reviews.map((review) => ({
        ...review,

        /*
         * Avoid exposing an anonymous reviewer's stored name,
         * even if old data contains one.
         */
        author: review.isAnonymous ? 'Anonymous' : review.author,
      })),

      stats: {
        averageOverallRating: roundRating(
          stats?.averageOverallRating
        ),

        averageRatings: {
          workEnvironment: roundRating(
            stats?.averageWorkEnvironment
          ),

          salaryBenefits: roundRating(
            stats?.averageSalaryBenefits
          ),

          management: roundRating(
            stats?.averageManagement
          ),

          careerGrowth: roundRating(
            stats?.averageCareerGrowth
          ),
        },

        count: stats?.count || 0,
      },

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

/**
 * GET /api/reviews/:id
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid review ID',
      });
    }

    const review = await Review.findById(id).lean();

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found',
      });
    }

    res.status(200).json({
      success: true,
      review: {
        ...review,
        author: review.isAnonymous
          ? 'Anonymous'
          : review.author,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/reviews
 *
 * Creates a new review.
 * overallRating is automatically calculated by the model.
 */
router.post('/', async (req, res, next) => {
  try {
    const {
      companyName,
      ratings,
      employmentDetails,
      experience,
      author,
      isAnonymous,
      source,
    } = req.body;

    const review = await Review.create({
      companyName,
      ratings: {
        workEnvironment: ratings?.workEnvironment,
        salaryBenefits: ratings?.salaryBenefits,
        management: ratings?.management,
        careerGrowth: ratings?.careerGrowth,
      },

      employmentDetails: {
        jobTitle: employmentDetails?.jobTitle || '',
        employmentStatus:
          employmentDetails?.employmentStatus || '',
        duration: employmentDetails?.duration || '',
      },

      experience,
      author: isAnonymous ? '' : author,
      isAnonymous: Boolean(isAnonymous),
      source: source || 'GIS3 Infotech',

      /*
       * New reviews should be moderated before being shown publicly.
       */
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message:
        'Your review has been submitted and is awaiting approval.',

      review: {
        ...review.toObject(),
        author: review.isAnonymous
          ? 'Anonymous'
          : review.author,
      },
    });

    /*
     * Fire-and-forget: email the admin a one-click approve/reject link.
     * Runs after the response is sent so a slow or failing email
     * provider never delays or breaks the review submission itself.
     */
    sendModerationEmail(review).catch((err) => {
      console.error('Moderation email failed:', err.message);
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

/**
 * GET /api/reviews/:id/moderate?action=approve|reject&token=...
 *
 * One-click approval/rejection link sent in the admin notification
 * email. Verifies a signed token instead of requiring a login, since
 * the link is only ever delivered to the admin's inbox.
 */
router.get('/:id/moderate', async (req, res) => {
  const { id } = req.params;
  const { action, token } = req.query;

  const page = (title, message, ok) => `
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8" /><title>${title}</title></head>
      <body style="font-family: Arial, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #f5f5f5;">
        <div style="text-align: center; background: #fff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
          <h2 style="color: ${ok ? '#16a34a' : '#dc2626'}; margin-bottom: 8px;">${title}</h2>
          <p style="color: #555;">${message}</p>
          <a href="${(process.env.CLIENT_ORIGIN || 'http://localhost:3000')}/reviews" style="display: inline-block; margin-top: 16px; color: #3f007d; font-weight: 600; text-decoration: none;">Go to reviews dashboard →</a>
        </div>
      </body>
    </html> 
  `;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send(page('Invalid link', 'This review ID is not valid.', false));
  }

  if (!['approve', 'reject'].includes(action)) {
    return res.status(400).send(page('Invalid action', 'Action must be approve or reject.', false));
  }

  if (!verifyModerationToken(id, action, token)) {
    return res.status(403).send(page('Link expired or invalid', 'This approval link is no longer valid.', false));
  }

  const review = await Review.findById(id);

  if (!review) {
    return res.status(404).send(page('Not found', 'This review no longer exists.', false));
  }

  review.status = action === 'approve' ? 'approved' : 'rejected';
  review.rejectionReason = action === 'reject' ? 'Rejected by admin.' : '';

  await review.save();

  return res.send(
    action === 'approve'
      ? page('Review approved', `The review for ${review.companyName} is now live.`, true)
      : page('Review rejected', `The review for ${review.companyName} has been rejected.`, true)
  );
});

/**
 * PATCH /api/reviews/:id/status
 *
 * Admin route for approving or rejecting a review.
 *
 * Body:
 * {
 *   "status": "approved"
 * }
 *
 * Or:
 * {
 *   "status": "rejected",
 *   "rejectionReason": "Reason here"
 * }
 */
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason = '' } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid review ID',
      });
    }

    const allowedStatuses = [
      'pending',
      'approved',
      'rejected',
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error:
          'Status must be pending, approved, or rejected',
      });
    }

    if (
      status === 'rejected' &&
      !String(rejectionReason).trim()
    ) {
      return res.status(400).json({
        success: false,
        error:
          'Rejection reason is required when rejecting a review',
      });
    }

    const review = await Review.findByIdAndUpdate(
      id,
      {
        $set: {
          status,
          rejectionReason:
            status === 'rejected'
              ? String(rejectionReason).trim()
              : '',
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found',
      });
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

/**
 * DELETE /api/reviews/:id
 *
 * This should normally be protected with admin middleware.
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid review ID',
      });
    }

    const deletedReview =
      await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return res.status(404).json({
        success: false,
        error: 'Review not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Round an average rating to one decimal place.
 */
function roundRating(value) {
  if (!value) {
    return 0;
  }

  return Math.round(value * 10) / 10;
}

/**
 * Convert Mongoose validation errors into an easier frontend format.
 */
function formatValidationErrors(error) {
  return Object.fromEntries(
    Object.entries(error.errors).map(
      ([field, validationError]) => [
        field,
        validationError.message,
      ]
    )
  );
}

/**
 * Prevent user input from being interpreted as a regular expression.
 */
function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = router;