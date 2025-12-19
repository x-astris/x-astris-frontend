"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type ChartProps = {
  years: number[];
  data: number[];
};

export default function NetWorkingCapitalChart({ years, data }: ChartProps) {
  const chartData = years.map((year, i) => ({
    year,
    value: data[i] ?? 0,
  }));

  return (
    <div style={{ width: "100%", height: 240 }}>
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip
            formatter={(value: number) =>
              value.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })
            }
          />
          <Line type="monotone" dataKey="value" dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
