"use client";

import type { CSSProperties } from "react";
import { BalanceRow, ComputedRow, RatioRow } from "../types/balance";
import { PnlRow } from "../types/pnl";

/* ---------------------- SHARED LAYOUT CONSTANTS ---------------------- */

const COL_FIRST: CSSProperties = { width: "180px" };
const COL_FIRST_YEAR: CSSProperties = { width: "80px" };
const COL_YEAR: CSSProperties = { width: "110px" };

const head: CSSProperties = {
  padding: 8,
  border: "1px solid #ccc",
  background: "#f3f3f3",
  textAlign: "center",
};

const cell: CSSProperties = {
  padding: 8,
  border: "1px solid #ccc",
  textAlign: "right",
  verticalAlign: "middle",
};

const left: CSSProperties = {
  ...cell,
  textAlign: "left",
};

/* ----------------------- Locale Formatting ----------------------- */

const getLocale = () =>
  typeof navigator !== "undefined" ? navigator.language : "en-US";

const fmtFactory = (locale: string) => (v: number) =>
  (v ?? 0).toLocaleString(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  

/* ----------------------- Component ----------------------- */

export default function BalanceSheetTable({
  rows,
  computedRows,
  years,
  pnl,
  ratios,
}: {
  rows: BalanceRow[];
  computedRows: ComputedRow[];
  years: number[];
  pnl: PnlRow[];
  ratios: RatioRow[];
}) {
  const locale = getLocale();
  const fmt = fmtFactory(locale);

/* ------------------------- FORMATTERS ------------------------- */

// Standard (normal) items:
// + positive: 12,500
// - negative: (12,500)
const fmtNormal = (v: number, decimals = 0) => {
  const n = v ?? 0;

  const formatted = Math.abs(n).toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return n < 0 ? `(${formatted})` : formatted;
};

// Cost items:
// + positive → (12,500)
// - negative → 12,500 (no minus, no parentheses)
const fmtCost = (v: number, decimals = 0) => {
  const n = v ?? 0;

  const formatted = Math.abs(n).toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  if (n > 0) return `(${formatted})`;
  if (n < 0) return formatted; // negative shown positive
  return formatted; // zero
};



  return (
    <div style={{ marginBottom: 32 }}>
      <h3 style={{ fontSize: 20, fontWeight: "bold", marginBottom: 12 }}>
        Balance Sheet Output
      </h3>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ ...head, ...COL_FIRST }}>Balance Sheet Output</th>

            {years.map((y, idx) => (
              <th
                key={y}
                style={{
                  ...head,
                  ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR),
                }}
              >
                {y}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {/* FIXED ASSETS */}
          <tr style={{ fontWeight: "bold" }}>
            <td style={left}>Fixed Assets</td>
            {computedRows.map((r, idx) => (
              <td key={r.year} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
                {fmtNormal(r.fixedAssets)}
              </td>
            ))}
          </tr>

          {/* INVENTORY */}
          <tr>
            <td style={left}>Inventory</td>
            {computedRows.map((r, idx) => (
              <td key={r.year} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
                {fmtNormal(r.wcInventory)}
              </td>
            ))}
          </tr>

          {/* RECEIVABLES */}
          <tr>
            <td style={left}>Receivables</td>
            {computedRows.map((r, idx) => (
              <td key={r.year} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
                {fmt(r.wcReceivables)}
              </td>
            ))}
          </tr>

          {/* OTHER ASSETS */}
          <tr>
            <td style={left}>Other Assets</td>
            {computedRows.map((r, idx) => (
              <td key={r.year} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
                {fmtNormal(r.wcOtherCurrentAssets)}
              </td>
            ))}
          </tr>

          {/* PAYABLES */}
          <tr>
            <td style={left}>Payables</td>
            {computedRows.map((r, idx) => (
              <td key={r.year} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
                {fmtCost(r.wcPayables)}
              </td>
            ))}
          </tr>

          {/* OTHER LIABILITIES */}
          <tr>
            <td style={left}>Other Liabilities</td>
            {computedRows.map((r, idx) => (
              <td key={r.year} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
                {fmtCost(r.wcOtherCurrentLiabilities)}
              </td>
            ))}
          </tr>

          {/* WORKING CAPITAL */}
          <tr style={{ fontWeight: "bold" }}>
            <td style={left}>Working Capital</td>
            {computedRows.map((r, idx) => (
              <td key={r.year} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
                {fmtNormal(r.workingCapital)}
              </td>
            ))}
          </tr>

          {/* CASH */}
          <tr style={{ fontWeight: "bold" }}>
            <td style={left}>Cash (Balancing)</td>
            {computedRows.map((r, idx) => (
              <td key={r.year} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
                {fmtNormal(r.cash)}
              </td>
            ))}
          </tr>

          {/* TOTAL ASSETS */}
          <tr style={{ fontWeight: "bold", background: "#e8e8e8" }}>
            <td style={left}>Total Assets</td>
            {computedRows.map((r, idx) => {
              const total = r.fixedAssets + r.workingCapital + r.cash;
              return (
                <td key={r.year} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
                  {fmtNormal(total)}
                </td>
              );
            })}
          </tr>

          {/* EQUITY */}
          <tr>
            <td style={left}>Equity</td>
            {computedRows.map((r, idx) => (
              <td key={r.year} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
                {fmtNormal(r.equity)}
              </td>
            ))}
          </tr>

          {/* LONG / SHORT DEBT */}
          <tr>
            <td style={left}>Long Term Debt</td>
            {rows.map((r, idx) => (
              <td key={r.year} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
                {fmtNormal(r.longDebt)}
              </td>
            ))}
          </tr>

          <tr>
            <td style={left}>Short Term Debt</td>
            {rows.map((r, idx) => (
              <td key={r.year} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
                {fmtNormal(r.shortDebt)}
              </td>
            ))}
          </tr>

          {/* TOTAL LIABILITIES */}
          <tr style={{ fontWeight: "bold", background: "#e8e8e8" }}>
            <td style={left}>Total Liabilities</td>
            {computedRows.map((r, idx) => {
              const debt =
                (rows[idx].longDebt ?? 0) + (rows[idx].shortDebt ?? 0);

              return (
                <td
                  key={r.year}
                  style={{
                    ...cell,
                    fontWeight: "bold",
                    ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR),
                  }}
                >
                  {fmtNormal(debt + r.equity)}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
