
const rateLimitMap = new Map();

/**
 * Simple in-memory rate limiter
 * @param {string} ip - The IP address to limit
 * @param {number} limit - Max requests per window
 * @param {number} windowMs - Time window in milliseconds
 * @returns {boolean} - True if allowed, false if rate limited
 */
export function isRateLimited(ip, limit = 10, windowMs = 60000) {
  const now = Date.now();
  const userData = rateLimitMap.get(ip) || { count: 0, startTime: now };

  if (now - userData.startTime > windowMs) {
    // Reset window
    userData.count = 1;
    userData.startTime = now;
    rateLimitMap.set(ip, userData);
    return false;
  }

  if (userData.count >= limit) {
    return true;
  }

  userData.count += 1;
  rateLimitMap.set(ip, userData);
  return false;
}
