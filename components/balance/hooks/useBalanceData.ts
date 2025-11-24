"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api/client";
import { BalanceRow, RatioRow } from "../types/balance";
import { PnlRow } from "../types/pnl";

export const ratioFieldMap = {
  dio: "ratioDio",
  dso: "ratioDso",
  dpo: "ratioDpo",
  otherCurrentAssetsPct: "ratioOcaPct",
  otherCurrentLiabilitiesPct: "ratioOclPct",
} as const;

export type RatioFrontendField = keyof typeof ratioFieldMap;

export function useBalanceData(projectId: string, years: number[]) {
  const [rows, setRows] = useState<BalanceRow[]>([]);
  const [pnl, setPnl] = useState<PnlRow[]>([]);
  const [ratios, setRatios] = useState<RatioRow[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  

  /* -----------------------------------------------------
      LOAD BALANCE + PNL + RATIO FIELDS
  ----------------------------------------------------- */
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const [balRes, pnlRes] = await Promise.all([
          api.get(`/balance?projectId=${projectId}`),
          api.get(`/pnl?projectId=${projectId}`),
        ]);

        const balanceData = balRes.data ?? [];
        const pnlData = pnlRes.data ?? [];

        setPnl(pnlData);

        /* ------------------------------
           BALANCE INPUT ROWS
        ------------------------------ */
        const initialRows: BalanceRow[] = years.map((year) => {
          const b = balanceData.find((x: any) => x.year === year);
          const p = pnlData.find((x: any) => x.year === year);

          return {
            year,

            fixedAssetsInput: b?.fixedAssets ?? 0,
            investments: b?.investments ?? 0,

            depreciationPct: b?.depreciationPct ?? 10,
            interestRatePct: b?.interestRatePct ?? 5,

            inventory: b?.inventory ?? 0,
            receivables: b?.receivables ?? 0,
            otherCurrentAssets: b?.otherShortTermAssets ?? 0,

            payables: b?.payables ?? 0,
            otherCurrentLiabilities: b?.otherShortTermLiabilities ?? 0,

            equityInput: b?.equity ?? 0,
            longDebt: b?.longDebt ?? 0,
            shortDebt: b?.shortDebt ?? 0,

            depreciationFromPnl: p?.depreciation ?? 0,
            interestFromPnl: p?.interest ?? 0,
            revenueFromPnl: p?.revenue ?? 0,
          };
        });

        setRows(initialRows);

        /* ------------------------------
           WORKING CAPITAL RATIOS (LOAD FROM BACKEND)
        ------------------------------ */
        const initialRatios: RatioRow[] = years.map((year) => {
          const b = balanceData.find((x: any) => x.year === year);

          return {
            year,

            dio: b?.ratioDio ?? 0,
            dso: b?.ratioDso ?? 0,
            dpo: b?.ratioDpo ?? 0,
            otherCurrentAssetsPct: b?.ratioOcaPct ?? 0,
            otherCurrentLiabilitiesPct: b?.ratioOclPct ?? 0,

            _userEdited: false,
          };
        });

        setRatios(initialRatios);
      } catch (e) {
        console.error(e);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [projectId, years]);

  /* -----------------------------------------------------
      UPDATE BALANCE FIELDS
  ----------------------------------------------------- */
  const updateRow = async (
    year: number,
    field: keyof BalanceRow,
    value: number
  ) => {
    setRows((prev) =>
      prev.map((r) => (r.year === year ? { ...r, [field]: value } : r))
    );

    try {
      await api.patch("/balance/update", {
        projectId,
        year,
        field,
        value,
      });
    } catch (err) {
      console.error("Error updating balance:", err);
    }
  };

  /* -----------------------------------------------------
      UPDATE RATIO FIELDS
  ----------------------------------------------------- */
  const updateRatio = async (
    year: number,
    field: RatioFrontendField,
    value: number
  ) => {
    setRatios((prev) =>
      prev.map((r) =>
        r.year === year ? { ...r, [field]: value, _userEdited: true } : r
      )
    );

    try {
      await api.patch("/balance/update-ratio", {
        projectId,
        year,
        field: ratioFieldMap[field], // backend field name
        value,
      });
    } catch (err) {
      console.error("Error updating ratio:", err);
    }
  };

  /* -----------------------------------------------------
      SAVE (Create all balance rows fresh)
  ----------------------------------------------------- */
async function save(computedRows: any[]) {
  try {
    setSaving(true);
    setSaved(false);
    setError("");

    /* ----------------------------------------------
       STEP 0 — Compute Year-1 KPIs if they are 0
       (Year-1 WC inputs → ratios[0])
    ---------------------------------------------- */
    const y0 = years[0];
    const row0 = rows.find(r => r.year === y0);
    const pnl0 = pnl.find(p => p.year === y0);

    if (row0 && pnl0) {
      const revenue = pnl0.revenue ?? 0;
      const cogs = pnl0.cogs ?? 0;

      const dio = cogs > 0 ? Math.round((row0.inventory / cogs) * 365) : 0;
      const dso = revenue > 0 ? Math.round((row0.receivables / revenue) * 365) : 0;
      const dpo = cogs > 0 ? Math.round((row0.payables / cogs) * 365) : 0;
      const ocaPct = revenue > 0 ? Math.round((row0.otherCurrentAssets / revenue) * 100) : 0;
      const oclPct = revenue > 0 ? Math.round((row0.otherCurrentLiabilities / revenue) * 100) : 0;

      // Update ratios[0] in memory
      setRatios(prev =>
        prev.map(r =>
          r.year === y0
            ? {
                ...r,
                dio,
                dso,
                dpo,
                otherCurrentAssetsPct: ocaPct,
                otherCurrentLiabilitiesPct: oclPct,
              }
            : r
        )
      );
    }

    /* ----------------------------------------------
       STEP 1 — delete existing backend rows
    ---------------------------------------------- */
    await api.delete(`/balance?projectId=${projectId}`);

    /* ----------------------------------------------
       STEP 2 — recreate all years fully
    ---------------------------------------------- */
    for (const r of rows) {
      const comp = computedRows.find(x => x.year === r.year) ?? {};
      const ratio: RatioRow =
  ratios.find(x => x.year === r.year) ?? {
    year: r.year,
    dio: 0,
    dso: 0,
    dpo: 0,
    otherCurrentAssetsPct: 0,
    otherCurrentLiabilitiesPct: 0,
  };

      await api.post(`/balance/create`, {
        projectId,
        year: r.year,

        // Fixed assets
        fixedAssets: comp.fixedAssets ?? r.fixedAssetsInput,
        investments: r.investments,
        depreciationPct: r.depreciationPct,
        interestRatePct: r.interestRatePct,

        // Working Capital (computed)
        inventory: comp.wcInventory,
        receivables: comp.wcReceivables,
        otherShortTermAssets: comp.wcOtherCurrentAssets,
        payables: comp.wcPayables,
        otherShortTermLiabilities: comp.wcOtherCurrentLiabilities,

        // Equity & Debt
        equity: comp.equity ?? r.equityInput,
        longDebt: r.longDebt,
        shortDebt: r.shortDebt,

        cash: comp.cash ?? 0,

        // KPIs saved to backend
        ratioDio: ratio.dio ?? 0,
        ratioDso: ratio.dso ?? 0,
        ratioDpo: ratio.dpo ?? 0,
        ratioOcaPct: ratio.otherCurrentAssetsPct ?? 0,
        ratioOclPct: ratio.otherCurrentLiabilitiesPct ?? 0,
      });
    }

    /* ----------------------------------------------
       STEP 3 — Update PNL (only depreciation + interest)
    ---------------------------------------------- */
    for (const c of computedRows) {
      await api.patch(`/pnl/update`, {
        projectId,
        year: c.year,
        depreciation: c.depreciation,
        interest: c.interest,
      });
    }

    /* ----------------------------------------------
       STEP 4 — Reload fresh data
    ---------------------------------------------- */
    const refreshed = await api.get(`/balance?projectId=${projectId}`);
    const refreshedPnl = await api.get(`/pnl?projectId=${projectId}`);

const data: any[] = refreshed.data ?? [];
const pnlData: any[] = refreshedPnl.data ?? [];

    const updatedRows: BalanceRow[] = years.map(year => {
      const b = data.find(x => x.year === year);
      const p = pnlData.find(x => x.year === year);

      return {
        year,
        fixedAssetsInput: b?.fixedAssets ?? 0,
        investments: b?.investments ?? 0,
        depreciationPct: b?.depreciationPct ?? 10,
        interestRatePct: b?.interestRatePct ?? 5,

        inventory: b?.inventory ?? 0,
        receivables: b?.receivables ?? 0,
        otherCurrentAssets: b?.otherShortTermAssets ?? 0,
        payables: b?.payables ?? 0,
        otherCurrentLiabilities: b?.otherShortTermLiabilities ?? 0,

        equityInput: b?.equity ?? 0,
        longDebt: b?.longDebt ?? 0,
        shortDebt: b?.shortDebt ?? 0,

        depreciationFromPnl: p?.depreciation ?? 0,
        interestFromPnl: p?.interest ?? 0,
        revenueFromPnl: p?.revenue ?? 0,
      };
    });

    setRows(updatedRows);
    setSaved(true);

  } catch (err) {
    console.error("SAVE ERROR", err);
    setError("Failed to save balance sheet");
  } finally {
    setSaving(false);
  }
}
  return {
    rows,
    pnl,
    ratios,
    loading,
    saving,
    saved,
    error,
    updateRow,
    updateRatio,
    save,
    setRatios,
  };
}
