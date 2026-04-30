/**
 * math.js — Precision-safe arithmetic for XLM amounts
 *
 * Uses integer stroops (1 XLM = 10,000,000 stroops) to avoid
 * floating-point precision errors throughout the application.
 */

const STROOPS_PER_XLM = 10_000_000;

/**
 * Split a total XLM amount among N participants using integer arithmetic.
 * Returns the per-person share in XLM (string with 7 decimals).
 *
 * @param {string|number} totalXLM  - Total bill amount in XLM
 * @param {string|number} numPeople - Number of participants
 * @returns {string|null} Per-person share as string, or null if invalid
 */
export function splitAmount(totalXLM, numPeople) {
  const total = parseFloat(totalXLM);
  const people = parseInt(numPeople, 10);

  if (!total || total <= 0 || !people || people < 1) return null;

  // Convert to stroops, divide as integers, convert back
  const totalStroops = Math.round(total * STROOPS_PER_XLM);
  const shareStroops = Math.floor(totalStroops / people);

  return (shareStroops / STROOPS_PER_XLM).toFixed(7);
}

/**
 * Convert XLM amount to stroops (integer).
 * @param {string|number} xlm
 * @returns {number} Integer stroops
 */
export function toStroops(xlm) {
  return Math.round(parseFloat(xlm) * STROOPS_PER_XLM);
}

/**
 * Convert stroops to XLM display string.
 * @param {number} stroops
 * @returns {string} XLM amount with 7 decimals
 */
export function fromStroops(stroops) {
  return (stroops / STROOPS_PER_XLM).toFixed(7);
}

/**
 * Format an XLM value for display (2 decimal places).
 * @param {string|number} value
 * @returns {string}
 */
export function formatXLM(value) {
  const num = parseFloat(value);
  if (isNaN(num)) return '0.00';
  return num.toFixed(2);
}

/**
 * Truncate a Stellar public key for display.
 * @param {string} key
 * @returns {string}
 */
export function truncateKey(key) {
  if (!key || key.length <= 9) return key || '';
  return `${key.slice(0, 4)}…${key.slice(-4)}`;
}

/**
 * Validate a Stellar public key format.
 * @param {string} address
 * @returns {boolean}
 */
export function isValidStellarAddress(address) {
  return typeof address === 'string' && address.startsWith('G') && address.length === 56;
}
