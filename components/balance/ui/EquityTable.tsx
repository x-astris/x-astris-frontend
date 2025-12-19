"use client";

import type { CSSProperties } from "react";
import type { BalanceRow, ComputedRow } from "../types/balance";
import type { PnlModelRow } from "@/components/pnl/hooks/usePnlModel";

import {
  COL_FIRST,
  COL_FIRST_YEAR,
  COL_YEAR,
  head,
  cell,
  left,
} from "@/components/layout/tableLayout";

import { getLocale, fmtFactory } from "@/components/layout/formatters";

const inputMoney: CSSProperties = {
  width: "100%",
  border: "1px solid #ccc",
  background: "#fff8d6",
  textAlign: "right",
  padding: "4px 6px",
  borderRadius: 4,
};

export default function EquityTable({
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

  const getNetResult = (year: number) =>
    safePnl.find((p) => p.year === year)?.netResult ?? 0;

  return (
    <div style={{ marginBottom: 32 }}>
      <h3 style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
        Equity Financing Input
      </h3>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ ...head, ...COL_FIRST }}>Equity item</th>
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
          {/* ---------------- EQUITY ---------------- */}
          <tr>
            <td style={left}>Equity</td>
            {years.map((year, idx) => {
              const equity =
                safeComputed.find((c) => c.year === year)?.equity ?? 0;
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
                    <input
                      type="number"
                      value={row?.equityInput ?? 0}
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

          {/* ---------------- EQUITY CONTRIBUTION ---------------- */}
          <tr>
            <td style={left}>Equity contribution</td>
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
                  {idx === 0 ? "" : (
                    <input
                      type="number"
                      min={0}
                      value={row?.equityContribution ?? 0}
                      onChange={(e) =>
                        updateRow(
                          year,
                          "equityContribution",
                          Number(e.target.value)
                        )
                      }
                      step={100}
                      style={inputMoney}
                    />
                  )}
                </td>
              );
            })}
          </tr>

          {/* ---------------- DIVIDEND ---------------- */}
          <tr>
            <td style={left}>Dividend</td>
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
                  {idx === 0 ? "" : (
                    <input
                      type="number"
                      min={0}
                      value={row?.dividend ?? 0}
                      onChange={(e) =>
                        updateRow(year, "dividend", Number(e.target.value))
                      }
                      step={100}
                      style={inputMoney}
                    />
                  )}
                </td>
              );
            })}
          </tr>

          {/* ---------------- NET RESULT ---------------- */}
          <tr>
            <td style={left}>Net Result (P&amp;L)</td>
            {years.map((year, idx) => (
              <td
                key={year}
                style={{
                  ...cell,
                  ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR),
                }}
              >
                {idx === 0 ? "" : fmt(getNetResult(year))}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
