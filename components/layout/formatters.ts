/* ================= LOCALE ================= */

export const getLocale = () =>
  typeof navigator !== "undefined" ? navigator.language : "en-US";

/* ================= BASE FORMAT ================= */

/**
 * Always returns a FUNCTION.
 * Never returns a string.
 */
export const fmtFactory = (locale: string) => {
  return (v: number) =>
    Number(v ?? 0).toLocaleString(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
};

/* ================= FINANCIAL SEMANTICS ================= */

/**
 * Generic signed number (P&L totals)
 * Negative values shown as (xxx)
 */
export const fmtNormal = (
  v: number,
  fmt: (n: number) => string
) => {
  const n = Number(v ?? 0);

  // 🔒 HARD GUARD — prevents "fmt is not a function"
  if (typeof fmt !== "function") {
    return String(n);
  }

  return n < 0 ? `(${fmt(Math.abs(n))})` : fmt(n);
};

/**
 * Costs: positive numbers shown as (xxx)
 */
export const fmtCost = (
  v: number,
  fmt: (n: number) => string
) => {
  const n = Number(v ?? 0);

  // 🔒 HARD GUARD
  if (typeof fmt !== "function") {
    return String(Math.abs(n));
  }

  return n > 0 ? `(${fmt(n)})` : fmt(Math.abs(n));
};

/**
 * Negative = cash outflow
 */
export const fmtNegToParens = (
  v: number,
  fmt: (n: number) => string
) => {
  const n = Number(v ?? 0);

  // 🔒 HARD GUARD
  if (typeof fmt !== "function") {
    return String(Math.abs(n));
  }

  return n < 0 ? `(${fmt(Math.abs(n))})` : fmt(Math.abs(n));
};

/**
 * Positive = cash outflow (tax / WC)
 */
export const fmtPosToParens = (
  v: number,
  fmt: (n: number) => string
) => {
  const n = Number(v ?? 0);

  // 🔒 HARD GUARD
  if (typeof fmt !== "function") {
    return String(Math.abs(n));
  }

  return n > 0 ? `(${fmt(Math.abs(n))})` : fmt(Math.abs(n));
};
