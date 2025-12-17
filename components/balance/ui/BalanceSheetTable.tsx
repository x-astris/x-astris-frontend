"use client";

import {
  COL_FIRST,
  COL_FIRST_YEAR,
  COL_YEAR,
  head,
  cell,
  left,
} from "@/components/layout/tableLayout";

import {
  getLocale,
  fmtFactory,
  fmtNormal,
  fmtCost,
} from "@/components/layout/formatters";

/* ---------------------- TYPES ---------------------- */

export type BalanceSheetRow = {
  year: number;
  fixedAssets: number;
  wcInventory: number;
  wcReceivables: number;
  wcOtherCurrentAssets: number;
  wcPayables: number;
  wcOtherCurrentLiabilities: number;
  workingCapital: number;
  cash: number;
  equity: number;
  longDebt: number;
  shortDebt: number;
};

/* ---------------------- COMPONENT ---------------------- */

export default function BalanceSheetTable({
  rows,
  years,
}: {
  rows: BalanceSheetRow[];
  years: number[];
}) {
  const fmt = fmtFactory(getLocale());

  const N = (v: number) => fmtNormal(v ?? 0, fmt);
  const C = (v: number) => fmtCost(v ?? 0, fmt);

  return (
    <div style={{ marginBottom: 32 }}>
      <h3 style={{ fontSize: 20, fontWeight: "bold", marginBottom: 12 }}>
        Balance Sheet
      </h3>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ ...head, ...COL_FIRST }}></th>
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
          {/* ---------- ASSETS ---------- */}

          <tr style={{ fontWeight: "bold" }}>
            <td style={left}>Fixed Assets</td>
            {rows.map((r, idx) => (
              <td
                key={r.year}
                style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}
              >
                {N(r.fixedAssets)}
              </td>
            ))}
          </tr>

          <tr>
            <td style={left}>Inventory</td>
            {rows.map((r, idx) => (
              <td
                key={r.year}
                style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}
              >
                {N(r.wcInventory)}
              </td>
            ))}
          </tr>

          <tr>
            <td style={left}>Receivables</td>
            {rows.map((r, idx) => (
              <td
                key={r.year}
                style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}
              >
                {N(r.wcReceivables)}
              </td>
            ))}
          </tr>

          <tr>
            <td style={left}>Other Current Assets</td>
            {rows.map((r, idx) => (
              <td
                key={r.year}
                style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}
              >
                {N(r.wcOtherCurrentAssets)}
              </td>
            ))}
          </tr>

          <tr>
            <td style={left}>Payables</td>
            {rows.map((r, idx) => (
              <td
                key={r.year}
                style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}
              >
                {C(r.wcPayables)}
              </td>
            ))}
          </tr>

          <tr>
            <td style={left}>Other Current Liabilities</td>
            {rows.map((r, idx) => (
              <td
                key={r.year}
                style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}
              >
                {C(r.wcOtherCurrentLiabilities)}
              </td>
            ))}
          </tr>

          <tr style={{ fontWeight: "bold" }}>
            <td style={left}>Working Capital</td>
            {rows.map((r, idx) => (
              <td
                key={r.year}
                style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}
              >
                {N(r.workingCapital)}
              </td>
            ))}
          </tr>

          <tr style={{ fontWeight: "bold" }}>
            <td style={left}>Cash (Balancing)</td>
            {rows.map((r, idx) => (
              <td
                key={r.year}
                style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}
              >
                {N(r.cash)}
              </td>
            ))}
          </tr>

          <tr style={{ fontWeight: "bold", background: "#e8e8e8" }}>
            <td style={left}>Total Assets</td>
            {rows.map((r, idx) => {
              const total =
                r.fixedAssets + r.workingCapital + r.cash;

              return (
                <td
                  key={r.year}
                  style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}
                >
                  {N(total)}
                </td>
              );
            })}
          </tr>

          {/* ---------- LIABILITIES ---------- */}

          <tr>
            <td style={left}>Equity</td>
            {rows.map((r, idx) => (
              <td
                key={r.year}
                style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}
              >
                {N(r.equity)}
              </td>
            ))}
          </tr>

          <tr>
            <td style={left}>Long-term Debt</td>
            {rows.map((r, idx) => (
              <td
                key={r.year}
                style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}
              >
                {N(r.longDebt)}
              </td>
            ))}
          </tr>

          <tr>
            <td style={left}>Short-term Debt</td>
            {rows.map((r, idx) => (
              <td
                key={r.year}
                style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}
              >
                {N(r.shortDebt)}
              </td>
            ))}
          </tr>

          <tr style={{ fontWeight: "bold", background: "#e8e8e8" }}>
            <td style={left}>Total Liabilities</td>
            {rows.map((r, idx) => {
              const total =
                r.equity + r.longDebt + r.shortDebt;

              return (
                <td
                  key={r.year}
                  style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}
                >
                  {N(total)}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
