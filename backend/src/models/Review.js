const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [120, 'Company name cannot exceed 120 characters'],
    },

    ratings: {
      workEnvironment: {
        type: Number,
        required: [true, 'Work environment rating is required'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5'],
      },

      salaryBenefits: {
        type: Number,
        required: [true, 'Salary and benefits rating is required'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5'],
      },

      management: {
        type: Number,
        required: [true, 'Management rating is required'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5'],
      },

      careerGrowth: {
        type: Number,
        required: [true, 'Career growth rating is required'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5'],
      },
    },

    overallRating: {
      type: Number,
      min: [1, 'Overall rating must be at least 1'],
      max: [5, 'Overall rating cannot exceed 5'],
    },

    employmentDetails: {
      jobTitle: {
        type: String,
        trim: true,
        maxlength: [100, 'Job title cannot exceed 100 characters'],
        default: '',
      },

      employmentStatus: {
        type: String,
        enum: {
          values: [
            '',
            'Current Employee',
            'Former Employee',
            'Intern',
            'Freelancer',
            'Contract Employee',
          ],
          message: 'Invalid employment status',
        },
        default: '',
      },

      duration: {
        type: String,
        enum: {
          values: [
            '',
            'Less than 6 months',
            '6 months - 1 year',
            '1 - 2 years',
            '2 - 5 years',
            'More than 5 years',
          ],
          message: 'Invalid employment duration',
        },
        default: '',
      },
    },

    experience: {
      type: String,
      required: [true, 'Experience summary is required'],
      trim: true,
      minlength: [10, 'Experience must contain at least 10 characters'],
      maxlength: [2000, 'Experience cannot exceed 2000 characters'],
    },

    author: {
      type: String,
      trim: true,
      maxlength: [60, 'Author name cannot exceed 60 characters'],
      default: '',
      validate: {
        validator(value) {
          return this.isAnonymous || Boolean(value?.trim());
        },
        message: 'Author name is required when review is not anonymous',
      },
    },

    isAnonymous: {
      type: Boolean,
      default: false,
    },

    source: {
      type: String,
      enum: {
        values: ['GIS3 Infotech', 'Trustpilot', 'Glassdoor'],
        message: 'Invalid review source',
      },
      default: 'GIS3 Infotech',
    },

    status: {
      type: String,
      enum: {
        values: ['pending', 'approved', 'rejected'],
        message: 'Invalid review status',
      },
      default: 'pending',
    },

    rejectionReason: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

/**
 * Calculate overall rating before validation and save.
 */
reviewSchema.pre('validate', function (next) {
  const ratings = this.ratings;

  if (
    ratings?.workEnvironment &&
    ratings?.salaryBenefits &&
    ratings?.management &&
    ratings?.careerGrowth
  ) {
    const total =
      ratings.workEnvironment +
      ratings.salaryBenefits +
      ratings.management +
      ratings.careerGrowth;

    this.overallRating = Number((total / 4).toFixed(1));
  }

  if (this.isAnonymous) {
    this.author = '';
  }

  next();
});

/**
 * Publicly displayed author name.
 */
reviewSchema.virtual('displayAuthor').get(function () {
  return this.isAnonymous ? 'Anonymous' : this.author;
});

reviewSchema.index({ createdAt: -1 });
reviewSchema.index({ companyName: 1 });
reviewSchema.index({ status: 1, createdAt: -1 });
reviewSchema.index({ overallRating: -1 });

module.exports = mongoose.model('Review', reviewSchema);