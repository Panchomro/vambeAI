"use client";

import { TrendingUp, Users, Zap, AlertCircle, CheckCircle2, Target } from "lucide-react";
import type { OverviewMetrics, PipelineStatus } from "@/lib/types";

const OBJECTION_LABELS: Record<string, string> = {
  precio: "Precio",
  tiempo: "Tiempo",
  necesidad: "Necesidad",
  competencia: "Competencia",
  ninguna: "Ninguna",
};

interface Props {
  metrics: OverviewMetrics;
  status: PipelineStatus;
}

export default function KPICards({ metrics, status }: Props) {
  const cards = [
    {
      title: "Total clientes",
      value: metrics.total_clients.toLocaleString(),
      sub: `${metrics.total_categorized.toLocaleString()} categorizados`,
      icon: Users,
      color: "blue",
    },
    {
      title: "Tasa de cierre",
      value: `${metrics.close_rate}%`,
      sub: "sobre total de reuniones",
      icon: TrendingUp,
      color: "green",
    },
    {
      title: "Cierre sentimiento positivo",
      value: `${metrics.positive_close_rate}%`,
      sub: "clientes con sentimiento positivo",
      icon: CheckCircle2,
      color: "emerald",
    },
    {
      title: "Alta urgencia",
      value: `${metrics.high_urgency_rate}%`,
      sub: "de clientes categorizados",
      icon: Zap,
      color: "amber",
    },
    {
      title: "Objeción principal",
      value: OBJECTION_LABELS[metrics.top_objection] ?? metrics.top_objection,
      sub: "más frecuente",
      icon: AlertCircle,
      color: "red",
    },
    {
      title: "Progreso pipeline",
      value: `${status.progress_pct}%`,
      sub: `${status.pending.toLocaleString()} pendientes`,
      icon: Target,
      color: "purple",
    },
  ];

  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div key={c.title} className="card flex flex-col gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[c.color]}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{c.value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{c.title}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">{c.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
