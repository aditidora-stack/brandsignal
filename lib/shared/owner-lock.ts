/**
 * Owner lock (BrandSignal addition).
 *
 * The routes below spend the owner's Bright Data / OpenRouter credits. On a
 * public deploy they only answer when the browser carries the owner cookie,
 * which /unlock sets after the owner types BRANDSIGNAL_OWNER_PASSWORD.
 * With no password configured, the paid routes stay closed (safe default).
 */
export const OWNER_COOKIE = "bs_owner";

export const PAID_PATHS = new Set([
  "/api/scrape",
  "/api/brightdata-platforms",
  "/api/bulk-sro",
  "/api/sro-analyze",
  "/api/analyze",
  "/api/site-context",
  "/api/serp",
  "/api/unlocker",
  "/api/rank-signal",
]);

/** SHA-256 hex of the password, salted with a fixed app prefix. Works on Edge and Node. */
export async function ownerToken(password: string): Promise<string> {
  const data = new TextEncoder().encode(`brandsignal-owner:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Constant-time string compare (both inputs are fixed-length hex here). */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
