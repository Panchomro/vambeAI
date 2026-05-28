"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { MetricCount } from "@/lib/types";

const COLORS: Record<string, string> = {
  positivo: "#22c55e",
  neutral: "#94a3b8",
  negativo: "#ef4444",
};

const LABELS: Record<string, string> = {
  positivo: "Positivo",
  neutral: "Neutral",
  negativo: "Negativo",
};

export default function SentimentChart({ data }: { data: MetricCount[] }) {
  const formatted = data.map((d) => ({
    name: LABELS[d.label] ?? d.label,
    value: d.count,
    close_rate: d.close_rate,
    fill: COLORS[d.label] ?? "#64748b",
  }));

  return (
    <div className="card">
      <h3 className="font-semibold text-slate-800 mb-4">Sentimiento del cliente</h3>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie data={formatted} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
            {formatted.map((entry, i) => (
              <Cell key={i} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number, name: string, props: { payload?: { close_rate?: number } }) => [`${value} clientes (cierre: ${props.payload?.close_rate ?? 0}%)`, name]} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
