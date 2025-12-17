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

import type { PnlModelRow } from "@/components/pnl/hooks/usePnlModel";

/* ======================================================
   COMPONENT
====================================================== */

export default function PnlOutputTable({
  computed,
  years,
}: {
  computed: PnlModelRow[];
  years: number[];
}) {
  const fmt = fmtFactory(getLocale());

  const byYear = (year: number) =>
    computed.find((r) => r.year === year);

  return (
    <>
      <h2 style={{ fontSize: 22, fontWeight: "bold", marginBottom: 12 }}>
        Profit and Loss Statement
      </h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: 24,
        }}
      >
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
          {/* REVENUE */}
          <tr>
            <td style={{ ...left, fontWeight: "bold" }}>Revenue</td>
            {years.map((y, idx) => {
              const c = byYear(y);
              return (
                <td
                  key={y}
                  style={{
                    ...cell,
                    fontWeight: "bold",
                    ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR),
                  }}
                >
                  {c ? fmtNormal(c.revenue, fmt) : "—"}
                </td>
              );
            })}
          </tr>

          {/* COGS */}
          <tr>
            <td style={left}>COGS</td>
            {years.map((y, idx) => {
              const c = byYear(y);
              return (
                <td
                  key={y}
                  style={{
                    ...cell,
                    ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR),
                  }}
                >
                  {c ? fmtCost(c.cogs, fmt) : "—"}
                </td>
              );
            })}
          </tr>

          {/* GROSS MARGIN */}
          <tr>
            <td style={{ ...left, fontWeight: "bold" }}>Gross Margin</td>
            {years.map((y, idx) => {
              const c = byYear(y);
              return (
                <td
                  key={y}
                  style={{
                    ...cell,
                    fontWeight: "bold",
                    ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR),
                  }}
                >
                  {c ? fmtNormal(c.grossMargin, fmt) : "—"}
                </td>
              );
            })}
          </tr>

          {/* OPEX */}
          <tr>
            <td style={left}>OPEX</td>
            {years.map((y, idx) => {
              const c = byYear(y);
              return (
                <td
                  key={y}
                  style={{
                    ...cell,
                    ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR),
                  }}
                >
                  {c ? fmtCost(c.opex, fmt) : "—"}
                </td>
              );
            })}
          </tr>

          {/* EBITDA */}
          <tr>
            <td style={{ ...left, fontWeight: "bold" }}>EBITDA</td>
            {years.map((y, idx) => {
              const c = byYear(y);
              return (
                <td
                  key={y}
                  style={{
                    ...cell,
                    fontWeight: "bold",
                    ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR),
                  }}
                >
                  {c ? fmtNormal(c.EBITDA, fmt) : "—"}
                </td>
              );
            })}
          </tr>

          {/* DEPRECIATION */}
          <tr>
            <td style={left}>Depreciation</td>
            {years.map((y, idx) => {
              const c = byYear(y);
              return (
                <td
                  key={y}
                  style={{
                    ...cell,
                    ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR),
                  }}
                >
                  {c ? fmtCost(c.dep, fmt) : "—"}
                </td>
              );
            })}
          </tr>

          {/* EBIT */}
          <tr>
            <td style={{ ...left, fontWeight: "bold" }}>EBIT</td>
            {years.map((y, idx) => {
              const c = byYear(y);
              return (
                <td
                  key={y}
                  style={{
                    ...cell,
                    fontWeight: "bold",
                    ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR),
                  }}
                >
                  {c ? fmtNormal(c.EBIT, fmt) : "—"}
                </td>
              );
            })}
          </tr>

          {/* INTEREST */}
          <tr>
            <td style={left}>Interest</td>
            {years.map((y, idx) => {
              const c = byYear(y);
              return (
                <td
                  key={y}
                  style={{
                    ...cell,
                    ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR),
                  }}
                >
                  {c ? fmtCost(c.int, fmt) : "—"}
                </td>
              );
            })}
          </tr>

          {/* EBT */}
          <tr>
            <td style={{ ...left, fontWeight: "bold" }}>EBT</td>
            {years.map((y, idx) => {
              const c = byYear(y);
              return (
                <td
                  key={y}
                  style={{
                    ...cell,
                    fontWeight: "bold",
                    ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR),
                  }}
                >
                  {c ? fmtNormal(c.EBT, fmt) : "—"}
                </td>
              );
            })}
          </tr>

          {/* TAX */}
          <tr>
            <td style={left}>Tax</td>
            {years.map((y, idx) => {
              const c = byYear(y);
              return (
                <td
                  key={y}
                  style={{
                    ...cell,
                    ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR),
                  }}
                >
                  {c ? fmtCost(c.tax, fmt) : "—"}
                </td>
              );
            })}
          </tr>

          {/* NET RESULT */}
          <tr>
            <td style={{ ...left, fontWeight: "bold" }}>Net Result</td>
            {years.map((y, idx) => {
              const c = byYear(y);
              return (
                <td
                  key={y}
                  style={{
                    ...cell,
                    fontWeight: "bold",
                    ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR),
                  }}
                >
                  {c ? fmtNormal(c.netResult, fmt) : "—"}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </>
  );
}
