const STORAGE_KEY = 'shrek_device_id';

/**
 * Retrieves or creates a UUID stored in localStorage.
 * Falls back to an in-memory UUID if localStorage is not available.
 */
export function getOrCreateUUID(): string {
  try {
    let id = localStorage.getItem(STORAGE_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(STORAGE_KEY, id);
    }
    return id;
  } catch {
    // localStorage not available (e.g. private browsing restrictions)
    return crypto.randomUUID();
  }
}

/**
 * Renders text and shapes on an offscreen canvas and returns the data URL.
 * Returns an empty string if canvas is not available.
 */
export function getCanvasFingerprint(): string {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 50;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // Draw text with specific font settings
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillStyle = '#f0e68c';
    ctx.fillText('ShrekContest🧅', 2, 2);

    // Draw shapes for additional entropy
    ctx.fillStyle = '#6b8e23';
    ctx.beginPath();
    ctx.arc(100, 25, 15, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#556b2f';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(150, 5);
    ctx.lineTo(190, 45);
    ctx.stroke();

    return canvas.toDataURL();
  } catch {
    // Canvas not available
    return '';
  }
}

/**
 * Hashes a string using SHA-256 via crypto.subtle.
 * Falls back to a simple charCode sum hash if crypto.subtle is not available.
 * Returns a hexadecimal string.
 */
export async function hashString(input: string): Promise<string> {
  try {
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    }
  } catch {
    // crypto.subtle not available, fall through to fallback
  }

  return fallbackHash(input);
}

/**
 * Simple charCode sum fallback hash.
 * Produces a hex string (not cryptographically secure).
 */
function fallbackHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  // Convert to unsigned 32-bit and pad to 8 hex chars, then repeat to approximate 64 chars
  const hex = (hash >>> 0).toString(16).padStart(8, '0');
  return hex.repeat(8);
}

/**
 * Generates a device fingerprint by combining three signals:
 * 1. UUID from localStorage (existing device ID approach)
 * 2. Canvas fingerprint hash
 * 3. User-agent characteristics hash
 *
 * Returns a 64-character hexadecimal hash string.
 * Gracefully degrades if any signal source is unavailable.
 */
export async function generateFingerprint(): Promise<string> {
  const uuid = getOrCreateUUID();
  const canvasData = getCanvasFingerprint();
  const userAgentData = [
    navigator.userAgent ?? '',
    navigator.language ?? '',
    navigator.platform ?? '',
    String(screen?.width ?? ''),
    String(screen?.height ?? ''),
    String(screen?.colorDepth ?? ''),
  ].join('|');

  const canvasHash = canvasData ? await hashString(canvasData) : '';
  const userAgentHash = await hashString(userAgentData);

  const combined = `${uuid}|${canvasHash}|${userAgentHash}`;
  return hashString(combined);
}
