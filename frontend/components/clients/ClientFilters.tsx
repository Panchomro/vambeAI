"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import type { ClientFilters } from "@/lib/types";

interface Props {
  filters: ClientFilters;
  vendors: string[];
  onChange: (f: ClientFilters) => void;
  onReset: () => void;
}

const SELECT_OPTIONS = {
  sentimiento: [
    { value: "", label: "Todos" },
    { value: "positivo", label: "Positivo" },
    { value: "neutral", label: "Neutral" },
    { value: "negativo", label: "Negativo" },
  ],
  urgencia: [
    { value: "", label: "Todas" },
    { value: "alta", label: "Alta" },
    { value: "media", label: "Media" },
    { value: "baja", label: "Baja" },
  ],
  objecion_principal: [
    { value: "", label: "Todas" },
    { value: "precio", label: "Precio" },
    { value: "tiempo", label: "Tiempo" },
    { value: "necesidad", label: "Necesidad" },
    { value: "competencia", label: "Competencia" },
    { value: "ninguna", label: "Ninguna" },
  ],
  ajuste_producto: [
    { value: "", label: "Todos" },
    { value: "excelente", label: "Excelente" },
    { value: "bueno", label: "Bueno" },
    { value: "regular", label: "Regular" },
    { value: "bajo", label: "Bajo" },
  ],
  industria: [
    { value: "", label: "Todas" },
    { value: "retail", label: "Retail" },
    { value: "salud", label: "Salud" },
    { value: "ecommerce", label: "E-commerce" },
    { value: "restaurante", label: "Restaurante" },
    { value: "seguros", label: "Seguros" },
    { value: "educacion", label: "Educación" },
    { value: "logistica", label: "Logística" },
    { value: "farmacia", label: "Farmacia" },
    { value: "fitness", label: "Fitness" },
    { value: "otro", label: "Otro" },
  ],
  etapa_cliente: [
    { value: "", label: "Todas" },
    { value: "descubrimiento", label: "Descubrimiento" },
    { value: "evaluacion", label: "Evaluación" },
    { value: "negociacion", label: "Negociación" },
    { value: "listo_para_cerrar", label: "Listo p/ cerrar" },
  ],
  closed: [
    { value: "", label: "Todos" },
    { value: "1", label: "Cerrado" },
    { value: "0", label: "Abierto" },
  ],
};

export default function ClientFilters({ filters, vendors, onChange, onReset }: Props) {
  const update = (key: keyof ClientFilters, value: string | number | undefined) => {
    onChange({ ...filters, [key]: value === "" ? undefined : value, page: 1 });
  };

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <SlidersHorizontal className="w-4 h-4" />
          Filtros
        </div>
        <button onClick={onReset} className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1">
          <X className="w-3 h-3" /> Limpiar
        </button>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Nombre, correo, vendedor..."
          value={filters.search ?? ""}
          onChange={(e) => update("search", e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/30"
        />
      </div>

      {(
        [
          ["Estado", "closed", SELECT_OPTIONS.closed],
          ["Sentimiento", "sentimiento", SELECT_OPTIONS.sentimiento],
          ["Urgencia", "urgencia", SELECT_OPTIONS.urgencia],
          ["Objeción", "objecion_principal", SELECT_OPTIONS.objecion_principal],
          ["Ajuste producto", "ajuste_producto", SELECT_OPTIONS.ajuste_producto],
          ["Industria", "industria", SELECT_OPTIONS.industria],
          ["Etapa", "etapa_cliente", SELECT_OPTIONS.etapa_cliente],
        ] as [string, keyof ClientFilters, { value: string; label: string }[]][]
      ).map(([label, key, options]) => (
        <div key={key}>
          <label className="text-xs text-slate-500 block mb-1">{label}</label>
          <select
            value={String(filters[key] ?? "")}
            onChange={(e) => update(key, e.target.value === "" ? undefined : key === "closed" ? Number(e.target.value) : e.target.value)}
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/30 bg-white"
          >
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      ))}

      <div>
        <label className="text-xs text-slate-500 block mb-1">Vendedor</label>
        <select
          value={filters.vendedor ?? ""}
          onChange={(e) => update("vendedor", e.target.value)}
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/30 bg-white"
        >
          <option value="">Todos</option>
          {vendors.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
