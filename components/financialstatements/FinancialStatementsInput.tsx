"use client";

import { useMemo } from "react";
import TopTabs from "@/components/layout/TopTabs";
import { Download } from "lucide-react";

import PnlOutputTable from "@/components/pnl/PnlOutput";
import BalanceOutput from "@/components/balance/BalanceOutput";
import CashflowOutput from "@/components/cashflow/CashflowOutput";

import { usePnlModel } from "@/components/pnl/hooks/usePnlModel";
import { useComputedBalance } from "@/components/balance/hooks/useComputedBalance";
import { useComputedCashflow } from "@/components/cashflow/hooks/useComputedCashflow";
import { useBalanceData } from "@/components/balance/hooks/useBalanceData";

/* -------------------------------------------------- */
/* EXPORT TO EXCEL                                    */
/* -------------------------------------------------- */

function exportHtmlToExcel() {
  const el = document.getElementById("financial-statements-export");
  if (!el) return;

  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:x="urn:schemas-microsoft-com:office:excel"
          xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="Content-Type"
              content="application/vnd.ms-excel; charset=UTF-8" />
        <style>
          table { border-collapse: collapse; }
          th, td { padding: 6px; border: 1px solid #ccc; }
          th { font-weight: bold; background: #f3f4f6; }
        </style>
      </head>
      <body>
        ${el.innerHTML}
      </body>
    </html>
  `;

  const blob = new Blob([html], {
    type: "application/vnd.ms-excel;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "3-statement-model.xls";
  a.click();
  URL.revokeObjectURL(url);
}

/* -------------------------------------------------- */
/* COMPONENT                                          */
/* -------------------------------------------------- */

export default function FinancialStatementsInput({
  projectId,
  startYear,
  forecastYears,
}: {
  projectId: string;
  startYear: number;
  forecastYears: number;
}) {
  /* ---------------- YEARS ---------------- */

  const years = useMemo(
    () => Array.from({ length: forecastYears }, (_, i) => startYear + i),
    [startYear, forecastYears]
  );

  /* ---------------- LOAD BALANCE + PNL + RATIOS ---------------- */

  const {
    rows: balanceRows,
    ratios,
    pnl,
    loading,
  } = useBalanceData(projectId, years);

  /* ---------------- COMPUTED MODELS ---------------- */

  const pnlModel = usePnlModel(pnl, years);

  const balanceComputed = useComputedBalance(
    balanceRows,
    pnlModel,
    years,
    ratios
  );

  const cashflowComputed = useComputedCashflow(
    pnlModel,
    balanceComputed,
    years
  );

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return <div style={{ padding: 24 }}>Loading financial statements…</div>;
  }

  /* ---------------- RENDER ---------------- */

  return (
    <>
      {/* STICKY HEADER */}
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
          onSave={() => {}}
          saving={false}
          saved={false}
          error=""
        />
      </div>

      <div style={{ padding: 24 }}>
        {/* EXPORT BUTTON */}
        <button
          type="button"
          aria-label="Export financial statements to Excel"
          onClick={exportHtmlToExcel}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 14px",
            marginBottom: 16,
            borderRadius: 8,
            border: "1px solid #d1d5db",
            background: "#ffffff",
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 500,
            color: "#111827",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f9fafb";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#ffffff";
          }}
        >
          <Download size={16} />
          Export to Excel
        </button>

        {/* EXPORT CONTENT */}
        <div id="financial-statements-export">
          <PnlOutputTable computed={pnlModel} years={years} />

          <BalanceOutput rows={balanceComputed} years={years} />

          <CashflowOutput rows={cashflowComputed} years={years} />
        </div>
      </div>
    </>
  );
}
