import type {
  ClientFilters,
  ClientDetail,
  MetricCount,
  OverviewMetrics,
  PaginatedClients,
  PipelineStatus,
  TimelinePoint,
} from "./types";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function get<T>(path: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
  const url = new URL(`${BASE}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
    });
  }
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json();
}

export const api = {
  clients: {
    list: (filters: ClientFilters = {}) =>
      get<PaginatedClients>("/api/clients", filters as Record<string, string | number | boolean | undefined>),
    get: (id: number) => get<ClientDetail>(`/api/clients/${id}`),
  },
  metrics: {
    status: () => get<PipelineStatus>("/api/metrics/status"),
    overview: () => get<OverviewMetrics>("/api/metrics/overview"),
    bySentiment: () => get<MetricCount[]>("/api/metrics/by-sentiment"),
    byObjection: () => get<MetricCount[]>("/api/metrics/by-objection"),
    byIndustry: () => get<MetricCount[]>("/api/metrics/by-industry"),
    byStage: () => get<MetricCount[]>("/api/metrics/by-stage"),
    bySalesperson: () => get<MetricCount[]>("/api/metrics/by-salesperson"),
    byUrgency: () => get<MetricCount[]>("/api/metrics/by-urgency"),
    byProductFit: () => get<MetricCount[]>("/api/metrics/by-product-fit"),
    timeline: () => get<TimelinePoint[]>("/api/metrics/timeline"),
    vendors: () => get<string[]>("/api/metrics/vendors"),
  },
};
