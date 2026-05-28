"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { TimelinePoint } from "@/lib/types";

export default function TimelineChart({ data }: { data: TimelinePoint[] }) {
  return (
    <div className="card">
      <h3 className="font-semibold text-slate-800 mb-1">Reuniones por mes</h3>
      <p className="text-xs text-slate-400 mb-4">Total de reuniones y cierres en el tiempo</p>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="total" name="Reuniones" stroke="#4f6ef7" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="closed" name="Cierres" stroke="#10b981" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
