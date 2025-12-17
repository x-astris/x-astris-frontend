"use client";

import { useMemo } from "react";
import type { PnlModelRow } from "@/components/pnl/hooks/usePnlModel";
import type { CashflowRow } from "@/components/cashflow/CashflowOutput";

/* ---------------- TYPES ---------------- */

type BalanceModelRow = {
  year: number;
  inventory?: number;
  receivables?: number;
  otherShortTermAssets?: number;
  payables?: number;
  otherShortTermLiabilities?: number;
  investments?: number;
  longDebt?: number;
  shortDebt?: number;
  cash?: number;
};

/* ---------------- HOOK ---------------- */

export function useComputedCashflow(
  pnl: PnlModelRow[],
  balance: BalanceModelRow[],
  years: number[]
) {
  return useMemo<CashflowRow[]>(() => {
    if (!pnl.length || !balance.length || !years.length) return [];

    return years.map((year, idx) => {
      const pnlRow = pnl.find((p) => p.year === year);
      const bNow = balance.find((b) => b.year === year);
      const bPrev =
        idx > 0
          ? balance.find((b) => b.year === years[idx - 1])
          : undefined;

      /* ---------- SAFE DEFAULTS ---------- */

      const invNow = bNow?.inventory ?? 0;
      const invPrev = bPrev?.inventory ?? 0;

      const recNow = bNow?.receivables ?? 0;
      const recPrev = bPrev?.receivables ?? 0;

      const ocaNow = bNow?.otherShortTermAssets ?? 0;
      const ocaPrev = bPrev?.otherShortTermAssets ?? 0;

      const payNow = bNow?.payables ?? 0;
      const payPrev = bPrev?.payables ?? 0;

      const oclNow = bNow?.otherShortTermLiabilities ?? 0;
      const oclPrev = bPrev?.otherShortTermLiabilities ?? 0;

      /* ---------- WC CHANGES ---------- */

      const invChange = invNow - invPrev;
      const recChange = recNow - recPrev;
      const ocaChange = ocaNow - ocaPrev;
      const payChange = payNow - payPrev;
      const oclChange = oclNow - oclPrev;

      const wcChange =
        invChange +
        recChange +
        ocaChange -
        payChange -
        oclChange;

      /* ---------- OPERATING ---------- */

      const ebit = pnlRow?.EBIT ?? 0;
      const tax = pnlRow?.tax ?? 0;
      const dep = pnlRow?.dep ?? 0;
      const interest = pnlRow?.int ?? 0;

      const noplat = ebit - tax;
      const ocf = noplat + dep - wcChange;

      /* ---------- FINANCING ---------- */

      const dLong =
        (bNow?.longDebt ?? 0) - (bPrev?.longDebt ?? 0);

      const dShort =
        (bNow?.shortDebt ?? 0) - (bPrev?.shortDebt ?? 0);

      /* ---------- NET CASH ---------- */

      const investments = bNow?.investments ?? 0;

      const netChange =
        ocf -
        investments -
        interest +
        dLong +
        dShort;

      const cashCheck =
        (bNow?.cash ?? 0) - (bPrev?.cash ?? 0);

      /* ---------- RETURN ROW ---------- */

      return {
        year,

        operating: {
          ebit,
          tax,
          noplat,
          depreciation: dep,
          wcChange,
          ocf,
        },

        wcDetails: {
          invChange,
          recChange,
          ocaChange,
          payChange,
          oclChange,
        },

        investing: {
          investments,
        },

        financing: {
          interest,
          dLong,
          dShort,
        },

        netChange,
        cashCheck,
      };
    });
  }, [pnl, balance, years]);
}
