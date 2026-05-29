"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import type { MetricCount } from "@/lib/types";

const LABELS: Record<string, string> = {
  precio: "Precio",
  tiempo: "Tiempo",
  necesidad: "Necesidad",
  competencia: "Competencia",
  ninguna: "Ninguna",
};

const BAR_COLORS = ["#4f6ef7", "#7c3aed", "#db2777", "#ea580c", "#16a34a"];

export default function ObjectionsChart({ data }: { data: MetricCount[] }) {
  const formatted = data.map((d, i) => ({
    name: LABELS[d.label] ?? d.label,
    clientes: d.count,
    cierre: d.close_rate,
    fill: BAR_COLORS[i % BAR_COLORS.length],
  }));

  return (
    <div className="card">
      <h3 className="font-semibold text-slate-800 dark:text-white mb-1">Objeciones y tasa de cierre</h3>
      <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Frecuencia de cada objeción y su impacto en el cierre</p>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={formatted} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
          <YAxis yAxisId="right" orientation="right" unit="%" tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="clientes" name="Clientes" radius={[4, 4, 0, 0]}>
            {formatted.map((entry, i) => (
              <Cell key={i} fill={entry.fill} />
            ))}
          </Bar>
          <Bar yAxisId="right" dataKey="cierre" name="Tasa cierre %" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
