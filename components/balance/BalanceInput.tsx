"use client";

import { useMemo, useEffect, useState } from "react";
import { useBalanceData } from "./hooks/useBalanceData";
import { useComputedBalance } from "./hooks/useComputedBalance";
import { usePnlModel } from "../pnl/hooks/usePnlModel";

import InvestmentsTable from "./ui/InvestmentsTable";
import WorkingCapitalTable from "./ui/WorkingCapitalTable";
import BalanceSheetTable from "./ui/BalanceSheetTable";
import FinancingTable from "./ui/FinancingTable";
import SaveButton from "../layout/SaveButton";
import TopTabs from "../layout/TopTabs";
import { useWorkingCapital } from "./hooks/useWorkingCapital";

export default function BalanceInput({
  projectId,
  startYear,
  forecastYears,
}: {
  projectId: string;
  startYear: number;
  forecastYears: number;
}) {

   /* -----------------------------------------------------
      WARNING MESSAGE
  ----------------------------------------------------- */ 
  

 const [showWarning, setShowWarning] = useState(true);

  /* -----------------------------------------------------
      YEARS ARRAY
  ----------------------------------------------------- */
  const years = useMemo(
    () => Array.from({ length: forecastYears }, (_, i) => startYear + i),
    [startYear, forecastYears]
  );

  /* -----------------------------------------------------
      LOAD DATA
  ----------------------------------------------------- */
  const {
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
  } = useBalanceData(projectId, years);

  /* -----------------------------------------------------
      COMPUTED DATA
  ----------------------------------------------------- */
  const pnlComputed = usePnlModel(pnl, years);
  const computedRows = useComputedBalance(rows, pnlComputed, years, ratios);

  /* -----------------------------------------------------
      WORKING CAPITAL (clean input types)
  ----------------------------------------------------- */

  /** WC row type for TS */
  type WcRow = {
    year: number;
    inventory: number;
    receivables: number;
    otherCurrentAssets: number;
    payables: number;
    otherCurrentLiabilities: number;
  };

  const rowsForWC: WcRow[] = rows.map((r) => ({
    year: r.year,
    inventory: r.inventory,
    receivables: r.receivables,
    otherCurrentAssets: r.otherCurrentAssets,
    payables: r.payables,
    otherCurrentLiabilities: r.otherCurrentLiabilities,
  }));

const ratiosForWC = ratios.map((ra) => ({
  year: ra.year,
  dio: ra.dio,
  dso: ra.dso,
  dpo: ra.dpo,
  otherCurrentAssetsPct: ra.otherCurrentAssetsPct,
  otherCurrentLiabilitiesPct: ra.otherCurrentLiabilitiesPct,
}));

  const wcComputed = useWorkingCapital(rowsForWC, pnlComputed, ratiosForWC, years);

  /* -----------------------------------------------------
      DEBUG
  ----------------------------------------------------- */
  console.log("🔥 DEBUG — pnlComputed:", JSON.stringify(pnlComputed, null, 2));

    /* -----------------------------------------------------
      HIDE WARNING
  ----------------------------------------------------- */
  
    useEffect(() => {
  if (saved) {
    setShowWarning(false);
  }
}, [saved]);

  /* -----------------------------------------------------
      RENDER
  ----------------------------------------------------- */
  return (
    <>
      {/* STICKY TOPTABS */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          background: "white",
        }}
      >
        <TopTabs
          projectId={projectId}
          onSave={() => save(computedRows)}
          saving={saving}
          saved={saved}
          error={error}
        />
      
       {showWarning && (
    <div
      style={{
        padding: "8px 12px",
        background: "#fff3cd",
        borderBottom: "1px solid #ffeeba",
        color: "#856404",
        fontSize: 14,
        textAlign: "center",
      }}
    >
      ⚠️ Please click <strong>Save</strong> before navigating away — otherwise your input will be lost.
    </div>
  )}
      
      </div>

      <div style={{ padding: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
          Balance Sheet Input
        </h1>

        <InvestmentsTable
          rows={rows}
          computedRows={computedRows}
          years={years}
          updateRow={updateRow}
        />

        <WorkingCapitalTable
          rows={rows}
          pnl={pnlComputed}
          ratios={ratios}
          years={years}
          updateRow={updateRow}
          updateRatio={updateRatio}
          setRatios={setRatios} 
        />

        <FinancingTable
          rows={rows}
          computedRows={computedRows}
          pnlModel={pnlComputed}
          years={years}
          updateRow={updateRow}
        />

        <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
          Balance Sheet Output
        </h1>

        <BalanceSheetTable
            rows={computedRows}
            years={years}
        />

        <SaveButton
          saving={saving}
          saved={saved}
          error={error}
          onClick={() => save(computedRows)}
        />
      </div>
    </>
  );
}
