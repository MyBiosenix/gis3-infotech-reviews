const crypto = require('crypto');

const SECRET = process.env.MODERATION_SECRET;

if (!SECRET) {
  // Fail loudly at startup rather than silently signing links with `undefined`.
  throw new Error(
    'MODERATION_SECRET is not set. Add a long random string to backend/.env before starting the server.'
  );
}

/**
 * Create a signature for a given review id + action (approve/reject).
 * The token is a hex HMAC, so it can't be forged without the secret,
 * and it's tied to a specific action so an "approve" link can't be
 * replayed to reject, or vice versa.
 */
function signModerationToken(reviewId, action) {
  return crypto
    .createHmac('sha256', SECRET)
    .update(`${reviewId}:${action}`)
    .digest('hex');
}

/**
 * Verify a token against the review id + action it claims to authorize.
 * Uses a constant-time comparison to avoid timing attacks.
 */
function verifyModerationToken(reviewId, action, token) {
  if (!token || typeof token !== 'string') {
    return false;
  }

  const expected = signModerationToken(reviewId, action);
  const expectedBuffer = Buffer.from(expected, 'hex');
  const providedBuffer = Buffer.from(token, 'hex');

  if (expectedBuffer.length !== providedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, providedBuffer);
}

module.exports = { signModerationToken, verifyModerationToken };
