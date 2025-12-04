"use client";

import type { CSSProperties } from "react";
import type { BalanceRow, ComputedRow } from "../types/balance";
import type { PnlRow } from "../types/pnl";

/* ------------------------------- STYLES ------------------------------- */

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

const inputMoney: CSSProperties = {
  width: "100%",
  border: "1px solid #ccc",
  background: "#fff8d6",
  textAlign: "right",
  padding: "4px 6px",
  borderRadius: 4,
};

const inputPct: CSSProperties = {
  width: "100%",
  border: "1px solid #ccc",
  background: "#fff8d6",
  textAlign: "right",
  padding: "4px 6px",
  borderRadius: 4,
};

/* ------------------------ Locale Formatting ------------------------ */

const getLocale = () =>
  typeof navigator !== "undefined" ? navigator.language : "en-US";

const round1 = (v: number) => Math.round((v ?? 0) * 10) / 10;

/* ---------------------------- Interest Calc --------------------------- */

const calcInterest = (
  prevTotalDebt: number,
  currTotalDebt: number,
  interestRatePct: number
) => {
  const avgDebt = (prevTotalDebt + currTotalDebt) / 2;
  return Math.round(avgDebt * (interestRatePct / 100));
};

/* --------------------------------------------------------------------------- */

export default function FinancingTable({
  rows,
  computedRows,
  pnl,
  years,
  updateRow,
}: {
  rows: BalanceRow[];
  computedRows: ComputedRow[];
  pnl: PnlRow[];
  years: number[];
  updateRow: (year: number, field: keyof BalanceRow, value: number) => void;
}) {
  const locale = getLocale();

  const fmt = (v: number) =>
    (v ?? 0).toLocaleString(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

  const fmtPct = (v: number) =>
    (v ?? 0).toLocaleString(locale, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });

  const safeRows = rows ?? [];
  const safeComputed = computedRows ?? [];
  const safePnl = pnl ?? [];

  const totalDebt = safeRows.map(
    (r) => (r.longDebt ?? 0) + (r.shortDebt ?? 0)
  );

  const getNetResult = (year: number) =>
    safePnl.find((p) => p.year === year)?.netResult ?? 0;

  return (
    <div style={{ marginBottom: 32 }}>
      <h3 style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
        Financing Inputs
      </h3>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ ...head, ...COL_FIRST }}>Financing item</th>
            {years.map((y, idx) => (
              <th
                key={y}
                style={{ ...head, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}
              >
                {y}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {/* ---------------- EQUITY ---------------- */}
          <tr>
            <td style={left}>Equity</td>
            {years.map((year, idx) => {
              const compRow = safeComputed.find((c) => c.year === year);
              const equity = compRow?.equity ?? 0;

              return (
                <td key={year} style={cell}>
                  {idx === 0 ? (
                    <input
                      type="number"
                      value={
                        safeRows.find((r) => r.year === year)?.equityInput ?? 0
                      }
                      onChange={(e) =>
                        updateRow(year, "equityInput", Number(e.target.value))
                      }
                      step={100}
                      style={inputMoney}
                    />
                  ) : (
                    fmt(equity)
                  )}
                </td>
              );
            })}
          </tr>

          {/* NET RESULT ROW */}
          <tr>
            <td style={left}>Net Result (P&L)</td>
            {years.map((year) => (
              <td key={year} style={cell}>
                {fmt(getNetResult(year))}
              </td>
            ))}
          </tr>

          {/* LONG TERM DEBT */}
          <tr>
            <td style={left}>Long-term Debt</td>
            {years.map((year) => {
              const row = safeRows.find((r) => r.year === year);
              return (
                <td key={year} style={cell}>
                  <input
                    type="number"
                    value={row?.longDebt ?? 0}
                    onChange={(e) =>
                      updateRow(year, "longDebt", Number(e.target.value))
                    }
                    step={100}
                    style={inputMoney}
                  />
                </td>
              );
            })}
          </tr>

          {/* SHORT TERM DEBT */}
          <tr>
            <td style={left}>Short-term Debt</td>
            {years.map((year) => {
              const row = safeRows.find((r) => r.year === year);
              return (
                <td key={year} style={cell}>
                  <input
                    type="number"
                    value={row?.shortDebt ?? 0}
                    onChange={(e) =>
                      updateRow(year, "shortDebt", Number(e.target.value))
                    }
                    step={100}
                    style={inputMoney}
                  />
                </td>
              );
            })}
          </tr>

          {/* INTEREST RATE */}
          <tr>
            <td style={left}>Interest Rate (%)</td>
            {years.map((year, idx) => {
              const row = safeRows.find((r) => r.year === year);
              return (
                <td key={year} style={cell}>
                  {idx === 0 ? (
                    "N/A"
                  ) : (
                    <input
                      type="number"
                      value={row?.interestRatePct ?? 0}
                      onChange={(e) =>
                        updateRow(
                          year,
                          "interestRatePct",
                          round1(Number(e.target.value))
                        )
                      }
                      step={0.1}
                      style={inputPct}
                    />
                  )}
                </td>
              );
            })}
          </tr>

          {/* INTEREST */}
          <tr>
            <td style={left}>Interest</td>
            {years.map((year, idx) => {
              if (idx === 0) {
                const compRow = safeComputed.find((c) => c.year === year);
                return (
                  <td key={year} style={cell}>
                    {fmt(compRow?.interest ?? 0)}
                  </td>
                );
              }

              const prevDebt = totalDebt[idx - 1];
              const currDebt = totalDebt[idx];
              const rate =
                safeRows.find((r) => r.year === year)?.interestRatePct ?? 0;

              const interest = calcInterest(prevDebt, currDebt, rate);

              return (
                <td key={year} style={cell}>
                  {fmt(interest)}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
