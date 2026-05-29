"use client";

import { useState, useEffect, useCallback } from "react";
import ClientTable from "@/components/clients/ClientTable";
import ClientFilters from "@/components/clients/ClientFilters";
import ClientModal from "@/components/clients/ClientModal";
import { api } from "@/lib/api";
import type { Client, ClientDetail, ClientFilters as IFilters, PaginatedClients } from "@/lib/types";

const DEFAULT_FILTERS: IFilters = { page: 1, limit: 20 };

export default function ClientsPage() {
  const [filters, setFilters] = useState<IFilters>(DEFAULT_FILTERS);
  const [data, setData] = useState<PaginatedClients | null>(null);
  const [vendors, setVendors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<ClientDetail | null>(null);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      const result = await api.clients.list(filters);
      setData(result);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  useEffect(() => {
    api.metrics.vendors().then(setVendors);
  }, []);

  const handleSelectClient = async (c: Client) => {
    const detail = await api.clients.get(c.id);
    setSelectedClient(detail);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Clientes</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Busca, filtra y explora el detalle de cada cliente</p>
      </div>

      <div className="flex gap-6">
        <aside className="w-64 shrink-0">
          <ClientFilters
            filters={filters}
            vendors={vendors}
            onChange={setFilters}
            onReset={() => setFilters(DEFAULT_FILTERS)}
          />
        </aside>

        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="card flex items-center justify-center h-64 text-slate-400 text-sm">
              Cargando clientes...
            </div>
          ) : data ? (
            <ClientTable
              data={data}
              page={filters.page ?? 1}
              onPageChange={(p) => setFilters((f) => ({ ...f, page: p }))}
              onLimitChange={(limit) => setFilters((f) => ({ ...f, limit, page: 1 }))}
              onSelectClient={handleSelectClient}
            />
          ) : null}
        </div>
      </div>

      <ClientModal client={selectedClient} onClose={() => setSelectedClient(null)} />
    </div>
  );
}
