"use client";

import RevenueChart from "./ui/RevenueChart";
import EbitdaChart from "./ui/EbitdaChart";
import InvestmentsChart from "./ui/InvestmentsChart";
import CashChart from "./ui/CashChart";
import { useDashboardData } from "./hooks/useDashboardData";
import TopTabs from "../layout/TopTabs";
import ICRChart from "./ui/ICRChart";
import EbitdaToDebtChart from "./ui/EbitdaToDebtChart";
import NetDebtToEbitdaChart from "./ui/NetDebtToEbitdaChart";
import DebtToEquityChart from "./ui/DebtToEquityChart";

type Props = {
  projectId: string;
  startYear: number;
  forecastYears: number;

};

export default function DashboardInput({ projectId, startYear, forecastYears, }: Props) {
  const { data, loading, error } = useDashboardData(projectId, startYear, forecastYears );

  if (loading) {
    return <p style={{ padding: 24 }}>Loading dashboard…</p>;
  }

  if (!data) {
    return <p style={{ padding: 24 }}>No dashboard data available.</p>;
  }

  const { years, revenue, ebitda, investments, cash, icr, ebitdaToDebt, netDebtToEbitda, debtToEquity } = data;

  return (
    <>
      {/* Optional: sticky TopTabs like other screens */}
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
          // Dashboard has nothing to save → pass a no-op
          onSave={() => {}}
          saving={false}
          saved={false}
          error={error ?? ""}
        />
      </div>

<div style={{ padding: 24 }}>

  {/* ------------------------------ */}
  {/*       GENERAL KPI BLOCK        */}
  {/* ------------------------------ */}

  <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
    General KPI’s
  </h1>

  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: 24,
    }}
  >
    <div
      style={{
        flex: "1 1 320px",
        border: "1px solid #eee",
        borderRadius: 8,
        padding: 16,
      }}
    >
      <h3 style={{ marginBottom: 8 }}>Revenue</h3>
      <RevenueChart years={years} data={revenue} />
    </div>

    <div
      style={{
        flex: "1 1 320px",
        border: "1px solid #eee",
        borderRadius: 8,
        padding: 16,
      }}
    >
      <h3 style={{ marginBottom: 8 }}>EBITDA</h3>
      <EbitdaChart years={years} data={ebitda} />
    </div>

    <div
      style={{
        flex: "1 1 320px",
        border: "1px solid #eee",
        borderRadius: 8,
        padding: 16,
      }}
    >
      <h3 style={{ marginBottom: 8 }}>Investments</h3>
      <InvestmentsChart years={years} data={investments} />
    </div>

    <div
      style={{
        flex: "1 1 320px",
        border: "1px solid #eee",
        borderRadius: 8,
        padding: 16,
      }}
    >
      <h3 style={{ marginBottom: 8 }}>Cash</h3>
      <CashChart years={years} data={cash} />
    </div>
  </div>

  {/* SPACE BETWEEN BLOCKS */}
  <div style={{ height: 40 }}></div>

  {/* ------------------------------ */}
  {/*       FINANCING KPI BLOCK       */}
  {/* ------------------------------ */}

  <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
    Financing Ratios
  </h1>

  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: 24,
    }}
  >
    <div
      style={{
        flex: "1 1 320px",
        border: "1px solid #eee",
        borderRadius: 8,
        padding: 16,
      }}
    >
      <h3 style={{ marginBottom: 8 }}>ICR</h3>
      <ICRChart years={years} data={icr} />
    </div>

    <div
      style={{
        flex: "1 1 320px",
        border: "1px solid #eee",
        borderRadius: 8,
        padding: 16,
      }}
    >
      <h3 style={{ marginBottom: 8 }}>EBITDA / Total Debt</h3>
      <EbitdaToDebtChart years={years} data={ebitdaToDebt} />
    </div>

    <div
      style={{
        flex: "1 1 320px",
        border: "1px solid #eee",
        borderRadius: 8,
        padding: 16,
      }}
    >
      <h3 style={{ marginBottom: 8 }}>Net Debt / EBITDA</h3>
      <NetDebtToEbitdaChart years={years} data={netDebtToEbitda} />
    </div>

    <div
      style={{
        flex: "1 1 320px",
        border: "1px solid #eee",
        borderRadius: 8,
        padding: 16,
      }}
    >
      <h3 style={{ marginBottom: 8 }}>Debt / Equity</h3>
      <DebtToEquityChart years={years} data={debtToEquity} />
    </div>
  </div>

</div>

    </>
  );
}
