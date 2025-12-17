"use client";

import { useMemo } from "react";
import type { PnlModelRow } from "@/components/pnl/hooks/usePnlModel";

/* ---------------------- TYPES ---------------------- */

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

/* ---------------------- HOOK ---------------------- */

export function useWorkingCapital(
  rows: WcInputRow[],
  pnl: PnlModelRow[],
  ratios: RatioInput[],
  years: number[]
) {
  return useMemo(() => {
    return years.map((year, idx) => {
      /* ---------------- SAFE INPUT ROW ---------------- */

      const row =
        rows.find((r) => r.year === year) ?? {
          inventory: 0,
          receivables: 0,
          otherCurrentAssets: 0,
          payables: 0,
          otherCurrentLiabilities: 0,
        };

      /* ---------------- SAFE RATIO ---------------- */

      const ratio =
        ratios.find((r) => r.year === year) ?? {
          dio: 0,
          dso: 0,
          dpo: 0,
          otherCurrentAssetsPct: 0,
          otherCurrentLiabilitiesPct: 0,
        };

      /* ---------------- SAFE PNL ---------------- */

      const pnlYear = pnl.find((p) => p.year === year);
      const revenue = pnlYear?.revenue ?? 0;
      const cogs = pnlYear?.cogs ?? 0;

      /* ---------------- WC COMPONENTS ---------------- */

      const inventory =
        idx === 0
          ? row.inventory
          : Math.round((ratio.dio / 365) * cogs);

      const receivables =
        idx === 0
          ? row.receivables
          : Math.round((ratio.dso / 365) * revenue);

      const otherCurrentAssets =
        idx === 0
          ? row.otherCurrentAssets
          : Math.round((ratio.otherCurrentAssetsPct / 100) * revenue);

      const payables =
        idx === 0
          ? row.payables
          : Math.round((ratio.dpo / 365) * cogs);

      const otherCurrentLiabilities =
        idx === 0
          ? row.otherCurrentLiabilities
          : Math.round(
              (ratio.otherCurrentLiabilitiesPct / 100) * revenue
            );

      const workingCapital =
        inventory +
        receivables +
        otherCurrentAssets -
        payables -
        otherCurrentLiabilities;

      return {
        year,
        inventory,
        receivables,
        otherCurrentAssets,
        payables,
        otherCurrentLiabilities,
        wc: workingCapital,
      };
    });
  }, [rows, pnl, ratios, years]);
}
