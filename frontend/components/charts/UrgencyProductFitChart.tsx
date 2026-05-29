"use client";

import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from "recharts";
import type { MetricCount } from "@/lib/types";

const URGENCY_LABELS: Record<string, string> = { alta: "Alta", media: "Media", baja: "Baja" };
const FIT_LABELS: Record<string, string> = { excelente: "Excelente", bueno: "Bueno", regular: "Regular", bajo: "Bajo" };

export default function UrgencyProductFitChart({
  urgencyData,
  fitData,
}: {
  urgencyData: MetricCount[];
  fitData: MetricCount[];
}) {
  const radarData = [
    ...urgencyData.map((d) => ({ dimension: `Urgencia ${URGENCY_LABELS[d.label] ?? d.label}`, cierre: d.close_rate, clientes: d.count })),
    ...fitData.map((d) => ({ dimension: `Fit ${FIT_LABELS[d.label] ?? d.label}`, cierre: d.close_rate, clientes: d.count })),
  ];

  return (
    <div className="card">
      <h3 className="font-semibold text-slate-800 dark:text-white mb-1">Urgencia & ajuste de producto</h3>
      <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Tasa de cierre por combinación de dimensiones</p>
      <ResponsiveContainer width="100%" height={260}>
        <RadarChart data={radarData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 10 }} />
          <Radar name="Tasa cierre %" dataKey="cierre" stroke="#4f6ef7" fill="#4f6ef7" fillOpacity={0.35} />
          <Tooltip formatter={(v: number) => [`${v}%`, "Tasa cierre"]} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
