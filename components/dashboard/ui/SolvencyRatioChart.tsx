"use client";

import "@/components/dashboard/ui/register";
import { Bar } from "react-chartjs-2";

export default function SolvencyRatioChart({
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
            label: "Solvency Ratio (Equity / Total Assets)",
            data,
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            min: 0,
            max: 1,
            ticks: {
              callback: (value) => `${Number(value) * 100}%`,
            },
          },
        },
      }}
    />
  );
}
