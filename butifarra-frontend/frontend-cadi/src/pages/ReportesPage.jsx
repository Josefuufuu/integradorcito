import { useEffect, useState } from "react";
import { fetchAdminDashboard } from "../services/dashboard.js";

export default function ReportesPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAdminDashboard()
      .then((payload) => setData(payload))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const metrics = data?.metrics ?? {};

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-800">Reportes y analítica</h1>
        <p className="mt-2 text-sm text-slate-500">
          Visualiza indicadores clave y reportes de participación para hacer seguimiento al impacto de los programas de bienestar
          universitario.
        </p>
      </section>

      {error && (
        <section className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
          {error}
        </section>
      )}

      {loading && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
          Generando reportes…
        </section>
      )}

      {!loading && !error && (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800">Actividades próximas</h2>
            <p className="mt-1 text-3xl font-semibold text-violet-600">{metrics.upcoming_activities ?? 0}</p>
            <p className="mt-2 text-sm text-slate-500">Eventos planificados para las próximas semanas.</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800">Proyectos en inscripción</h2>
            <p className="mt-1 text-3xl font-semibold text-violet-600">{metrics.active_projects ?? 0}</p>
            <p className="mt-2 text-sm text-slate-500">Programas PSU y voluntariados disponibles.</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800">Campañas activas</h2>
            <p className="mt-1 text-3xl font-semibold text-violet-600">{metrics.campaigns ?? 0}</p>
            <p className="mt-2 text-sm text-slate-500">Comunicaciones enviadas en el último mes.</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800">Torneos registrados</h2>
            <p className="mt-1 text-3xl font-semibold text-violet-600">{metrics.registered_tournaments ?? 0}</p>
            <p className="mt-2 text-sm text-slate-500">Competencias activas en el semestre.</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800">Citas semanales</h2>
            <p className="mt-1 text-3xl font-semibold text-violet-600">{metrics.sessions_this_week ?? 0}</p>
            <p className="mt-2 text-sm text-slate-500">Sesiones de acompañamiento programadas.</p>
          </article>
        </section>
      )}
    </div>
  );
}
