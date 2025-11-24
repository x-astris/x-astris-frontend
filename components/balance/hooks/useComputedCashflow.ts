"use client";

import { useMemo } from "react";
import type { PnlComputedRow } from "./useComputedPnl";
import type { ComputedRow, BalanceRow, RatioRow } from "../../balance/types/balance";

export function useComputedCashflow(
  pnl: PnlComputedRow[],
  balanceComputed: ComputedRow[],
  balanceRaw: BalanceRow[],
  years: number[]
) {
  return useMemo(() => {
    if (!pnl || !balanceComputed || !balanceRaw) return [];

    return years.map((year, idx) => {
      if (idx === 0) {
        return {
          year,
          EBIT: 0,
          tax: 0,
          NOPLAT: 0,
          depreciation: 0,
          changeWC: 0,
          operatingCF: 0,
          investmentsCF: 0,
          interest: 0,
          changeDebt: 0,
          financingCF: 0,
          totalChangeCash: 0,
          bsCashChangeCheck: 0,
        };
      }

      const prev = balanceComputed[idx - 1];
      const curr = balanceComputed[idx];

      const pnlRow = pnl[idx];

      // Operating
        const EBIT = pnlRow?.ebit ?? 0;
        const tax = pnlRow?.taxes ?? 0;
        const depreciation = pnlRow?.depreciation ?? 0;
        const NOPLAT = EBIT - tax;

      // Working capital changes
      const wcPrev =
        (prev.inventory ?? 0) +
        (prev.receivables ?? 0) +
        (prev.otherCurrentAssets ?? 0) -
        (prev.payables ?? 0) -
        (prev.otherCurrentLiabilities ?? 0);

      const wcCurr =
        (curr.inventory ?? 0) +
        (curr.receivables ?? 0) +
        (curr.otherCurrentAssets ?? 0) -
        (curr.payables ?? 0) -
        (curr.otherCurrentLiabilities ?? 0);

      const changeWC = wcCurr - wcPrev;

      const operatingCF = NOPLAT + depreciation - changeWC;

      // Investing
      const fixedPrev = prev.fixedAssets ?? 0;
      const fixedCurr = curr.fixedAssets ?? 0;
      const investmentsCF = fixedCurr - fixedPrev; // positive = investment

      // Financing
      const debtPrev = (prev.longDebt ?? 0) + (prev.shortDebt ?? 0);
      const debtCurr = (curr.longDebt ?? 0) + (curr.shortDebt ?? 0);

      const changeDebt = debtCurr - debtPrev;
      const interest = pnlRow?.interest ?? 0;
      
      const financingCF = -interest + changeDebt;

      // Total Cash Flow
      const totalChangeCash = operatingCF - investmentsCF + financingCF;

      // Check against balance sheet cash evolution
      const cashPrev =
        prev.equity +
        ((prev.longDebt ?? 0) + (prev.shortDebt ?? 0)) -
        (prev.fixedAssets + wcPrev);

      const cashCurr =
        curr.equity +
        ((curr.longDebt ?? 0) + (curr.shortDebt ?? 0)) -
        (curr.fixedAssets + wcCurr);

      const bsCashChangeCheck = cashCurr - cashPrev;

      return {
        year,
        EBIT,
        tax,
        NOPLAT,
        depreciation,
        changeWC,
        operatingCF,
        investmentsCF,
        interest,
        changeDebt,
        financingCF,
        totalChangeCash,
        bsCashChangeCheck,
      };
    });
  }, [pnl, balanceComputed, balanceRaw, years]);
}
