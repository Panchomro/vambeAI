"use client";

const SENTIMENT_STYLES: Record<string, string> = {
  positivo: "bg-green-100 text-green-700",
  neutral: "bg-slate-100 text-slate-600",
  negativo: "bg-red-100 text-red-700",
};

const URGENCY_STYLES: Record<string, string> = {
  alta: "bg-red-100 text-red-700",
  media: "bg-amber-100 text-amber-700",
  baja: "bg-blue-100 text-blue-700",
};

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

export function SentimentBadge({ value }: { value: string }) {
  return (
    <span className={`badge ${SENTIMENT_STYLES[value] ?? "bg-slate-100 text-slate-600"}`}>
      {value.charAt(0).toUpperCase() + value.slice(1)}
    </span>
  );
}

export function UrgencyBadge({ value }: { value: string }) {
  return (
    <span className={`badge ${URGENCY_STYLES[value] ?? "bg-slate-100 text-slate-600"}`}>
      Urgencia {value}
    </span>
  );
}

export function StatusBadge({ closed }: { closed: number }) {
  return closed === 1 ? (
    <span className="badge bg-emerald-100 text-emerald-700">Cerrado</span>
  ) : (
    <span className="badge bg-slate-100 text-slate-500">Abierto</span>
  );
}

export function IndustryBadge({ value }: { value: string }) {
  return (
    <span className="badge bg-brand-50 text-brand-600">
      {INDUSTRY_LABELS[value] ?? value}
    </span>
  );
}
