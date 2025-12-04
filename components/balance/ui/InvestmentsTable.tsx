"use client";

import type { CSSProperties } from "react";
import { BalanceRow, ComputedRow } from "../types/balance";

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

/* ----------------------------- FORMATTERS ----------------------------- */

/** Use browser locale automatically */
const getLocale = () =>
  typeof navigator !== "undefined" ? navigator.language : "en-US";

const round1 = (v: number) => Math.round((v ?? 0) * 10) / 10;

/* --------------------------------------------------------------------- */

export default function InvestmentsTable({
  rows,
  computedRows,
  years,
  updateRow,
}: {
  rows: BalanceRow[];
  computedRows: ComputedRow[];
  years: number[];
  updateRow: (year: number, field: keyof BalanceRow, value: number) => void;
}) {
  const locale = getLocale();

  /** formatted numbers for display cells */
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

  return (
    <div style={{ marginBottom: 32 }}>
      <h3 style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
        Investments in Fixed Assets & Depreciation
      </h3>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ ...head, ...COL_FIRST }}>Investments</th>

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
          {/* ---------------- FIXED ASSETS ---------------- */}
          <tr>
            <td style={left}>Fixed Assets</td>

            {years.map((year, idx) => {
              const fa = safeComputed[idx]?.fixedAssets ?? 0;

              return (
                <td key={year} style={cell}>
                  {idx === 0 ? (
                    <input
                      type="number"
                      value={safeRows[0]?.fixedAssetsInput ?? 0}
                      onChange={(e) =>
                        updateRow(
                          year,
                          "fixedAssetsInput",
                          Number(e.target.value)
                        )
                      }
                      step={500}
                      style={inputMoney}
                    />
                  ) : (
                    fmt(fa)
                  )}
                </td>
              );
            })}
          </tr>

          {/* ---------------- INVESTMENTS ---------------- */}
          <tr>
            <td style={left}>Investments</td>

            {years.map((year, idx) => {
              const row = safeRows[idx];
              const val = row?.investments ?? 0;

              return (
                <td key={year} style={cell}>
                  {idx === 0 ? (
                    "N/A"
                  ) : (
                    <input
                      type="number"
                      value={val}
                      onChange={(e) =>
                        updateRow(year, "investments", Number(e.target.value))
                      }
                      step={500}
                      style={inputMoney}
                    />
                  )}
                </td>
              );
            })}
          </tr>

          {/* ---------------- DEPRECIATION % ---------------- */}
          <tr>
            <td style={left}>Depreciation %</td>

            {years.map((year, idx) => {
              const row = safeRows[idx];

              return (
                <td key={year} style={cell}>
                  {idx === 0 ? (
                    "N/A"
                  ) : (
                    <input
                      type="number"
                      value={row?.depreciationPct ?? 0}
                      onChange={(e) =>
                        updateRow(
                          year,
                          "depreciationPct",
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

          {/* ---------------- DEPRECIATION (CALC) ---------------- */}
          <tr>
            <td style={left}>Depreciation</td>

            {years.map((year, idx) => {
              const dep = safeComputed[idx]?.depreciation ?? 0;
              return <td key={year} style={cell}>{fmt(dep)}</td>;
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
