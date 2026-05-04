/**
 * Client-side rate limiter that tracks execution timestamps per key.
 * Used to prevent rapid repeated submissions (votes, registrations).
 *
 * - For votes: cooldown of 2000ms per category
 * - For registrations: cooldown of 5000ms
 */
export class RateLimiter {
  private timestamps: Map<string, number>;

  constructor() {
    this.timestamps = new Map();
  }

  /**
   * Returns true if enough time has passed since the last execution for the given key.
   * If the key has never been executed, returns true.
   */
  canExecute(key: string, cooldownMs: number): boolean {
    const lastExecution = this.timestamps.get(key);
    if (lastExecution === undefined) {
      return true;
    }
    return Date.now() - lastExecution >= cooldownMs;
  }

  /**
   * Records the current timestamp for the given key.
   */
  recordExecution(key: string): void {
    this.timestamps.set(key, Date.now());
  }

  /**
   * Returns how many milliseconds remain in the cooldown for the given key.
   * Returns 0 if the key is not rate-limited (cooldown has passed or key was never executed).
   */
  getRemainingMs(key: string, cooldownMs: number): number {
    const lastExecution = this.timestamps.get(key);
    if (lastExecution === undefined) {
      return 0;
    }
    const elapsed = Date.now() - lastExecution;
    const remaining = cooldownMs - elapsed;
    return remaining > 0 ? remaining : 0;
  }
}
