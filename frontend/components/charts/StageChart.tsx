"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { MetricCount } from "@/lib/types";

const STAGE_LABELS: Record<string, string> = {
  descubrimiento: "Descubrimiento",
  evaluacion: "Evaluación",
  negociacion: "Negociación",
  listo_para_cerrar: "Listo p/ cerrar",
};

const STAGE_COLORS = ["#94a3b8", "#60a5fa", "#f59e0b", "#22c55e"];

export default function StageChart({ data }: { data: MetricCount[] }) {
  const formatted = data.map((d, i) => ({
    name: STAGE_LABELS[d.label] ?? d.label,
    clientes: d.count,
    cierre: d.close_rate,
    fill: STAGE_COLORS[i] ?? "#64748b",
  }));

  return (
    <div className="card">
      <h3 className="font-semibold text-slate-800 mb-1">Embudo de etapas</h3>
      <p className="text-xs text-slate-400 mb-4">Clientes por etapa del proceso de venta</p>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={formatted} margin={{ top: 5, right: 20, left: 0, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip formatter={(v: number, n: string) => [n === "cierre" ? `${v}%` : v, n === "cierre" ? "Tasa cierre" : "Clientes"]} />
          <Bar dataKey="clientes" name="Clientes" radius={[4, 4, 0, 0]}>
            {formatted.map((entry, i) => (
              <Cell key={i} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
