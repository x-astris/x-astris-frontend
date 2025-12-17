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
  fmtNegToParens,
  fmtPosToParens,
} from "@/components/layout/formatters";

export default function CashflowTable({
  cashflow,
  years,
}: {
  cashflow: any[];
  years: number[];
}) {
  const fmt = fmtFactory(getLocale());

  const blankOr = (idx: number, v: number, f: (v: number, fmt: any) => string) =>
    idx === 0 ? "" : f(v, fmt);

  return (
    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 8 }}>
      <thead>
        <tr>
          <th style={{ ...head, ...COL_FIRST }}>Line</th>
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
        {/* ================= OPERATING ================= */}
        <tr style={{ background: "#e8e8e8", fontWeight: "bold" }}>
          <td style={left}>Operating Cash Flow</td>
          {years.map((y, idx) => (
            <td
              key={y}
              style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}
            />
          ))}
        </tr>

        <tr>
          <td style={left}>EBIT</td>
          {cashflow.map((c, idx) => (
            <td key={c.year} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
              {blankOr(idx, c.operating.ebit, fmtNegToParens)}
            </td>
          ))}
        </tr>

        <tr>
          <td style={left}>Taxes</td>
          {cashflow.map((c, idx) => (
            <td key={c.year} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
              {blankOr(idx, c.operating.tax, fmtPosToParens)}
            </td>
          ))}
        </tr>

        <tr>
          <td style={left}>NOPLAT</td>
          {cashflow.map((c, idx) => (
            <td key={c.year} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
              {blankOr(idx, c.operating.noplat, fmtNegToParens)}
            </td>
          ))}
        </tr>

        <tr>
          <td style={left}>+ Depreciation</td>
          {cashflow.map((c, idx) => (
            <td key={c.year} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
              {blankOr(idx, c.operating.depreciation, fmtNegToParens)}
            </td>
          ))}
        </tr>

        {/* ================= WORKING CAPITAL ================= */}
        <tr style={{ background: "#e8e8e8", fontWeight: "bold" }}>
          <td style={left}>Working Capital Changes</td>
          {years.map((y, idx) => (
            <td
              key={y}
              style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}
            />
          ))}
        </tr>

        <tr>
          <td style={left}>Δ Inventory</td>
          {cashflow.map((c, idx) => (
            <td key={c.year} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
              {blankOr(idx, c.wcDetails.invChange, fmtPosToParens)}
            </td>
          ))}
        </tr>

        <tr>
          <td style={left}>Δ Receivables</td>
          {cashflow.map((c, idx) => (
            <td key={c.year} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
              {blankOr(idx, c.wcDetails.recChange, fmtPosToParens)}
            </td>
          ))}
        </tr>

        <tr>
          <td style={left}>Δ Other Current Assets</td>
          {cashflow.map((c, idx) => (
            <td key={c.year} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
              {blankOr(idx, c.wcDetails.ocaChange, fmtPosToParens)}
            </td>
          ))}
        </tr>

        <tr>
          <td style={left}>Δ Payables</td>
          {cashflow.map((c, idx) => (
            <td key={c.year} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
              {blankOr(idx, c.wcDetails.payChange, fmtNegToParens)}
            </td>
          ))}
        </tr>

        <tr>
          <td style={left}>Δ Other Current Liabilities</td>
          {cashflow.map((c, idx) => (
            <td key={c.year} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
              {blankOr(idx, c.wcDetails.oclChange, fmtNegToParens)}
            </td>
          ))}
        </tr>

        <tr style={{ fontWeight: "bold", background: "#f7f7f7" }}>
          <td style={left}>Operating Cash Flow</td>
          {cashflow.map((c, idx) => (
            <td key={c.year} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
              {blankOr(idx, c.operating.ocf, fmtNegToParens)}
            </td>
          ))}
        </tr>

        {/* ================= INVESTING ================= */}
        <tr style={{ background: "#e8e8e8", fontWeight: "bold" }}>
          <td style={left}>Investing Cash Flow</td>
          {years.map((y, idx) => (
            <td
              key={y}
              style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}
            />
          ))}
        </tr>

        <tr>
          <td style={left}>Investments</td>
          {cashflow.map((c, idx) => (
            <td key={c.year} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
              {blankOr(idx, c.investing.investments, fmtPosToParens)}
            </td>
          ))}
        </tr>

        {/* ================= FINANCING ================= */}
        <tr style={{ background: "#e8e8e8", fontWeight: "bold" }}>
          <td style={left}>Financing Cash Flow</td>
          {years.map((y, idx) => (
            <td
              key={y}
              style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}
            />
          ))}
        </tr>

        <tr>
          <td style={left}>Interest</td>
          {cashflow.map((c, idx) => (
            <td key={c.year} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
              {blankOr(idx, c.financing.interest, fmtPosToParens)}
            </td>
          ))}
        </tr>

        <tr>
          <td style={left}>Δ Long-term Debt</td>
          {cashflow.map((c, idx) => (
            <td key={c.year} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
              {blankOr(idx, c.financing.dLong, fmtNegToParens)}
            </td>
          ))}
        </tr>

        <tr>
          <td style={left}>Δ Short-term Debt</td>
          {cashflow.map((c, idx) => (
            <td key={c.year} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
              {blankOr(idx, c.financing.dShort, fmtNegToParens)}
            </td>
          ))}
        </tr>

        {/* ================= NET CASH ================= */}
        <tr style={{ fontWeight: "bold", background: "#e8e8e8" }}>
          <td style={left}>Net Change in Cash</td>
          {cashflow.map((c, idx) => (
            <td key={c.year} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
              {blankOr(idx, c.netChange, fmtNegToParens)}
            </td>
          ))}
        </tr>

      </tbody>
    </table>
  );
}
