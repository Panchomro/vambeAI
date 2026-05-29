"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { MetricCount } from "@/lib/types";

export default function SalespersonChart({ data }: { data: MetricCount[] }) {
  const top10 = data.slice(0, 10).map((d) => ({
    name: d.label.split(" ")[0],
    fullName: d.label,
    clientes: d.count,
    cierre: d.close_rate,
  }));

  return (
    <div className="card">
      <h3 className="font-semibold text-slate-800 dark:text-white mb-1">Rendimiento por vendedor</h3>
      <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Top 10 vendedores por tasa de cierre</p>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={top10} margin={{ top: 5, right: 20, left: 0, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-30} textAnchor="end" />
          <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
          <YAxis yAxisId="right" orientation="right" unit="%" tick={{ fontSize: 12 }} />
          <Tooltip
            labelFormatter={(label: string, payload: { payload?: { fullName?: string } }[]) =>
              payload?.[0]?.payload?.fullName ?? label
            }
          />
          <Legend />
          <Bar yAxisId="left" dataKey="clientes" name="Clientes" fill="#4f6ef7" radius={[4, 4, 0, 0]} />
          <Bar yAxisId="right" dataKey="cierre" name="Cierre %" fill="#f59e0b" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
