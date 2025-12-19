//dashboard/ui/EbitdaToDebtChart.tsx

"use client";

import "@/components/dashboard/ui/register";
import { Bar } from "react-chartjs-2";

export default function debtToEbitdaChart({
  years,
  data,
}: {
  years: number[];
  data: number[];
}) {
  return (
    <Bar
      data={{
        labels: years,
        datasets: [
          {
            label: "Debt / EBITDA",
            data,
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: { legend: { display: false } },
      }}
    />
  );
}
