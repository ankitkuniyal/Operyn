// In-memory rate limiter for manual agent runs
// Limit: maximum 3 manual executions per 10 minutes per user
const rateLimitMap = new Map<string, number[]>();

export function checkRateLimit(userId: string): { success: boolean; remaining: number } {
  const now = Date.now();
  const tenMinutesAgo = now - 10 * 60 * 1000;

  const timestamps = rateLimitMap.get(userId) || [];
  // Filter out any timestamps older than 10 minutes
  const activeTimestamps = timestamps.filter((ts) => ts > tenMinutesAgo);

  if (activeTimestamps.length >= 3) {
    return { success: false, remaining: 0 };
  }

  activeTimestamps.push(now);
  rateLimitMap.set(userId, activeTimestamps);

  return { success: true, remaining: 3 - activeTimestamps.length };
}
