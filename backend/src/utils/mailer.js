const { Resend } = require('resend');
const { signModerationToken } = require('./moderationToken');

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const APP_URL = (process.env.APP_URL || 'http://localhost:5000').replace(/\/+$/, '');

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Email a review to the admin for moderation, with signed one-click
 * approve/reject links pointing at the backend.
 *
 * Failures here are logged but never thrown - a broken email provider
 * should not prevent a review from being saved.
 */
async function sendModerationEmail(review) {
  if (!resend) {
    console.warn('RESEND_API_KEY is not set - skipping moderation email.');
    return;
  }

  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    console.warn('ADMIN_EMAIL is not set - skipping moderation email.');
    return;
  }

  const id = review._id.toString();
  const approveToken = signModerationToken(id, 'approve');
  const rejectToken = signModerationToken(id, 'reject');

  const approveUrl = `${APP_URL}/api/reviews/${id}/moderate?action=approve&token=${approveToken}`;
  const rejectUrl = `${APP_URL}/api/reviews/${id}/moderate?action=reject&token=${rejectToken}`;

  const author = review.isAnonymous ? 'Anonymous' : review.author || 'Anonymous';
  const adminDashboardUrl = `${(process.env.CLIENT_ORIGIN || 'http://localhost:3000').replace(/\/+$/, '')}/admin/reviews`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #222;">
      <h2 style="margin-bottom: 4px;">New review awaiting approval</h2>
      <p style="color: #666; margin-top: 0;">${escapeHtml(review.companyName)} &middot; ${review.overallRating}/5 overall</p>

      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <tr><td style="padding: 4px 0; color: #666;">Author</td><td style="padding: 4px 0;">${escapeHtml(author)}</td></tr>
        <tr><td style="padding: 4px 0; color: #666;">Dashboard</td><td style="padding: 4px 0;">${escapeHtml(review.source)}</td></tr>
        <tr><td style="padding: 4px 0; color: #666;">Work Environment</td><td style="padding: 4px 0;">${review.ratings.workEnvironment}/5</td></tr>
        <tr><td style="padding: 4px 0; color: #666;">Salary & Benefits</td><td style="padding: 4px 0;">${review.ratings.salaryBenefits}/5</td></tr>
        <tr><td style="padding: 4px 0; color: #666;">Management</td><td style="padding: 4px 0;">${review.ratings.management}/5</td></tr>
        <tr><td style="padding: 4px 0; color: #666;">Career Growth</td><td style="padding: 4px 0;">${review.ratings.careerGrowth}/5</td></tr>
      </table>

      <p style="white-space: pre-line; border-left: 3px solid #eee; padding-left: 12px; color: #333;">${escapeHtml(review.experience)}</p>

      <div style="margin-top: 24px;">
        <a href="${approveUrl}" style="display: inline-block; background: #16a34a; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: 600; margin-right: 10px;">Approve</a>
        <a href="${rejectUrl}" style="display: inline-block; background: #dc2626; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: 600; margin-right: 10px;">Reject</a>
        <a href="${adminDashboardUrl}" style="display: inline-block; background: #3f007d; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: 600;">Edit in admin</a>
      </div>
    </div>
  `;

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM || 'GIS3 Infotech <onboarding@resend.dev>',
      to: adminEmail,
      subject: `Review pending: ${review.companyName}`,
      html,
    });
  } catch (err) {
    console.error('Failed to send moderation email:', err.message);
  }
}

module.exports = { sendModerationEmail };
