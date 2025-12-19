//dashboard/hooks/useDashboardData.ts

"use client";

import { useMemo } from "react";
import { useBalanceData } from "@/components/balance/hooks/useBalanceData";
import { usePnlModel } from "@/components/pnl/hooks/usePnlModel";
import { useComputedBalance } from "@/components/balance/hooks/useComputedBalance";

export type DashboardSeries = {
  years: number[];
  revenue: number[];
  ebitda: number[];
  investments: number[];
  cash: number[];
  icr: number[];              // EBIT / Interest
  debtToEbitda: number[];     
  netDebtToEbitda: number[];  // (Debt - Cash) / EBITDA
  solvencyRatio: number[]; // equity / total assets
  debtToEquity: number[];     // TotalDebt / Equity
  netResult: number[];
  netWorkingCapital: number[];
  netDebt: number[];
};

export function useDashboardData(
  projectId: string,
  startYear: number,
  forecastYears: number
) {
  /* -----------------------------------------------------
     YEARS ARRAY — now dynamic based on forecastYears
  ----------------------------------------------------- */
  const years = useMemo(
    () => Array.from({ length: forecastYears }, (_, i) => startYear + i),
    [startYear, forecastYears]
  );

  /* -----------------------------------------------------
     LOAD RAW BALANCE + PNL + RATIOS
  ----------------------------------------------------- */
  const { rows, pnl, ratios, loading, error } = useBalanceData(projectId, years);

  /* -----------------------------------------------------
     COMPUTED P&L + BALANCE
  ----------------------------------------------------- */
  const pnlComputed = usePnlModel(pnl, years);
  const balanceComputed = useComputedBalance(rows, pnlComputed, years, ratios);

  /* -----------------------------------------------------
     FINAL DASHBOARD SERIES
  ----------------------------------------------------- */
const data: DashboardSeries = useMemo(() => {
  if (!pnlComputed.length || !balanceComputed.length) {
    return {
      years,
      revenue: years.map(() => 0),
      ebitda: years.map(() => 0),
      investments: years.map(() => 0),
      cash: years.map(() => 0),

      // Financing KPIs
      icr: years.map(() => 0),
      debtToEbitda: years.map(() => 0),
      netDebtToEbitda: years.map(() => 0),
      debtToEquity: years.map(() => 0),
      solvencyRatio: years.map(() => 0),

      // Other 
      netResult: years.map(() => 0),
      netWorkingCapital: years.map(() => 0),
      netDebt:years.map(() => 0),

    };
  }

  return {
    years,

    // Revenue
    revenue: years.map((year) => {
      const row = pnlComputed.find((p) => p.year === year);
      return row?.revenue ?? 0;
    }),

    // EBITDA = revenue - cogs - opex
    ebitda: years.map((year) => {
      const row = pnlComputed.find((p) => p.year === year);
      if (!row) return 0;
      return row.revenue - row.cogs - row.opex;
    }),

    // Investments (Capex)
    investments: years.map((year) => {
      const row = balanceComputed.find((b) => b.year === year);
      return row?.investments ?? 0;
    }),

    // Cash
    cash: years.map((year) => {
      const row = balanceComputed.find((b) => b.year === year);
      return row?.cash ?? 0;
    }),

    // ---------------------------
    // Financing KPIs
    // ---------------------------

    // ICR = EBIT / Interest
    icr: years.map((year) => {
      const p = pnlComputed.find((x) => x.year === year);
      if (!p) return 0;
      const interest = p.int ?? 0;
      if (interest === 0) return 0;
      return p.EBIT/ interest;
    }),

    // Debt / EBITDA
    debtToEbitda: years.map((year) => {
      const p = pnlComputed.find((x) => x.year === year);
      const b = balanceComputed.find((x) => x.year === year);
      if (!p || !b || !p.EBITDA) return 0;

      const totalDebt = (b.longDebt ?? 0) + (b.shortDebt ?? 0);

      return totalDebt / p.EBITDA;
    }),

    // Net Debt / EBITDA
    netDebtToEbitda: years.map((year) => {
      const p = pnlComputed.find((x) => x.year === year);
      const b = balanceComputed.find((x) => x.year === year);

      if (!p || !b || !p.EBITDA) return 0;

      const totalDebt = (b.longDebt ?? 0) + (b.shortDebt ?? 0);
      const netDebt = totalDebt - (b.cash ?? 0);

      return netDebt / p.EBITDA;
    }),

    // Solvency Ratio = Equity / Total Assets
      solvencyRatio: years.map((year) => {
        const b = balanceComputed.find((x) => x.year === year);
        if (!b || !b.totalAssets) return 0;

        return b.equity / b.totalAssets;
      }),

    // Debt / Equity
    debtToEquity: years.map((year) => {
      const b = balanceComputed.find((x) => x.year === year);
      if (!b) return 0;

      const totalDebt = (b.longDebt ?? 0) + (b.shortDebt ?? 0);
      const equity = b.equity ?? 0;

      if (equity === 0) return 0;

      return totalDebt / equity;
    }),

    // Other charts

    // Net Result
    netResult: years.map((year) => {
      const p = pnlComputed.find((x) => x.year === year);
      return p?.netResult ?? 0;
    }),

    // Net Working Capital
    netWorkingCapital: years.map((year) => {
      const b = balanceComputed.find((x) => x.year === year);
      return b?.workingCapital ?? 0;
    }),

    // Net Debt = Debt - Cash
    netDebt: years.map((year) => {
      const b = balanceComputed.find((x) => x.year === year);
      if (!b) return 0;

      const totalDebt =
        (b.longDebt ?? 0) + (b.shortDebt ?? 0);

      return totalDebt - (b.cash ?? 0);
    }),


  };
}, [years, pnlComputed, balanceComputed]);

  return {
    loading,
    error,
    data,
  };
}
