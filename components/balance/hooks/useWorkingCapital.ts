"use client";

import { useMemo } from "react";
import { PnlRow } from "../types/pnl";
import { RatioRow } from "../types/balance";

type WcInputRow = {
  year: number;
  inventory: number;
  receivables: number;
  otherCurrentAssets: number;
  payables: number;
  otherCurrentLiabilities: number;
};

type RatioInput = {
  year: number;
  dio: number;
  dso: number;
  dpo: number;
  otherCurrentAssetsPct: number;
  otherCurrentLiabilitiesPct: number;
};

export function useWorkingCapital(
  rows: WcInputRow[],
  pnl: PnlRow[],
  ratios: RatioInput[],
  years: number[]
) {
  return useMemo(() => {
    // 💥 FIX: if data not ready yet → don't compute anything
    if (
      !rows ||
      !pnl ||
      !ratios ||
      rows.length === 0 ||
      pnl.length === 0 ||
      ratios.length === 0
    ) {
      return [];
    }

    return years.map((year, idx) => {
      // If index missing → prevent crashes
      const row = rows[idx] ?? {
        inventory: 0,
        receivables: 0,
        otherCurrentAssets: 0,
        payables: 0,
        otherCurrentLiabilities: 0,
      };

      const r = ratios[idx] ?? {
        dio: 0,
        dso: 0,
        dpo: 0,
        otherCurrentAssetsPct: 0,
        otherCurrentLiabilitiesPct: 0,
      };

      const revenue = pnl[idx]?.revenue ?? 0;
      const costBase = (pnl[idx]?.cogs ?? 0) + (pnl[idx]?.opex ?? 0);

      const inventory =
        idx === 0 ? row.inventory : Math.round((r.dio / 365) * revenue);

      const receivables =
        idx === 0 ? row.receivables : Math.round((r.dso / 365) * revenue);

      const otherCurrentAssets =
        idx === 0
          ? row.otherCurrentAssets
          : Math.round((r.otherCurrentAssetsPct / 100) * revenue);

      const payables =
        idx === 0
          ? row.payables
          : Math.round((r.dpo / 365) * costBase);

      const otherCurrentLiabilities =
        idx === 0
          ? row.otherCurrentLiabilities
          : Math.round((r.otherCurrentLiabilitiesPct / 100) * revenue);

      return {
        year,
        inventory,
        receivables,
        otherCurrentAssets,
        payables,
        otherCurrentLiabilities,
        wc:
          inventory +
          receivables +
          otherCurrentAssets -
          payables -
          otherCurrentLiabilities,
      };
    });
  }, [rows, pnl, ratios, years]);
}
