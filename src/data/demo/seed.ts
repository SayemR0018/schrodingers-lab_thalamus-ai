/**
 * Deterministic PRNG and helper utilities for the demo data pipeline.
 *
 * Every builder in `src/data/demo/*` derives its values from a Mulberry32
 * RNG factory keyed on a hard-coded seed. This makes the entire UI state
 * reproducible across reloads.
 */

export type Rng = () => number;

/**
 * Create a Mulberry32 PRNG. Returns a function that yields a value in `[0, 1)`.
 */
export function makeRng(seed: number): Rng {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Uniform random pick from an array.
 */
export function pick<T>(rng: Rng, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

/**
 * Inclusive integer in `[lo, hi]`.
 */
export function intBetween(rng: Rng, lo: number, hi: number): number {
  return Math.floor(rng() * (hi - lo + 1)) + lo;
}

/**
 * Build an array of length `n` where each element is `fn(i)`.
 */
export function range<T>(n: number, fn: (i: number) => T): T[] {
  return Array.from({ length: n }, (_, i) => fn(i));
}

/**
 * Placeholder constant; reserved for future use.
 */
export const baseSeed = 0xDEFA17;

/**
 * Helper for Bengali digit substitution in formatted strings.
 */
const BN_DIGITS = "০১২৩৪৫৬৭৮৯";

export function bn(s: string): string {
  return s.replace(/\d/g, (d) => BN_DIGITS[+d]);
}
