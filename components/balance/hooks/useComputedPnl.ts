"use client";

import { useMemo } from "react";
import { PnlRow } from "../types/pnl";

/* -------------------------------------------------------
   1) Define the type we export for computed P&L rows
------------------------------------------------------- */
export type PnlComputedRow = {
  year: number;
  revenue: number;
  cogs: number;
  opex: number;
  depreciation: number;
  interest: number;
  taxes: number;
  ebitda: number;
  ebit: number;
  ebt: number;
  netResult: number;
};

/* -------------------------------------------------------
   2) Main hook
------------------------------------------------------- */
export function useComputedPnl(pnl: PnlRow[], years: number[]) {
  return useMemo<PnlComputedRow[]>(() => {
    const result = years.map((year) => {
      const row = pnl.find((p) => p.year === year);

      const base = row ?? {
        year,
        revenue: 0,
        cogs: 0,
        opex: 0,
        depreciation: 0,
        interest: 0,
        taxes: 0,
      };

      const revenue = base.revenue ?? 0;
      const cogs = base.cogs ?? 0;
      const opex = base.opex ?? 0;
      const depreciation = base.depreciation ?? 0;
      const interest = base.interest ?? 0;
      const taxes = base.taxes ?? 0;
      const ebitda = revenue - cogs - opex;
      const ebit = revenue - cogs - opex - depreciation;
      const ebt = ebit - interest;
      const netResult = ebt - taxes;

      return {
        year,
        revenue,
        cogs,
        opex,
        depreciation,
        interest,
        taxes,
        ebitda,
        ebit,
        ebt,
        netResult,
      };
    });

    console.log("🔥 useComputedPnl → result:", result);
    return result;
  }, [pnl, years]);
}
