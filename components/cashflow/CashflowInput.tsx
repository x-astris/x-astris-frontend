"use client";

import { useEffect, useState, useMemo } from "react";
import type { CSSProperties } from "react";
import TopTabs from "../layout/TopTabs";
import { api } from "@/lib/api/client";
import { useComputedPnl } from "../balance/hooks/useComputedPnl";

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

/* ---------------------- LOCALE FORMATTER ---------------------- */

const getLocale = () =>
  typeof navigator !== "undefined" ? navigator.language : "en-US";

const fmtFactory = (locale: string) => (v: number) =>
  (v ?? 0).toLocaleString(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

const fmtAbs = (v: number, fmt: (n: number) => string) => {
  const n = Number(v);
  return fmt(Math.abs(n));
};

// For values where a NEGATIVE means cash outflow (EBIT, OCF, etc.)
const fmtNegToParens = (v: number, fmt: (n: number) => string) => {
  const n = Number(v);
  if (n < 0) return `(${fmt(Math.abs(n))})`;
  return fmt(Math.abs(n));
};

// For values where a POSITIVE means cash outflow (WC delta, taxes)
const fmtPosToParens = (v: number, fmt: (n: number) => string) => {
  const n = Number(v);
  if (n > 0) return `(${fmt(Math.abs(n))})`;
  return fmt(Math.abs(n));
};

export default function CashflowInput({ projectId, startYear, forecastYears, }: { projectId: string; startYear: number; forecastYears: number }) {

  
    const years = useMemo(
    () => Array.from({ length: forecastYears }, (_, i) => startYear + i),
    [startYear]
  );

  const [balance, setBalance] = useState<any[]>([]);
  const [pnl, setPnl] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const locale = getLocale();
  const fmt = fmtFactory(locale);

  /* --------------------------------------------------------------------
      LOAD BALANCE + PNL (ONLY STORED VALUES, NO RE-CALC)
  -------------------------------------------------------------------- */
  useEffect(() => {
    async function load() {
      try {
        const balRes = await api.get(`/balance?projectId=${projectId}`);
        const pnlRes = await api.get(`/pnl?projectId=${projectId}`);

        setBalance(balRes.data ?? []);
        setPnl(pnlRes.data ?? []);
        setLoading(false);
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, [projectId]);

  /* --------------------------------------------------------------------
      COMPUTED PNL (EBIT / TAX / NOPLAT / etc.)
  -------------------------------------------------------------------- */
  const pnlComputed = useComputedPnl(pnl, years);

  /* --------------------------------------------------------------------
      DIRECT WORKING CAPITAL FROM STORED BALANCE SHEET
  -------------------------------------------------------------------- */
  const wcByYear = useMemo(() => {
    return years.map((year) => {
      const b = balance.find((x) => x.year === year) || {};

      const inv = b.inventory ?? 0;
      const rec = b.receivables ?? 0;
      const oca = b.otherShortTermAssets ?? 0;
      const pay = b.payables ?? 0;
      const ocl = b.otherShortTermLiabilities ?? 0;

      const wc = inv + rec + oca - pay - ocl;

      return { year, inv, rec, oca, pay, ocl, wc };
    });
  }, [balance]);

  /* --------------------------------------------------------------------
      CASH FLOW CALCULATION
  -------------------------------------------------------------------- */
  const cashflow = useMemo(() => {
    return years.map((year, idx) => {
      const pnlRow = pnlComputed[idx];
      const bNow = balance.find((x) => x.year === year);

      /* FIRST YEAR — no WC changes */
      if (idx === 0) {
        return {
          year,
          operating: {
            ebit: pnlRow.ebit,
            tax: pnlRow.taxes,
            noplat: pnlRow.ebit - pnlRow.taxes,
            depreciation: pnlRow.depreciation,
            wcChange: 0,
            ocf: pnlRow.ebit - pnlRow.taxes + pnlRow.depreciation,
          },
          wcDetails: {
            invChange: 0,
            recChange: 0,
            ocaChange: 0,
            payChange: 0,
            oclChange: 0,
          },
          investing: {
            investments: bNow?.investments ?? 0,
          },
          financing: {
            interest: pnlRow.interest,
            dLong: 0,
            dShort: 0,
          },
          netChange: 0,
          cashCheck: 0,
        };
      }

      /* FOLLOWING YEARS */
      const wcNow = wcByYear[idx];
      const wcPrev = wcByYear[idx - 1];

      const bPrev = balance.find((x) => x.year === years[idx - 1]);

      const invChange = wcNow.inv - wcPrev.inv;
      const recChange = wcNow.rec - wcPrev.rec;
      const ocaChange = wcNow.oca - wcPrev.oca;
      const payChange = wcNow.pay - wcPrev.pay;
      const oclChange = wcNow.ocl - wcPrev.ocl;

      const wcChange = wcNow.wc - wcPrev.wc;

      const ebit = pnlRow.ebit;
      const tax = pnlRow.taxes;
      const noplat = ebit - tax;
      const depreciation = pnlRow.depreciation;

      const ocf = noplat + depreciation - wcChange;

      const investments = bNow?.investments ?? 0;

      const dLong = (bNow?.longDebt ?? 0) - (bPrev?.longDebt ?? 0);
      const dShort = (bNow?.shortDebt ?? 0) - (bPrev?.shortDebt ?? 0);

      const interest = pnlRow.interest ?? 0;

      const netChange = ocf - investments - interest + dLong + dShort;

      const cashNow = bNow?.cash ?? 0;
      const cashPrev = bPrev?.cash ?? 0;
      const cashCheck = cashNow - cashPrev;

      return {
        year,
        operating: { ebit, tax, noplat, depreciation, wcChange, ocf },
        wcDetails: { invChange, recChange, ocaChange, payChange, oclChange },
        investing: { investments },
        financing: { interest, dLong, dShort },
        netChange,
        cashCheck,
      };
    });
  }, [balance, pnlComputed, wcByYear]);

  /* --------------------------------------------------------------------
      SAVE (optional, for the Save button)
  -------------------------------------------------------------------- */
  async function save() {
    try {
      setSaving(true);
      setSaved(false);
      setError("");

      await new Promise((r) => setTimeout(r, 200));

      setSaved(true);
    } catch {
      setError("Failed to save cash flow");
    } finally {
      setSaving(false);
    }
  }

  /* --------------------------------------------------------------------
      UI
  -------------------------------------------------------------------- */
  if (loading) return <p>Loading cash flow…</p>;

  return (
    <>
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          background: "white",
        }}
      >
        <TopTabs
          projectId={projectId}
          onSave={save}
          saving={saving}
          saved={saved}
          error={error}
        />
      </div>

      <div style={{ padding: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: "bold", marginBottom: 12 }}>
          Cash Flow Statement
        </h1>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: 8,
          }}
        >
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
           
           {/* ---------- OPERATING CASH FLOW ---------- */}
<tr style={{ background: "#e8e8e8", fontWeight: "bold" }}>
  <td style={left}>Operating Cash Flow</td>
  {years.map((y, idx) => (
    <td key={y} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }} />
  ))}
