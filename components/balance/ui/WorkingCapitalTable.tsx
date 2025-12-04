"use client";

import { useEffect, useRef, type CSSProperties, type ChangeEvent } from "react";
import { RatioRow, BalanceRow } from "../types/balance";
import type { RatioFrontendField } from "../hooks/useBalanceData";

/* -------------------------------- STYLES ------------------------------- */
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

const left: CSSProperties = { ...cell, textAlign: "left" };

const inputMoney: CSSProperties = {
  width: "100%",
  border: "1px solid #ccc",
  background: "#fff8d6",
  padding: "4px 6px",
  textAlign: "right",
  borderRadius: 4,
};

const inputPct: CSSProperties = {
  width: "100%",
  border: "1px solid #ccc",
  background: "#fff8d6",
  padding: "4px 6px",
  textAlign: "right",
  borderRadius: 4,
};

/* ----------------------- Locale helpers ------------------------- */
const getLocale = () =>
  typeof navigator !== "undefined" ? navigator.language : "en-US";

const fmt = (v: number, locale: string) =>
  (v ?? 0).toLocaleString(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

/* ===============================================================
   Helpers
=============================================================== */

function computeFromKpis(
  field:
    | "inventory"
    | "receivables"
    | "payables"
    | "otherCurrentAssets"
    | "otherCurrentLiabilities",
  ratios: RatioRow,
  revenue: number,
  cogs: number
) {
  switch (field) {
    case "inventory":
      return Math.round((ratios.dio / 365) * cogs);
    case "receivables":
      return Math.round((ratios.dso / 365) * revenue);
    case "payables":
      return Math.round((ratios.dpo / 365) * cogs);
    case "otherCurrentAssets":
      return Math.round((ratios.otherCurrentAssetsPct / 100) * revenue);
    case "otherCurrentLiabilities":
      return Math.round((ratios.otherCurrentLiabilitiesPct / 100) * revenue);
  }
}

/** Compute base KPIs from 2025 WC + P&L */
function computeBaseKpis(row: BalanceRow, pnlYear: any) {
  const revenue = pnlYear?.revenue ?? 0;
  const cogs = pnlYear?.cogs ?? 0;

  const dio = cogs > 0 ? Math.round((row.inventory / cogs) * 365) : 0;
  const dso = revenue > 0 ? Math.round((row.receivables / revenue) * 365) : 0;
  const dpo = cogs > 0 ? Math.round((row.payables / cogs) * 365) : 0;
  const ocaPct =
    revenue > 0
      ? Math.round((row.otherCurrentAssets / revenue) * 100)
      : 0;
  const oclPct =
    revenue > 0
      ? Math.round((row.otherCurrentLiabilities / revenue) * 100)
      : 0;

  return { dio, dso, dpo, ocaPct, oclPct };
}

/* ======================================================================
   COMPONENT
====================================================================== */

export default function WorkingCapitalTable({
  rows,
  pnl,
  ratios,
  years,
  updateRow,
  updateRatio,
  setRatios,
}: {
  rows: BalanceRow[];
  pnl: any[];
  ratios: RatioRow[];
  years: number[];
  updateRow: (year: number, field: keyof BalanceRow, value: number) => void;
  updateRatio: (
    year: number,
    field: RatioFrontendField,
    value: number
  ) => void;
  setRatios: React.Dispatch<React.SetStateAction<RatioRow[]>>;
}) {
  const locale = getLocale();
  if (!rows.length || !pnl.length || !ratios.length) return null;

  const year1 = years[0];
  const initialPrefillDone = useRef(false);

  const row2025 = rows.find((r) => r.year === year1);
  const pnl2025 = pnl.find((p) => p.year === year1);

  /* --------------------------------------------------------------
     1) Initial prefill (once):
        If all KPIs are 0 and 2025 WC+PnL have data → prefill 2025–2029
  -------------------------------------------------------------- */
  useEffect(() => {
    if (initialPrefillDone.current) return;
    if (!row2025 || !pnl2025) return;

    const allZero = ratios.every(
      (r) =>
        r.dio === 0 &&
        r.dso === 0 &&
        r.dpo === 0 &&
        r.otherCurrentAssetsPct === 0 &&
        r.otherCurrentLiabilitiesPct === 0
    );

    if (!allZero) {
      initialPrefillDone.current = true;
      return;
    }

    const { dio, dso, dpo, ocaPct, oclPct } = computeBaseKpis(
      row2025,
      pnl2025
    );

    // Prefill all years with these KPIs
    setRatios((prev) =>
      prev.map((r) => ({
        ...r,
        dio,
        dso,
        dpo,
        otherCurrentAssetsPct: ocaPct,
        otherCurrentLiabilitiesPct: oclPct,
      }))
    );

    initialPrefillDone.current = true;
  }, [row2025, pnl2025, ratios, setRatios]);

  /* --------------------------------------------------------------
     2) Handler: when a 2025 WC value changes
        - Update WC in backend via updateRow
        - Recompute 2025 KPIs
        - Overwrite KPIs for ALL years with new 2025 KPIs
        => "Last edit wins": 2025 change overrides any KPI edits
  -------------------------------------------------------------- */
  function handleYear1WCChange(
    field: keyof BalanceRow,
    year: number
  ) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const value = Number(e.target.value);
      updateRow(year, field, value);

      const existing2025 = rows.find((r) => r.year === year1);
      if (!existing2025 || !pnl2025) return;

      const updated2025: BalanceRow = {
        ...existing2025,
        [field]: value,
      };

      const { dio, dso, dpo, ocaPct, oclPct } = computeBaseKpis(
        updated2025,
        pnl2025
      );

      // Overwrite ALL years with new base KPIs
      setRatios((prev) =>
        prev.map((r) => ({
          ...r,
          dio,
          dso,
          dpo,
          otherCurrentAssetsPct: ocaPct,
          otherCurrentLiabilitiesPct: oclPct,
        }))
      );
    };
  }

  /* --------------------------------------------------------------
     3) RENDER — WORKING CAPITAL VALUES
  -------------------------------------------------------------- */
  return (
    <div style={{ marginBottom: 48 }}>
      <h3 style={{ fontSize: 18, fontWeight: "bold", marginBottom: 16 }}>
        Working Capital Inputs
      </h3>

      <table
        style={{ width: "100%", borderCollapse: "collapse", marginBottom: 32 }}
      >
        <thead>
          <tr>
            <th style={{ ...head, ...COL_FIRST }}>Working Capital Item</th>
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
          {/* INVENTORY */}
          <tr>
            <td style={left}>Inventory</td>
            {years.map((year, idx) => {
              const p = pnl.find((x) => x.year === year);
              const revenue = p?.revenue ?? 0;
              const cogs = p?.cogs ?? 0;

              const val =
                year === year1
                  ? rows[idx].inventory
                  : computeFromKpis("inventory", ratios[idx], revenue, cogs);

              return (
                <td key={year} style={cell}>
                  {year === year1 ? (
                    <input
                      type="number"
                      style={inputMoney}
                      value={rows[idx].inventory}
                      onChange={handleYear1WCChange("inventory", year)}
                      step={100}
                    />
                  ) : (
                    fmt(val, locale)
                  )}
                </td>
              );
            })}
          </tr>

          {/* RECEIVABLES */}
          <tr>
            <td style={left}>Receivables</td>
            {years.map((year, idx) => {
              const p = pnl.find((x) => x.year === year);
              const revenue = p?.revenue ?? 0;
              const cogs = p?.cogs ?? 0;

              const val =
                year === year1
                  ? rows[idx].receivables
                  : computeFromKpis("receivables", ratios[idx], revenue, cogs);

              return (
                <td key={year} style={cell}>
                  {year === year1 ? (
                    <input
                      type="number"
                      style={inputMoney}
                      value={rows[idx].receivables}
                      onChange={handleYear1WCChange("receivables", year)}
                      step={100}
                    />
                  ) : (
                    fmt(val, locale)
                  )}
                </td>
              );
            })}
          </tr>

          {/* OTHER CURRENT ASSETS */}
          <tr>
            <td style={left}>Other Assets</td>
            {years.map((year, idx) => {
              const p = pnl.find((x) => x.year === year);
              const revenue = p?.revenue ?? 0;
              const cogs = p?.cogs ?? 0;

              const val =
                year === year1
                  ? rows[idx].otherCurrentAssets
                  : computeFromKpis(
                      "otherCurrentAssets",
                      ratios[idx],
                      revenue,
                      cogs
                    );

              return (
                <td key={year} style={cell}>
                  {year === year1 ? (
                    <input
                      type="number"
                      style={inputMoney}
                      value={rows[idx].otherCurrentAssets}
                      onChange={handleYear1WCChange(
                        "otherCurrentAssets",
                        year
                      )}
                      step={100}
                    />
                  ) : (
                    fmt(val, locale)
                  )}
                </td>
              );
            })}
          </tr>

          {/* PAYABLES */}
          <tr>
            <td style={left}>Payables</td>
            {years.map((year, idx) => {
              const p = pnl.find((x) => x.year === year);
              const revenue = p?.revenue ?? 0;
              const cogs = p?.cogs ?? 0;

              const val =
                year === year1
                  ? rows[idx].payables
                  : computeFromKpis("payables", ratios[idx], revenue, cogs);

              return (
                <td key={year} style={cell}>
                  {year === year1 ? (
                    <input
                      type="number"
                      style={inputMoney}
                      value={rows[idx].payables}
                      onChange={handleYear1WCChange("payables", year)}
                      step={100}
                    />
                  ) : (
                    fmt(val, locale)
                  )}
                </td>
              );
            })}
          </tr>

          {/* OTHER CURRENT LIABILITIES */}
          <tr>
            <td style={left}>Other Liabilities</td>
            {years.map((year, idx) => {
              const p = pnl.find((x) => x.year === year);
              const revenue = p?.revenue ?? 0;
              const cogs = p?.cogs ?? 0;

              const val =
                year === year1
                  ? rows[idx].otherCurrentLiabilities
                  : computeFromKpis(
                      "otherCurrentLiabilities",
                      ratios[idx],
                      revenue,
                      cogs
                    );

              return (
                <td key={year} style={cell}>
                  {year === year1 ? (
                    <input
                      type="number"
                      style={inputMoney}
                      value={rows[idx].otherCurrentLiabilities}
                      onChange={handleYear1WCChange(
                        "otherCurrentLiabilities",
                        year
                      )}
                      step={100}
                    />
                  ) : (
                    fmt(val, locale)
                  )}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>

      {/* ======================================================
          KPI TABLE
         ====================================================== */}
      <h3 style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
        Working Capital KPIs
      </h3>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ ...head, ...COL_FIRST }}>KPI</th>
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
          {/* DIO */}
          <tr>
            <td style={left}>DIO (days)</td>
            {years.map((year, idx) => (
              <td
                key={year}
                style={{
                  ...cell,
                  background: idx === 0 ? "#f7f7f7" : undefined,
                }}
              >
                {idx === 0 ? (
                  fmt(ratios[idx].dio, locale)
                ) : (
                  <input
                    type="number"
                    style={inputPct}
                    value={ratios[idx].dio}
                    onChange={(e) =>
                      updateRatio(year, "dio", Number(e.target.value))
                    }
                  />
                )}
              </td>
            ))}
          </tr>

          {/* DSO */}
          <tr>
            <td style={left}>DSO (days)</td>
            {years.map((year, idx) => (
              <td
                key={year}
                style={{
                  ...cell,
                  background: idx === 0 ? "#f7f7f7" : undefined,
                }}
              >
                {idx === 0 ? (
                  fmt(ratios[idx].dso, locale)
                ) : (
                  <input
                    type="number"
                    style={inputPct}
                    value={ratios[idx].dso}
                    onChange={(e) =>
                      updateRatio(year, "dso", Number(e.target.value))
                    }
                  />
                )}
              </td>
            ))}
          </tr>

          {/* DPO */}
          <tr>
            <td style={left}>DPO (days)</td>
            {years.map((year, idx) => (
              <td
                key={year}
                style={{
                  ...cell,
                  background: idx === 0 ? "#f7f7f7" : undefined,
                }}
              >
                {idx === 0 ? (
                  fmt(ratios[idx].dpo, locale)
                ) : (
                  <input
                    type="number"
                    style={inputPct}
                    value={ratios[idx].dpo}
                    onChange={(e) =>
                      updateRatio(year, "dpo", Number(e.target.value))
                    }
                  />
                )}
              </td>
            ))}
          </tr>

          {/* OCA % */}
          <tr>
            <td style={left}>Other Current Assets (% revenue)</td>
            {years.map((year, idx) => (
              <td
                key={year}
                style={{
                  ...cell,
                  background: idx === 0 ? "#f7f7f7" : undefined,
                }}
              >
                {idx === 0 ? (
                  fmt(ratios[idx].otherCurrentAssetsPct, locale)
                ) : (
                  <input
                    type="number"
                    style={inputPct}
                    value={ratios[idx].otherCurrentAssetsPct}
                    onChange={(e) =>
                      updateRatio(
                        year,
                        "otherCurrentAssetsPct",
                        Number(e.target.value)
                      )
                    }
                  />
                )}
              </td>
            ))}
          </tr>

          {/* OCL % */}
          <tr>
            <td style={left}>Other Current Liabilities (% revenue)</td>
            {years.map((year, idx) => (
              <td
                key={year}
                style={{
                  ...cell,
                  background: idx === 0 ? "#f7f7f7" : undefined,
                }}
              >
                {idx === 0 ? (
                  fmt(ratios[idx].otherCurrentLiabilitiesPct, locale)
                ) : (
                  <input
                    type="number"
                    style={inputPct}
                    value={ratios[idx].otherCurrentLiabilitiesPct}
                    onChange={(e) =>
                      updateRatio(
                        year,
                        "otherCurrentLiabilitiesPct",
                        Number(e.target.value)
                      )
                    }
                  />
                )}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
