"use client";

import { useMemo } from "react";
import { BalanceRow, ComputedRow, RatioRow } from "../types/balance";
import type { PnlModelRow } from "@/components/pnl/hooks/usePnlModel";

export function useComputedBalance(
  rows: BalanceRow[],
  pnlComputed: PnlModelRow[],
  years: number[],
  ratios: RatioRow[]
) {
  return useMemo(() => {
    if (!rows || rows.length === 0) return [];

    const result: ComputedRow[] = [];

    let prevFA = rows[0].fixedAssetsInput;
    let prevEquity = rows[0].equityInput ?? 0;

    years.forEach((year, idx) => {
      const row = rows.find((r) => r.year === year)!;
      const pnlYear = pnlComputed.find((p) => p.year === year);
      const ratio = ratios.find((r) => r.year === year);

      const revenue = pnlYear?.revenue ?? 0;
      const cogs = pnlYear?.cogs ?? 0;

      /* ---------------- FIXED ASSETS ---------------- */

      const depPct = (row.depreciationPct ?? 0) / 100;

      const depreciation =
        idx === 0
          ? pnlYear?.dep ?? 0
          : prevFA * depPct;

      const fixedAssets =
        idx === 0
          ? prevFA
          : prevFA + row.investments - depreciation;

      /* ---------------- NET RESULT ---------------- */

      const netResult = pnlYear?.netResult ?? 0;

      /* ---------------- EQUITY ROLL ---------------- */

      const contribution = row.equityContribution ?? 0;
      const dividend = row.dividend ?? 0;

      const equity =
        idx === 0
          ? (row.equityInput ?? 0)   // year 0: opening equity only
          : prevEquity + netResult + contribution - dividend;

      prevEquity = equity;

      /* ---------------- WORKING CAPITAL ---------------- */

      let wcInventory: number;
      let wcReceivables: number;
      let wcOtherCurrentAssets: number;
      let wcPayables: number;
      let wcOtherCurrentLiabilities: number;

      if (idx === 0) {
        wcInventory = row.inventory ?? 0;
        wcReceivables = row.receivables ?? 0;
        wcOtherCurrentAssets = row.otherCurrentAssets ?? 0;
        wcPayables = row.payables ?? 0;
        wcOtherCurrentLiabilities = row.otherCurrentLiabilities ?? 0;
      } else {
        const dio = ratio?.dio ?? 0;
        const dso = ratio?.dso ?? 0;
        const dpo = ratio?.dpo ?? 0;

        wcInventory = Math.round((dio / 365) * cogs);
        wcReceivables = Math.round((dso / 365) * revenue);
        wcPayables = Math.round((dpo / 365) * cogs);

        wcOtherCurrentAssets = Math.round(
          ((ratio?.otherCurrentAssetsPct ?? 0) / 100) * revenue
        );

        wcOtherCurrentLiabilities = Math.round(
          ((ratio?.otherCurrentLiabilitiesPct ?? 0) / 100) * revenue
        );
      }

      const workingCapital =
        wcInventory +
        wcReceivables +
        wcOtherCurrentAssets -
        wcPayables -
        wcOtherCurrentLiabilities;

      /* ---------------- CASH ---------------- */

      const totalDebt =
        (row.longDebt ?? 0) + (row.shortDebt ?? 0);

      const cash =
        equity + totalDebt - (fixedAssets + workingCapital);

      /* ---------------- INTEREST ---------------- */

      let interest: number;

      if (idx === 0) {
        interest = pnlYear?.int ?? 0;
      } else {
        const prevRow = rows[idx - 1];
        const prevDebt =
          (prevRow.longDebt ?? 0) + (prevRow.shortDebt ?? 0);

        const currDebt = totalDebt;
        const avgDebt = (prevDebt + currDebt) / 2;

        const rate = row.interestRatePct ?? 0;
        interest = Math.round(avgDebt * (rate / 100));
      }

      /* ---------------- KPI RATIOS ---------------- */

      const otherCurrentAssetsPct =
        revenue > 0
          ? (wcOtherCurrentAssets / revenue) * 100
          : 0;

      const otherCurrentLiabilitiesPct =
        revenue > 0
          ? (wcOtherCurrentLiabilities / revenue) * 100
          : 0;

      let dio, dso, dpo;

      if (idx === 0) {
        dio = cogs > 0 ? (wcInventory / cogs) * 365 : 0;
        dso = revenue > 0 ? (wcReceivables / revenue) * 365 : 0;
        dpo = cogs > 0 ? (wcPayables / cogs) * 365 : 0;
      } else {
        dio = ratio?.dio ?? 0;
        dso = ratio?.dso ?? 0;
        dpo = ratio?.dpo ?? 0;
      }

      /* ---------------- PUSH RESULT ---------------- */

      result.push({
        ...row,
        fixedAssets,
        depreciation,
        netResult,
        equity,
        cash,
        interest,

        wcInventory,
        wcReceivables,
        wcOtherCurrentAssets,
        wcPayables,
        wcOtherCurrentLiabilities,
        workingCapital,

        capitalEmployed: fixedAssets + workingCapital,
        equityDebt: equity + totalDebt,

        dio,
        dso,
        dpo,
        otherCurrentAssetsPct,
        otherCurrentLiabilitiesPct,
      });

      prevFA = fixedAssets;
    });

    return result;
  }, [rows, pnlComputed, years, ratios]);
}