</tr>

<tr>
  <td style={left}>EBIT</td>
  {cashflow.map((c, idx) => (
    <td key={c.year} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
      {c.year === 2025 ? "" : fmtNegToParens(c.operating.ebit, fmt)}
    </td>
  ))}
</tr>

<tr>
  <td style={left}>Taxes</td>
  {cashflow.map((c, idx) => (
    <td key={c.year} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
      {c.year === 2025 ? "" : fmtPosToParens(c.operating.tax, fmt)}
    </td>
  ))}
</tr>

<tr>
  <td style={left}>NOPLAT</td>
  {cashflow.map((c, idx) => (
    <td key={c.year} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
      {c.year === 2025 ? "" : fmtNegToParens(c.operating.noplat, fmt)}
    </td>
  ))}
</tr>

<tr>
  <td style={left}>+ Depreciation</td>
  {cashflow.map((c, idx) => (
    <td key={c.year} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
      {c.year === 2025 ? "" : fmtNegToParens(c.operating.depreciation, fmt)}
    </td>
  ))}
</tr>

{/* ---------- WORKING CAPITAL ---------- */}
<tr style={{ background: "#e8e8e8", fontWeight: "bold" }}>
  <td style={left}>Working Capital Changes</td>
  {years.map((y, idx) => (
    <td key={y} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }} />
  ))}
</tr>

