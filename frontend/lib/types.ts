export interface Client {
  id: number;
  nombre: string;
  correo: string;
  telefono: string;
  fecha_reunion: string;
  vendedor: string;
  closed: number;
  categorized: boolean;
  sentimiento: string | null;
  urgencia: string | null;
  objecion_principal: string | null;
  ajuste_producto: string | null;
  industria: string | null;
  etapa_cliente: string | null;
  es_decisor: string | null;
  accion_seguimiento: string | null;
  menciona_competencia: boolean | null;
  puntos_dolor: string[];
}

export interface ClientDetail extends Client {
  transcripcion: string;
}

export interface PaginatedClients {
  total: number;
  page: number;
  limit: number;
  data: Client[];
}

export interface MetricCount {
  label: string;
  count: number;
  close_rate: number;
}

export interface OverviewMetrics {
  total_clients: number;
  total_categorized: number;
  close_rate: number;
  positive_close_rate: number;
  high_urgency_rate: number;
  top_objection: string;
}

export interface PipelineStatus {
  total: number;
  categorized: number;
  pending: number;
  progress_pct: number;
}

export interface TimelinePoint {
  month: string;
  total: number;
  closed: number;
}

export interface ClientFilters {
  search?: string;
  vendedor?: string;
  closed?: number;
  sentimiento?: string;
  urgencia?: string;
  objecion_principal?: string;
  ajuste_producto?: string;
  industria?: string;
  etapa_cliente?: string;
  es_decisor?: string;
  accion_seguimiento?: string;
  menciona_competencia?: boolean;
  fecha_desde?: string;
  fecha_hasta?: string;
  page?: number;
  limit?: number;
}
