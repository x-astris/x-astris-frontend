//cashflow/CashflowOutput.tsx

"use client";

import CashflowTable from "@/components/cashflow/CashflowTable";

/* ---------------------- TYPES ---------------------- */

export type CashflowRow = {
  year: number;

  operating: {
    ebit: number;
    tax: number;
    noplat: number;
    depreciation: number;
    wcChange: number;
    ocf: number;
  };

  // 🔒 REQUIRED (CashflowTable depends on this)
  wcDetails: {
    invChange: number;
    recChange: number;
    ocaChange: number;
    payChange: number;
    oclChange: number;
  };

  investing: {
    investments: number;
  };

financing: {
  interest: number;
  dLong: number;
  dShort: number;
  equityContribution: number;
  dividend: number;
  financingCashFlow: number;
};

  netChange: number;
  cashCheck: number;
};

/* ---------------------- COMPONENT ---------------------- */

export default function CashflowOutput({
  rows,
  years,
}: {
  rows: CashflowRow[];
  years: number[];
}) {
  if (!rows || rows.length === 0) {
    return (
      <div style={{ marginTop: 32, color: "#666" }}>
        <h2 style={{ fontSize: 22, fontWeight: "bold", marginBottom: 12 }}>
          Cash Flow Statement
        </h2>
        <div style={{ fontStyle: "italic" }}>
          P&amp;L and Balance Sheet input required before cash flow statement can be prepared.
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 32 }}>
      <h2 style={{ fontSize: 22, fontWeight: "bold", marginBottom: 12 }}>
        Cash Flow Statement
      </h2>

      <CashflowTable
        cashflow={rows}
        years={years}
      />
    </div>
  );
}