<tr>
  <td style={left}>Δ Inventory</td>
  {cashflow.map((c, idx) => (
    <td key={c.year} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
      {c.year === 2025 ? "" : fmtPosToParens(c.wcDetails.invChange, fmt)}
    </td>
  ))}
</tr>

<tr>
  <td style={left}>Δ Receivables</td>
  {cashflow.map((c, idx) => (
    <td key={c.year} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
      {c.year === 2025 ? "" : fmtPosToParens(c.wcDetails.recChange, fmt)}
    </td>
  ))}
</tr>

<tr>
  <td style={left}>Δ Other Current Assets</td>
  {cashflow.map((c, idx) => (
    <td key={c.year} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
      {c.year === 2025 ? "" : fmtPosToParens(c.wcDetails.ocaChange, fmt)}
    </td>
  ))}
</tr>

<tr>
  <td style={left}>Δ Payables</td>
  {cashflow.map((c, idx) => (
    <td key={c.year} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
      {c.year === 2025 ? "" : fmtNegToParens(c.wcDetails.payChange, fmt)}
    </td>
  ))}
</tr>

<tr>
  <td style={left}>Δ Other Current Liabilities</td>
  {cashflow.map((c, idx) => (
    <td key={c.year} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
      {c.year === 2025 ? "" : fmtNegToParens(c.wcDetails.oclChange, fmt)}
    </td>
  ))}
</tr>

<tr style={{ fontWeight: "bold" }}>
  <td style={left}>Δ Working Capital</td>
  {cashflow.map((c, idx) => (
    <td key={c.year} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
      {c.year === 2025 ? "" : fmtPosToParens(c.operating.wcChange, fmt)}
    </td>
  ))}
</tr>

<tr style={{ fontWeight: "bold", background: "#f7f7f7" }}>
  <td style={left}>Operating Cash Flow</td>
  {cashflow.map((c, idx) => (
    <td key={c.year} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
      {c.year === 2025 ? "" : fmtNegToParens(c.operating.ocf, fmt)}
    </td>
  ))}
</tr>

{/* ---------- INVESTING ---------- */}
<tr style={{ background: "#e8e8e8", fontWeight: "bold" }}>
  <td style={left}>Investing Cash Flow</td>
  {years.map((y, idx) => (
    <td key={y} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }} />
  ))}
</tr>

<tr>
  <td style={left}>Investments</td>
  {cashflow.map((c, idx) => (
    <td key={c.year} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
      {c.year === 2025 ? "" : fmtPosToParens(c.investing.investments, fmt)}
    </td>
  ))}
</tr>

{/* ---------- FINANCING ---------- */}
<tr style={{ background: "#e8e8e8", fontWeight: "bold" }}>
  <td style={left}>Financing Cash Flow</td>
  {years.map((y, idx) => (
    <td key={y} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }} />
  ))}
</tr>

<tr>
  <td style={left}>Interest</td>
  {cashflow.map((c, idx) => (
    <td key={c.year} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
      {c.year === 2025 ? "" : fmtPosToParens(c.financing.interest, fmt)}
    </td>
  ))}
</tr>

<tr>
  <td style={left}>Δ Long-term Debt</td>
  {cashflow.map((c, idx) => (
    <td key={c.year} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
      {c.year === 2025 ? "" : fmtNegToParens(c.financing.dLong, fmt)}
    </td>
  ))}
</tr>

<tr>
  <td style={left}>Δ Short-term Debt</td>
  {cashflow.map((c, idx) => (
    <td key={c.year} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
      {c.year === 2025 ? "" : fmtNegToParens(c.financing.dShort, fmt)}
    </td>
  ))}
</tr>

{/* ---------- NET CASH ---------- */}
<tr style={{ fontWeight: "bold", background: "#e8e8e8" }}>
  <td style={left}>Net Change in Cash</td>
  {cashflow.map((c, idx) => (
    <td key={c.year} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
      {c.year === 2025 ? "" : fmtNegToParens(c.netChange, fmt)}
    </td>
  ))}
</tr>

<tr style={{ background: "#f7f7f7" }}>
  <td style={left}>Balance Sheet Cash Change</td>
  {cashflow.map((c, idx) => (
    <td key={c.year} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
      {c.year === 2025 ? "" : fmt(c.cashCheck)}
    </td>
  ))}
</tr>



          </tbody>
        </table>
      </div>
    </>
  );
}
