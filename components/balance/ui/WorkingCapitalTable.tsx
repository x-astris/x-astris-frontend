"use client";

import {
  useEffect,
  useRef,
  type CSSProperties,
  type ChangeEvent,
} from "react";
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
      return Math.round(
        (ratios.otherCurrentLiabilitiesPct / 100) * revenue
      );
  }
}

function computeBaseKpis(row: BalanceRow, pnlYear: any) {
  const revenue = pnlYear?.revenue ?? 0;
  const cogs = pnlYear?.cogs ?? 0;

  return {
    dio: cogs > 0 ? Math.round((row.inventory / cogs) * 365) : 0,
    dso: revenue > 0 ? Math.round((row.receivables / revenue) * 365) : 0,
    dpo: cogs > 0 ? Math.round((row.payables / cogs) * 365) : 0,
    otherCurrentAssetsPct:
      revenue > 0
        ? Math.round((row.otherCurrentAssets / revenue) * 100)
        : 0,
    otherCurrentLiabilitiesPct:
      revenue > 0
        ? Math.round((row.otherCurrentLiabilities / revenue) * 100)
        : 0,
  };
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

  const year0 = years[0];
  const row0 = rows.find((r) => r.year === year0);
  const pnl0 = pnl.find((p) => p.year === year0);

  /* --------------------------------------------------------------
     BASE KPIs (YEAR 0 — DERIVED, NOT STORED)
  -------------------------------------------------------------- */

  const baseKpis =
    row0 && pnl0
      ? computeBaseKpis(row0, pnl0)
      : {
          dio: 0,
          dso: 0,
          dpo: 0,
          otherCurrentAssetsPct: 0,
          otherCurrentLiabilitiesPct: 0,
        };

  /* --------------------------------------------------------------
     PREFILL YEAR 1+ KPIs ONCE
  -------------------------------------------------------------- */

  const prefillDone = useRef(false);

  useEffect(() => {
    if (prefillDone.current) return;
    if (!row0 || !pnl0) return;

    const allZero = ratios.every(
      (r) =>
        r.dio === 0 &&
        r.dso === 0 &&
        r.dpo === 0 &&
        r.otherCurrentAssetsPct === 0 &&
        r.otherCurrentLiabilitiesPct === 0
    );

    if (!allZero) {
      prefillDone.current = true;
      return;
    }

    setRatios((prev) =>
      prev.map((r) =>
        r.year === year0
          ? r
          : {
              ...r,
              dio: baseKpis.dio,
              dso: baseKpis.dso,
              dpo: baseKpis.dpo,
              otherCurrentAssetsPct:
                baseKpis.otherCurrentAssetsPct,
              otherCurrentLiabilitiesPct:
                baseKpis.otherCurrentLiabilitiesPct,
            }
      )
    );

    prefillDone.current = true;
  }, [row0, pnl0, ratios, setRatios, year0]);

  /* --------------------------------------------------------------
     YEAR 0 WC CHANGE → RECOMPUTE KPIs → OVERWRITE YEAR 1+
  -------------------------------------------------------------- */

  function handleYear0WCChange(
    field: keyof BalanceRow,
    year: number
  ) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const value = Number(e.target.value);
      updateRow(year, field, value);

      if (!row0 || !pnl0) return;

      const updated = { ...row0, [field]: value };
      const nextBase = computeBaseKpis(updated, pnl0);

      setRatios((prev) =>
        prev.map((r) =>
          r.year === year0
            ? r
            : {
                ...r,
                dio: nextBase.dio,
                dso: nextBase.dso,
                dpo: nextBase.dpo,
                otherCurrentAssetsPct:
                  nextBase.otherCurrentAssetsPct,
                otherCurrentLiabilitiesPct:
                  nextBase.otherCurrentLiabilitiesPct,
              }
        )
      );
    };
  }

  /* ======================================================
     RENDER
  ====================================================== */

  const KPI_FIELDS: Array<{
    label: string;
    field: RatioFrontendField;
  }> = [
    { label: "DIO (days)", field: "dio" },
    { label: "DSO (days)", field: "dso" },
    { label: "DPO (days)", field: "dpo" },
    {
      label: "Other Current Assets (% revenue)",
      field: "otherCurrentAssetsPct",
    },
    {
      label: "Other Current Liabilities (% revenue)",
      field: "otherCurrentLiabilitiesPct",
    },
  ];

  return (
    <div style={{ marginBottom: 48 }}>
      <h3 style={{ fontSize: 18, fontWeight: "bold", marginBottom: 16 }}>
        Working Capital Inputs
      </h3>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: 32,
        }}
      >
        <thead>
          <tr>
            <th style={{ ...head, ...COL_FIRST }}>
              Working Capital Item
            </th>
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
          {[
            ["Inventory", "inventory"],
            ["Receivables", "receivables"],
            ["Other Assets", "otherCurrentAssets"],
            ["Payables", "payables"],
            ["Other Liabilities", "otherCurrentLiabilities"],
          ].map(([label, field]) => (
            <tr key={field}>
              <td style={left}>{label}</td>

              {years.map((year, idx) => {
                const row = rows.find((r) => r.year === year);
                const ratio = ratios.find((r) => r.year === year);
                const p = pnl.find((x) => x.year === year);

                const revenue = p?.revenue ?? 0;
                const cogs = p?.cogs ?? 0;

                const value =
                  idx === 0
                    ? (row?.[field as keyof BalanceRow] ?? 0)
                    : computeFromKpis(
                        field as any,
                        ratio!,
                        revenue,
                        cogs
                      );

                return (
                  <td key={year} style={cell}>
                    {idx === 0 ? (
                      <input
                        type="number"
                        style={inputMoney}
                        value={value}
                        onChange={handleYear0WCChange(
                          field as keyof BalanceRow,
                          year
                        )}
                        step={100}
                      />
                    ) : (
                      fmt(value, locale)
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

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
          {KPI_FIELDS.map(({ label, field }) => (
            <tr key={field}>
              <td style={left}>{label}</td>
              {years.map((year, idx) => {
                const ratio = ratios.find(
                  (r) => r.year === year
                );

                return (
                  <td
                    key={year}
                    style={{
                      ...cell,
                      background:
                        idx === 0 ? "#f7f7f7" : undefined,
                    }}
                  >
                    {idx === 0 ? (
                      fmt(baseKpis[field], locale)
                    ) : (
                      <input
                        type="number"
                        style={inputPct}
                        value={ratio?.[field] ?? 0}
                        onChange={(e) =>
                          updateRatio(
                            year,
                            field,
                            Number(e.target.value)
                          )
                        }
                      />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
