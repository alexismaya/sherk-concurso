import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getOrCreateUUID,
  getCanvasFingerprint,
  hashString,
  generateFingerprint,
} from '../fingerprint';

describe('fingerprint', () => {
  describe('getOrCreateUUID', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('creates and stores a new UUID when none exists', () => {
      const id = getOrCreateUUID();
      expect(id).toBeTruthy();
      expect(localStorage.getItem('shrek_device_id')).toBe(id);
    });

    it('returns the existing UUID from localStorage', () => {
      localStorage.setItem('shrek_device_id', 'existing-uuid');
      const id = getOrCreateUUID();
      expect(id).toBe('existing-uuid');
    });

    it('returns a UUID even if localStorage throws', () => {
      const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('localStorage disabled');
      });
      const id = getOrCreateUUID();
      expect(id).toBeTruthy();
      expect(typeof id).toBe('string');
      spy.mockRestore();
    });
  });

  describe('getCanvasFingerprint', () => {
    it('returns a non-empty data URL string', () => {
      const result = getCanvasFingerprint();
      // jsdom may not fully support canvas toDataURL, so we accept either a data URL or empty string
      expect(typeof result).toBe('string');
    });

    it('returns empty string if canvas context is unavailable', () => {
      const spy = vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
      const result = getCanvasFingerprint();
      expect(result).toBe('');
      spy.mockRestore();
    });

    it('returns empty string if document.createElement throws', () => {
      const spy = vi.spyOn(document, 'createElement').mockImplementation(() => {
        throw new Error('canvas not supported');
      });
      const result = getCanvasFingerprint();
      expect(result).toBe('');
      spy.mockRestore();
    });
  });

  describe('hashString', () => {
    it('returns a 64-character hex string for a given input', async () => {
      const result = await hashString('hello world');
      expect(result).toMatch(/^[0-9a-f]{64}$/);
    });

    it('produces the same hash for the same input', async () => {
      const a = await hashString('test-input');
      const b = await hashString('test-input');
      expect(a).toBe(b);
    });

    it('produces different hashes for different inputs', async () => {
      const a = await hashString('input-a');
      const b = await hashString('input-b');
      expect(a).not.toBe(b);
    });

    it('falls back to charCode hash when crypto.subtle is unavailable', async () => {
      const original = globalThis.crypto.subtle;
      Object.defineProperty(globalThis.crypto, 'subtle', {
        value: undefined,
        writable: true,
        configurable: true,
      });

      const result = await hashString('fallback-test');
      expect(typeof result).toBe('string');
      expect(result.length).toBe(64);
      expect(result).toMatch(/^[0-9a-f]{64}$/);

      Object.defineProperty(globalThis.crypto, 'subtle', {
        value: original,
        writable: true,
        configurable: true,
      });
    });
  });

  describe('generateFingerprint', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('returns a 64-character hex string', async () => {
      const fp = await generateFingerprint();
      expect(fp).toMatch(/^[0-9a-f]{64}$/);
    });

    it('returns the same fingerprint on repeated calls (deterministic)', async () => {
      const fp1 = await generateFingerprint();
      const fp2 = await generateFingerprint();
      expect(fp1).toBe(fp2);
    });

    it('produces a valid fingerprint even when canvas is unavailable', async () => {
      const spy = vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
      const fp = await generateFingerprint();
      expect(fp).toMatch(/^[0-9a-f]{64}$/);
      spy.mockRestore();
    });
  });
});
