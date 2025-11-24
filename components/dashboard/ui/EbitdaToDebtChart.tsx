"use client";

import "@/components/dashboard/ui/register";
import { Bar } from "react-chartjs-2";

export default function EbitdaToDebtChart({
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
            label: "EBITDA / Total Debt",
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
