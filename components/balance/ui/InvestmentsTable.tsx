"use client";

import type { CSSProperties } from "react";
import { BalanceRow, ComputedRow } from "../types/balance";

/* ---------------------- SHARED LAYOUT ---------------------- */

import {
  COL_FIRST,
  COL_FIRST_YEAR,
  COL_YEAR,
  head,
  cell,
  left,
} from "@/components/layout/tableLayout";

/* ---------------------- FORMATTERS ---------------------- */

import {
  getLocale,
  fmtFactory,
} from "@/components/layout/formatters";

/* ---------------------- INPUT STYLES (LOCAL) ---------------------- */

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

/* ---------------------- HELPERS ---------------------- */

const round1 = (v: number) => Math.round((v ?? 0) * 10) / 10;

/* ---------------------- COMPONENT ---------------------- */

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
  const fmt = fmtFactory(getLocale());

  const safeRows = rows ?? [];
  const safeComputed = computedRows ?? [];

  return (
    <div style={{ marginBottom: 32 }}>
      <h3 style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
        Investments in Fixed Assets &amp; Depreciation
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
                <td
                  key={year}
                  style={{
                    ...cell,
                    ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR),
                  }}
                >
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
              const val = safeRows[idx]?.investments ?? 0;

              return (
                <td
                  key={year}
                  style={{
                    ...cell,
                    ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR),
                  }}
                >
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
                <td
                  key={year}
                  style={{
                    ...cell,
                    ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR),
                  }}
                >
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
              return (
                <td
                  key={year}
                  style={{
                    ...cell,
                    ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR),
                  }}
                >
                  {fmt(dep)}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
