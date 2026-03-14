"use client";

import {
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  PolarAngleAxis,
} from "recharts";

export function MarketDemandGauge({ value }: { value: number }) {
  const safeValue = Math.max(0, Math.min(100, value));
  const data = [{ name: "score", value: safeValue, fill: "hsl(var(--primary))" }];

  return (
    <div className="h-40 w-full max-w-[180px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          data={data}
          innerRadius="70%"
          outerRadius="100%"
          startAngle={180}
          endAngle={0}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar dataKey="value" cornerRadius={10} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="-mt-10 text-center">
        <p className="text-3xl font-semibold text-foreground">{safeValue}</p>
        <p className="text-xs text-muted-foreground">/ 100 demand score</p>
      </div>
    </div>
  );
}
