"use client";

import { useEffect, useMemo, useState } from "react";
import TopTabs from "@/components/layout/TopTabs";
import { api } from "@/lib/api/client";

import CashflowOutput from "@/components/cashflow/CashflowOutput";

import { usePnlModel } from "@/components/pnl/hooks/usePnlModel";
import { useComputedBalance } from "@/components/balance/hooks/useComputedBalance";
import { useComputedCashflow } from "@/components/cashflow/hooks/useComputedCashflow";

export default function CashflowInput({
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

  /* ---------------- STATE ---------------- */

  const [pnl, setPnl] = useState<any[]>([]);
  const [balance, setBalance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- LOAD DATA ---------------- */

  useEffect(() => {
    async function load() {
      const pnlRes = await api.get(`/pnl?projectId=${projectId}`);
      const balRes = await api.get(`/balance?projectId=${projectId}`);

      setPnl(pnlRes.data ?? []);
      setBalance(balRes.data ?? []);
      setLoading(false);
    }
    load();
  }, [projectId]);

  /* ---------------- COMPUTED MODELS ---------------- */

  const pnlModel = usePnlModel(pnl, years);

  const balanceComputed = useComputedBalance(
    balance,
    pnlModel,
    years,
    []
  );

  const cashflowComputed = useComputedCashflow(
    pnlModel,
    balanceComputed,
    years
  );

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return <div style={{ padding: 24 }}>Loading cash flow…</div>;
  }

  /* ---------------- RENDER ---------------- */

  return (
    <>
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
        <CashflowOutput
          rows={cashflowComputed}
          years={years}
        />
      </div>
    </>
  );
}
