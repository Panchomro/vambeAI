import { api } from "@/lib/api";
import KPICards from "@/components/dashboard/KPICards";
import SentimentChart from "@/components/charts/SentimentChart";
import ObjectionsChart from "@/components/charts/ObjectionsChart";
import IndustryChart from "@/components/charts/IndustryChart";
import StageChart from "@/components/charts/StageChart";
import TimelineChart from "@/components/charts/TimelineChart";
import SalespersonChart from "@/components/charts/SalespersonChart";
import UrgencyProductFitChart from "@/components/charts/UrgencyProductFitChart";

export const revalidate = 60;

export default async function DashboardPage() {
  const [overview, status, sentiment, objections, industry, stage, salesperson, urgency, fit, timeline] =
    await Promise.all([
      api.metrics.overview(),
      api.metrics.status(),
      api.metrics.bySentiment(),
      api.metrics.byObjection(),
      api.metrics.byIndustry(),
      api.metrics.byStage(),
      api.metrics.bySalesperson(),
      api.metrics.byUrgency(),
      api.metrics.byProductFit(),
      api.metrics.timeline(),
    ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">
          Métricas de ventas enriquecidas con IA · {status.categorized.toLocaleString()} de{" "}
          {status.total.toLocaleString()} clientes categorizados ({status.progress_pct}%)
        </p>
      </div>

      <KPICards metrics={overview} status={status} />

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <SentimentChart data={sentiment} />
        <ObjectionsChart data={objections} />
        <StageChart data={stage} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TimelineChart data={timeline} />
        <UrgencyProductFitChart urgencyData={urgency} fitData={fit} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IndustryChart data={industry} />
        <SalespersonChart data={salesperson} />
      </div>
    </div>
  );
}
