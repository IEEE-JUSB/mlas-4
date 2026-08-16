export interface RetryOptions {
  maxAttempts?: number;
  delayMs?: number;
  backoffMultiplier?: number;
}

export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { maxAttempts = 5, delayMs = 1000, backoffMultiplier = 2 } = options;

  let lastError: Error | null = null;
  let currentDelay = delayMs;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      console.error(`Attempt ${attempt}/${maxAttempts} failed:`, lastError.message);

      if (attempt === maxAttempts) {
        throw new Error(
          `Operation failed after ${maxAttempts} attempts. Last error: ${lastError.message}`
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
