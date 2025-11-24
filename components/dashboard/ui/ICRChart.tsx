"use client";

import "@/components/dashboard/ui/register";
import { Bar } from "react-chartjs-2";

export default function ICRChart({
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
            label: "ICR",
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
