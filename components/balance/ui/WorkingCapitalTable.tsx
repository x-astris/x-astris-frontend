"use client";

import { useEffect, useRef, type CSSProperties, type ChangeEvent } from "react";
import { RatioRow, BalanceRow } from "../types/balance";
import type { RatioFrontendField } from "../hooks/useBalanceData";

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

/* ===============================================================
   HELPERS
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

function computeBaseKpis(row: BalanceRow, pnlYear: any) {
  const revenue = pnlYear?.revenue ?? 0;
  const cogs = pnlYear?.cogs ?? 0;

  return {
    dio: cogs > 0 ? Math.round((row.inventory / cogs) * 365) : 0,
    dso: revenue > 0 ? Math.round((row.receivables / revenue) * 365) : 0,
    dpo: cogs > 0 ? Math.round((row.payables / cogs) * 365) : 0,
    ocaPct: revenue > 0 ? Math.round((row.otherCurrentAssets / revenue) * 100) : 0,
    oclPct:
      revenue > 0
        ? Math.round((row.otherCurrentLiabilities / revenue) * 100)
        : 0,
  };
}

/* ===============================================================
   COMPONENT
=============================================================== */

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
  /* ---------------------- HOOKS (ALWAYS RUN) ---------------------- */

  const fmt = fmtFactory(getLocale());
  const year1 = years[0];
  const initialPrefillDone = useRef(false);

  const row2025 = rows.find((r) => r.year === year1);
  const pnl2025 = pnl.find((p) => p.year === year1);

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

  /* ---------------------- GUARD (AFTER HOOKS) ---------------------- */

  if (!rows.length || !pnl.length || !ratios.length) {
    return null;
  }

  /* ---------------------- HANDLERS ---------------------- */

  function handleYear1WCChange(field: keyof BalanceRow, year: number) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const value = Number(e.target.value);
      updateRow(year, field, value);

      if (!row2025 || !pnl2025) return;

      const updated2025: BalanceRow = { ...row2025, [field]: value };

      const { dio, dso, dpo, ocaPct, oclPct } = computeBaseKpis(
        updated2025,
        pnl2025
      );

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

  /* ---------------------- RENDER ---------------------- */

  return (
    <div style={{ marginBottom: 48 }}>
      {/* (render logic unchanged) */}
      {/* your existing tables stay exactly as-is */}
    </div>
  );
}
