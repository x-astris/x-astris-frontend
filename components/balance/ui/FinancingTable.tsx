"use client";

import type { CSSProperties } from "react";
import type { BalanceRow, ComputedRow } from "../types/balance";
import type { PnlModelRow } from "@/components/pnl/hooks/usePnlModel";

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

import { getLocale, fmtFactory } from "@/components/layout/formatters";

/* ---------------------- INPUT STYLES ---------------------- */

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

const round1 = (v: number) => Math.round(v * 10) / 10;

const calcInterest = (
  prevTotalDebt: number,
  currTotalDebt: number,
  interestRatePct: number
) => {
  const avgDebt = (prevTotalDebt + currTotalDebt) / 2;
  return Math.round(avgDebt * (interestRatePct / 100));
};

/* ---------------------- COMPONENT ---------------------- */

export default function FinancingTable({
  rows,
  computedRows,
  pnlModel,
  years,
  updateRow,
}: {
  rows: BalanceRow[];
  computedRows: ComputedRow[];
  pnlModel: PnlModelRow[];
  years: number[];
  updateRow: (year: number, field: keyof BalanceRow, value: number) => void;
}) {
  const fmt = fmtFactory(getLocale());

  const safeRows = rows ?? [];
  const safeComputed = computedRows ?? [];
  const safePnl = pnlModel ?? [];

  const totalDebt = safeRows.map(
    (r) => (r.longDebt ?? 0) + (r.shortDebt ?? 0)
  );

  const getNetResult = (year: number) =>
    safePnl.find((p) => p.year === year)?.netResult ?? 0;

  return (
    <div style={{ marginBottom: 32 }}>
      <h3 style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
        Debt Financing Input
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
          {/* ---------------- LONG TERM DEBT ---------------- */}
          <tr>
            <td style={left}>Long-term Debt</td>
            {years.map((year, idx) => {
              const row = safeRows.find((r) => r.year === year);
              return (
                <td
                  key={year}
                  style={{
                    ...cell,
                    ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR),
                  }}
                >
                  <input
                    type="number"
                    value={row?.longDebt ?? 0}
                    onChange={(e) =>
                      updateRow(year, "longDebt", Number(e.target.value))
                    }
                    step={100}
                    min={0}
                    style={inputMoney}
                  />
                </td>
              );
            })}
          </tr>

          {/* ---------------- SHORT TERM DEBT ---------------- */}
          <tr>
            <td style={left}>Short-term Debt</td>
            {years.map((year, idx) => {
              const row = safeRows.find((r) => r.year === year);
              return (
                <td
                  key={year}
                  style={{
                    ...cell,
                    ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR),
                  }}
                >
                  <input
                    type="number"
                    value={row?.shortDebt ?? 0}
                    onChange={(e) =>
                      updateRow(year, "shortDebt", Number(e.target.value))
                    }
                    step={100}
                    min={0}
                    style={inputMoney}
                  />
                </td>
              );
            })}
          </tr>

          {/* ---------------- INTEREST RATE ---------------- */}
          <tr>
            <td style={left}>Interest Rate (%)</td>
            {years.map((year, idx) => {
              const row = safeRows.find((r) => r.year === year);
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
                    min={0}
                    max={100}
                    value={row?.interestRatePct ?? 0}
                    onChange={(e) => {
                      const raw = Number(e.target.value);
                      const clamped = Math.min(100, Math.max(0, raw));
                      updateRow(year, "interestRatePct", round1(clamped));
                    }}
                    step={0.1}
                    style={inputPct}
                  />
                  )}
                </td>
              );
            })}
          </tr>

          {/* ---------------- INTEREST ---------------- */}
          <tr>
            <td style={left}>Interest</td>
            {years.map((year, idx) => {
              if (idx === 0) {
                const compRow = safeComputed.find((c) => c.year === year);
                return (
                  <td
                    key={year}
                    style={{
                      ...cell,
                      ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR),
                    }}
                  >
                    {fmt(compRow?.interest ?? 0)}
                  </td>
                );
              }

              const interest = calcInterest(
                totalDebt[idx - 1],
                totalDebt[idx],
                safeRows.find((r) => r.year === year)?.interestRatePct ?? 0
              );

              return (
                <td
                  key={year}
                  style={{
                    ...cell,
                    ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR),
                  }}
                >
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
