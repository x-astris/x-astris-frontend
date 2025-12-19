//dashboard/dashboardInput.tsx

"use client";

import RevenueChart from "./ui/RevenueChart";
import EbitdaChart from "./ui/EbitdaChart";
import InvestmentsChart from "./ui/InvestmentsChart";
import CashChart from "./ui/CashChart";
import { useDashboardData } from "./hooks/useDashboardData";
import TopTabs from "../layout/TopTabs";
import ICRChart from "./ui/ICRChart";
import DebtToEbitdaChart from "./ui/DebtToEbitdaChart";
import DebtToEquityChart from "./ui/DebtToEquityChart";
import SolvencyRatioChart from "./ui/SolvencyRatioChart";
import NetDebtChart from "./ui/NetDebtChart";
import NetResultChart from "./ui/NetResultChart";
import NetWorkingCapitalChart from "./ui/NetWorkingCapitalChart";


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

  const { 
    years,
    revenue, 
    ebitda, 
    investments, 
    cash, 
    icr,
    solvencyRatio, 
    debtToEbitda, 
    netDebtToEbitda, 
    debtToEquity,
    netResult,
    netWorkingCapital,
    netDebt,
   } = data;

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
      <h3 style={{ marginBottom: 8 }}>Investments (capex)</h3>
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
  {/* ICR */}
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

  {/* Solvency Ratio */}
  <div
    style={{
      flex: "1 1 320px",
      border: "1px solid #eee",
      borderRadius: 8,
      padding: 16,
    }}
  >
    <h3 style={{ marginBottom: 8 }}>Solvency Ratio</h3>
    <SolvencyRatioChart years={years} data={solvencyRatio} />
  </div>

  {/* Debt / EBITDA */}
  <div
    style={{
      flex: "1 1 320px",
      border: "1px solid #eee",
      borderRadius: 8,
      padding: 16,
    }}
  >
    <h3 style={{ marginBottom: 8 }}>Debt / EBITDA</h3>
    <DebtToEbitdaChart years={years} data={debtToEbitda} />
  </div>

  {/* Debt / Equity */}
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

{/* ------------------------------ */}
{/*   OTHER KPIs    */}
{/* ------------------------------ */}

<h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
  Other KPIs
</h1>

<div
  style={{
    display: "flex",
    flexWrap: "wrap",
    gap: 24,
  }}
>

  {/* Net Result */}

<div
    style={{
      flex: "1 1 320px",
      border: "1px solid #eee",
      borderRadius: 8,
      padding: 16,
    }}
  >
    <h3 style={{ marginBottom: 8 }}>Net Result</h3>
    <NetResultChart years={years} data={netResult} />
  </div>

  {/* Net Working Capital */}
  <div
    style={{
      flex: "1 1 320px",
      border: "1px solid #eee",
      borderRadius: 8,
      padding: 16,
    }}
  >
    <h3 style={{ marginBottom: 8 }}>Net Working Capital</h3>
    <NetWorkingCapitalChart years={years} data={netWorkingCapital} />
  </div>

  {/* Net Debt */}
  <div
    style={{
      flex: "1 1 320px",
      border: "1px solid #eee",
      borderRadius: 8,
      padding: 16,
    }}
  >
    <h3 style={{ marginBottom: 8 }}>Net Debt</h3>
    <NetDebtChart years={years} data={netDebt} />
  </div>

</div>

</div>


    </>
  );
}