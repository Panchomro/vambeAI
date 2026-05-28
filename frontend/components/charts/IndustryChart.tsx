"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { MetricCount } from "@/lib/types";

const INDUSTRY_LABELS: Record<string, string> = {
  retail: "Retail",
  salud: "Salud",
  ecommerce: "E-commerce",
  restaurante: "Restaurante",
  seguros: "Seguros",
  educacion: "Educación",
  logistica: "Logística",
  farmacia: "Farmacia",
  fitness: "Fitness",
  otro: "Otro",
};

export default function IndustryChart({ data }: { data: MetricCount[] }) {
  const formatted = data.map((d) => ({
    name: INDUSTRY_LABELS[d.label] ?? d.label,
    clientes: d.count,
    cierre: d.close_rate,
  }));

  return (
    <div className="card">
      <h3 className="font-semibold text-slate-800 mb-1">Industrias</h3>
      <p className="text-xs text-slate-400 mb-4">Distribución por sector y tasa de cierre</p>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={formatted} layout="vertical" margin={{ top: 5, right: 60, left: 70, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 12 }} />
          <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={65} />
          <Tooltip />
          <Legend />
          <Bar dataKey="clientes" name="Clientes" fill="#4f6ef7" radius={[0, 4, 4, 0]} />
          <Bar dataKey="cierre" name="Cierre %" fill="#10b981" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
