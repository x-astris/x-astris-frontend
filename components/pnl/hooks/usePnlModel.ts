"use client";

import { useMemo } from "react";
import { PnlRow } from "../types/pnl";

export type PnlModelRow = {
  year: number;

  revenue: number;
  cogs: number;
  opex: number;
  dep: number;
  int: number;
  tax: number;

  grossMargin: number;
  EBITDA: number;
  EBIT: number;
  EBT: number;
  netResult: number;

  cogsPctEff: number;
  opexPctEff: number;
};

const round1 = (v: number) => Math.round(v * 10) / 10;

export function usePnlModel(
  rows: PnlRow[],
  years: number[]
): PnlModelRow[] {
  return useMemo(() => {
    if (!rows.length || !years.length) return [];

    const baseYear = years[0];
    const base = rows.find((r) => r.year === baseYear);
    if (!base) return [];

    /* ================= BASE VALUES ================= */

    let prevRevenue = base.revenue ?? 0;

    const baseRevenueSafe = Math.max(base.revenue ?? 0, 1);

    const baseCogsPct =
      base.cogsPct ??
      round1((base.cogs / baseRevenueSafe) * 100);

    const baseOpexPct =
      base.opexPct ??
      round1((base.opex / baseRevenueSafe) * 100);

    let prevCogsPct = baseCogsPct;
    let prevOpexPct = baseOpexPct;

    /* ================= BUILD MODEL ================= */

    return years.map((year, idx) => {
      const r = rows.find((x) => x.year === year);
      if (!r) {
        throw new Error(`Missing P&L row for year ${year}`);
      }

      /* ---------------- REVENUE ---------------- */
      const revenue =
        idx === 0
          ? r.revenue
          : Math.round(
              prevRevenue *
                (1 + (r.revenueGrowthPct ?? 0) / 100)
            );

      prevRevenue = revenue;

      /* ---------------- COGS ---------------- */
      const cogsPct =
        idx === 0
          ? baseCogsPct
          : r.cogsPct ?? prevCogsPct;

      const cogs =
        idx === 0
          ? r.cogs // base year absolute input
          : Math.round((cogsPct / 100) * revenue);

      const cogsPctEff = round1(
        (cogs / Math.max(revenue, 1)) * 100
      );

      prevCogsPct = cogsPctEff;

      /* ---------------- OPEX ---------------- */
      const opexPct =
        idx === 0
          ? baseOpexPct
          : r.opexPct ?? prevOpexPct;

      const opex =
        idx === 0
          ? r.opex // base year absolute input
          : Math.round((opexPct / 100) * revenue);

      const opexPctEff = round1(
        (opex / Math.max(revenue, 1)) * 100
      );

      prevOpexPct = opexPctEff;

      /* ---------------- RESULTS ---------------- */
      const grossMargin = revenue - cogs;
      const EBITDA = grossMargin - opex;
      const EBIT = EBITDA - r.depreciation;
      const EBT = EBIT - r.interest;

      /* ---------------- TAX ---------------- */
      const tax =
        idx === 0
          ? r.taxes
          : r.taxRatePct !== null &&
            r.taxRatePct !== undefined
          ? EBT > 0
            ? Math.round(
                EBT * ((r.taxRatePct ?? 25) / 100)
              )
            : 0
          : r.taxes;

      return {
        year,
        revenue,
        cogs,
        opex,
        dep: r.depreciation,
        int: r.interest,
        tax,

        grossMargin,
        EBITDA,
        EBIT,
        EBT,
        netResult: EBT - tax,

        cogsPctEff,
        opexPctEff,
      };
    });
  }, [rows, years]);
}
