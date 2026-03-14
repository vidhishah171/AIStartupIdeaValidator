"use client";

import type { FC } from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

export type TrendDatum = {
  period: string;
  demand: number;
};

export const MarketTrendSparkline: FC<{ data: TrendDatum[] }> = ({ data }) => {
  return (
    <div className="h-40 w-full rounded-2xl bg-slate-50/40 p-2 dark:bg-slate-900/40">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 6, bottom: 4, left: 6 }}>
          <XAxis
            dataKey="period"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "rgba(15,23,42,0.7)" }}
            stroke="transparent"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              borderRadius: 12,
              border: "1px solid rgba(15,23,42,0.15)",
              fontSize: 13,
            }}
            labelFormatter={(value) => `${value}`}
            itemStyle={{ color: "#0f172a" }}
          />
          <Line type="monotone" dataKey="demand" stroke="#16a34a" strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
