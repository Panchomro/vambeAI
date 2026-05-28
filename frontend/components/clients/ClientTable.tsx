"use client";

import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import type { Client, PaginatedClients } from "@/lib/types";
import { SentimentBadge, UrgencyBadge, StatusBadge, IndustryBadge } from "./badges";

interface Props {
  data: PaginatedClients;
  page: number;
  onPageChange: (p: number) => void;
  onSelectClient: (c: Client) => void;
}

const OBJECTION_LABELS: Record<string, string> = {
  precio: "Precio",
  tiempo: "Tiempo",
  necesidad: "Necesidad",
  competencia: "Competencia",
  ninguna: "—",
};

export default function ClientTable({ data, page, onPageChange, onSelectClient }: Props) {
  const totalPages = Math.ceil(data.total / data.limit);

  return (
    <div className="card p-0 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-700">
          {data.total.toLocaleString()} clientes encontrados
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-slate-600">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {["Cliente", "Vendedor", "Fecha", "Estado", "Sentimiento", "Urgencia", "Industria", "Objeción", ""].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.data.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-slate-900">{c.nombre}</p>
                  <p className="text-xs text-slate-400">{c.correo}</p>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">{c.vendedor}</td>
                <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">{c.fecha_reunion}</td>
                <td className="px-4 py-3"><StatusBadge closed={c.closed} /></td>
                <td className="px-4 py-3">
                  {c.sentimiento ? <SentimentBadge value={c.sentimiento} /> : <span className="text-slate-300 text-xs">—</span>}
                </td>
                <td className="px-4 py-3">
                  {c.urgencia ? <UrgencyBadge value={c.urgencia} /> : <span className="text-slate-300 text-xs">—</span>}
                </td>
                <td className="px-4 py-3">
                  {c.industria ? <IndustryBadge value={c.industria} /> : <span className="text-slate-300 text-xs">—</span>}
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {c.objecion_principal ? (OBJECTION_LABELS[c.objecion_principal] ?? c.objecion_principal) : "—"}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => onSelectClient(c)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-slate-200 rounded-lg"
                    title="Ver detalle"
                  >
                    <ExternalLink className="w-4 h-4 text-slate-500" />
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
