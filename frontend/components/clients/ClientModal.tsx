"use client";

import { X, Mail, Phone, Calendar, User, Tag } from "lucide-react";
import type { ClientDetail } from "@/lib/types";
import { SentimentBadge, UrgencyBadge, StatusBadge, IndustryBadge } from "./badges";

interface Props {
  client: ClientDetail | null;
  onClose: () => void;
}

const FIELD_LABELS: Record<string, string> = {
  objecion_principal: "Objeción",
  ajuste_producto: "Ajuste producto",
  etapa_cliente: "Etapa",
  es_decisor: "Es decisor",
  accion_seguimiento: "Acción seguimiento",
  menciona_competencia: "Menciona competencia",
};

export default function ClientModal({ client, onClose }: Props) {
  if (!client) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{client.nombre}</h2>
            <p className="text-sm text-slate-500 mt-0.5">{client.vendedor}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Mail className="w-4 h-4 text-slate-400" />
              {client.correo}
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Phone className="w-4 h-4 text-slate-400" />
              {client.telefono}
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Calendar className="w-4 h-4 text-slate-400" />
              {client.fecha_reunion}
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <User className="w-4 h-4 text-slate-400" />
              {client.vendedor}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <StatusBadge closed={client.closed} />
            {client.sentimiento && <SentimentBadge value={client.sentimiento} />}
            {client.urgencia && <UrgencyBadge value={client.urgencia} />}
            {client.industria && <IndustryBadge value={client.industria} />}
          </div>

          {client.categorized && (
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
                <Tag className="w-4 h-4" /> Dimensiones IA
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(FIELD_LABELS).map(([key, label]) => {
                  const val = client[key as keyof ClientDetail];
                  if (val === null || val === undefined) return null;
                  return (
                    <div key={key} className="bg-slate-50 rounded-lg p-3">
                      <p className="text-xs text-slate-400 mb-1">{label}</p>
                      <p className="text-sm font-medium text-slate-800">
                        {typeof val === "boolean" ? (val ? "Sí" : "No") : String(val)}
                      </p>
                    </div>
                  );
                })}
              </div>
              {client.puntos_dolor?.length > 0 && (
                <div className="mt-3 bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-2">Puntos de dolor</p>
                  <ul className="space-y-1">
                    {client.puntos_dolor.map((p, i) => (
                      <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                        <span className="text-red-400 mt-0.5">•</span> {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-2">Transcripción</h4>
            <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600 leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap">
              {client.transcripcion}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
