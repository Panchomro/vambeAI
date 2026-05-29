"use client";

import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import type { Client, PaginatedClients } from "@/lib/types";
import { SentimentBadge, UrgencyBadge, StatusBadge, IndustryBadge } from "./badges";

interface Props {
  data: PaginatedClients;
  page: number;
  onPageChange: (p: number) => void;
  onLimitChange: (limit: number) => void;
  onSelectClient: (c: Client) => void;
}

const OBJECTION_LABELS: Record<string, string> = {
  precio: "Precio",
  tiempo: "Tiempo",
  necesidad: "Necesidad",
  competencia: "Competencia",
  ninguna: "—",
};

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export default function ClientTable({ data, page, onPageChange, onLimitChange, onSelectClient }: Props) {
  const totalPages = Math.ceil(data.total / data.limit);

  return (
    <div className="card p-0 overflow-hidden flex flex-col dark:bg-slate-800 dark:border-slate-700">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between shrink-0">
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          {data.total.toLocaleString()} clientes encontrados
        </span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span>Filas:</span>
            <select
              value={data.limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="border border-slate-200 dark:border-slate-600 rounded-lg px-2 py-1 text-sm bg-white dark:bg-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            >
              {PAGE_SIZE_OPTIONS.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 dark:text-slate-300" />
            </button>
            <span className="text-sm text-slate-600 dark:text-slate-300">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4 dark:text-slate-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable table — never exceeds viewport */}
      <div className="overflow-auto max-h-[calc(100vh-320px)]">
        <table className="w-full">
          <thead className="sticky top-0 z-10">
            <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-700">
              {["Cliente", "Vendedor", "Fecha", "Estado", "Sentimiento", "Urgencia", "Industria", "Objeción", ""].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
            {data.data.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{c.nombre}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">{c.correo}</p>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">{c.vendedor}</td>
                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">{c.fecha_reunion}</td>
                <td className="px-4 py-3"><StatusBadge closed={c.closed} /></td>
                <td className="px-4 py-3">
                  {c.sentimiento ? <SentimentBadge value={c.sentimiento} /> : <span className="text-slate-300 dark:text-slate-600 text-xs">—</span>}
                </td>
                <td className="px-4 py-3">
                  {c.urgencia ? <UrgencyBadge value={c.urgencia} /> : <span className="text-slate-300 dark:text-slate-600 text-xs">—</span>}
                </td>
                <td className="px-4 py-3">
                  {c.industria ? <IndustryBadge value={c.industria} /> : <span className="text-slate-300 dark:text-slate-600 text-xs">—</span>}
                </td>
                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                  {c.objecion_principal ? (OBJECTION_LABELS[c.objecion_principal] ?? c.objecion_principal) : "—"}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => onSelectClient(c)}
                    className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-700/20 transition-colors whitespace-nowrap"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Ver Detalle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
