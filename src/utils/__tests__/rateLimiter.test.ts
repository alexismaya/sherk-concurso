import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { RateLimiter } from '../rateLimiter';

describe('RateLimiter', () => {
  let limiter: RateLimiter;

  beforeEach(() => {
    limiter = new RateLimiter();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('canExecute', () => {
    it('returns true when key has never been executed', () => {
      expect(limiter.canExecute('vote-kids', 2000)).toBe(true);
    });

    it('returns false when called within the cooldown period', () => {
      limiter.recordExecution('vote-kids');
      vi.advanceTimersByTime(500);
      expect(limiter.canExecute('vote-kids', 2000)).toBe(false);
    });

    it('returns true after the cooldown period has elapsed', () => {
      limiter.recordExecution('vote-kids');
      vi.advanceTimersByTime(2000);
      expect(limiter.canExecute('vote-kids', 2000)).toBe(true);
    });

    it('tracks keys independently', () => {
      limiter.recordExecution('vote-kids');
      vi.advanceTimersByTime(500);
      expect(limiter.canExecute('vote-kids', 2000)).toBe(false);
      expect(limiter.canExecute('vote-adults', 2000)).toBe(true);
    });

    it('works with vote cooldown of 2000ms', () => {
      limiter.recordExecution('vote-kids');
      vi.advanceTimersByTime(1999);
      expect(limiter.canExecute('vote-kids', 2000)).toBe(false);
      vi.advanceTimersByTime(1);
      expect(limiter.canExecute('vote-kids', 2000)).toBe(true);
    });

    it('works with registration cooldown of 5000ms', () => {
      limiter.recordExecution('registration');
      vi.advanceTimersByTime(4999);
      expect(limiter.canExecute('registration', 5000)).toBe(false);
      vi.advanceTimersByTime(1);
      expect(limiter.canExecute('registration', 5000)).toBe(true);
    });
  });

  describe('recordExecution', () => {
    it('records the execution timestamp for a key', () => {
      limiter.recordExecution('vote-kids');
      expect(limiter.canExecute('vote-kids', 2000)).toBe(false);
    });

    it('overwrites the previous timestamp on subsequent calls', () => {
      limiter.recordExecution('vote-kids');
      vi.advanceTimersByTime(1500);
      limiter.recordExecution('vote-kids');
      // Cooldown resets from the second recordExecution
      vi.advanceTimersByTime(500);
      expect(limiter.canExecute('vote-kids', 2000)).toBe(false);
      vi.advanceTimersByTime(1500);
      expect(limiter.canExecute('vote-kids', 2000)).toBe(true);
    });
  });

  describe('getRemainingMs', () => {
    it('returns 0 when key has never been executed', () => {
      expect(limiter.getRemainingMs('vote-kids', 2000)).toBe(0);
    });

    it('returns the remaining cooldown time', () => {
      limiter.recordExecution('vote-kids');
      vi.advanceTimersByTime(500);
      expect(limiter.getRemainingMs('vote-kids', 2000)).toBe(1500);
    });

    it('returns 0 after the cooldown has fully elapsed', () => {
      limiter.recordExecution('vote-kids');
      vi.advanceTimersByTime(2000);
      expect(limiter.getRemainingMs('vote-kids', 2000)).toBe(0);
    });

    it('returns 0 when more time than cooldown has passed', () => {
      limiter.recordExecution('vote-kids');
      vi.advanceTimersByTime(5000);
      expect(limiter.getRemainingMs('vote-kids', 2000)).toBe(0);
    });

    it('returns correct remaining time for registration cooldown', () => {
      limiter.recordExecution('registration');
      vi.advanceTimersByTime(3000);
      expect(limiter.getRemainingMs('registration', 5000)).toBe(2000);
    });

    it('tracks remaining time independently per key', () => {
      limiter.recordExecution('vote-kids');
      vi.advanceTimersByTime(1000);
      limiter.recordExecution('vote-adults');
      vi.advanceTimersByTime(500);
      expect(limiter.getRemainingMs('vote-kids', 2000)).toBe(500);
      expect(limiter.getRemainingMs('vote-adults', 2000)).toBe(1500);
    });
  });
});
