import { timingSafeEqual } from 'crypto';

/**
 * Constant-time comparison to prevent timing attacks
 * when comparing HMAC signatures or other sensitive data.
 * Uses Node's built-in crypto.timingSafeEqual for security.
 */
export function constantTimeCompare(a: string, b: string): boolean {
  try {
    // Convert strings to Buffers
    const bufferA = Buffer.from(a, 'utf8');
    const bufferB = Buffer.from(b, 'utf8');

    // timingSafeEqual throws if lengths differ
    return timingSafeEqual(bufferA, bufferB);
  } catch {
    // If lengths differ or other error, return false
    return false;
  }
}
