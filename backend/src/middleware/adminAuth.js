const crypto = require('crypto');

/**
 * Protect admin review-management endpoints with a server-side API key.
 *
 * Send the key as either:
 *   x-admin-key: <ADMIN_API_KEY>
 * or:
 *   Authorization: Bearer <ADMIN_API_KEY>
 */
function requireAdminKey(req, res, next) {
  const expectedKey = process.env.ADMIN_API_KEY;

  if (!expectedKey) {
    return res.status(503).json({
      success: false,
      error:
        'Admin review management is not configured. Set ADMIN_API_KEY on the backend.',
    });
  }

  const authorization = req.get('authorization') || '';
  const bearerKey = authorization.toLowerCase().startsWith('bearer ')
    ? authorization.slice(7).trim()
    : '';

  const providedKey = req.get('x-admin-key') || bearerKey;

  if (!safeEqual(providedKey, expectedKey)) {
    return res.status(401).json({
      success: false,
      error: 'Invalid admin key',
    });
  }

  next();
}

function safeEqual(value, expected) {
  if (!value || !expected) {
    return false;
  }

  const valueBuffer = Buffer.from(String(value));
  const expectedBuffer = Buffer.from(String(expected));

  if (valueBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(valueBuffer, expectedBuffer);
}

module.exports = { requireAdminKey };
