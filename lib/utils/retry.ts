export interface RetryOptions {
  maxAttempts?: number;
  delayMs?: number;
  backoffMultiplier?: number;
  shouldRetry?: (error: Error) => boolean;
}

export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { maxAttempts = 5, delayMs = 1000, backoffMultiplier = 2, shouldRetry } = options;

  let lastError: Error | null = null;
  let currentDelay = delayMs;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      console.error(`Attempt ${attempt}/${maxAttempts} failed:`, lastError.message);

      // Check if error should be retried
      const retryable = shouldRetry ? shouldRetry(lastError) : isRetryableError(lastError);

      if (!retryable || attempt === maxAttempts) {
        throw new Error(
          `Operation failed after ${attempt} attempts. Last error: ${lastError.message}`
        );
      }

      // Wait before retrying with exponential backoff
      console.log(`Retrying in ${currentDelay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, currentDelay));
      currentDelay *= backoffMultiplier;
    }
  }

  throw lastError || new Error('Operation failed');
}

/**
 * Default error classification for retry logic
 * Retries on network errors and 5xx server errors, but not on 4xx client errors
 */
function isRetryableError(error: Error): boolean {
  const message = error.message.toLowerCase();

  // Don't retry client errors (4xx)
  if (message.includes('400') || message.includes('401') || message.includes('403') || message.includes('404')) {
    return false;
  }

  // Don't retry validation errors
  if (message.includes('invalid') || message.includes('validation') || message.includes('unauthorized')) {
    return false;
  }

  // Retry on network errors, timeouts, and server errors (5xx)
  if (
    message.includes('network') ||
    message.includes('timeout') ||
    message.includes('econnrefused') ||
    message.includes('500') ||
    message.includes('502') ||
    message.includes('503') ||
    message.includes('504')
  ) {
    return true;
  }

  // Default to retry for unknown errors
  return true;
}
