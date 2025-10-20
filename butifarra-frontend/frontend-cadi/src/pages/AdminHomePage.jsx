import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Activity,
  Bell,
  ClipboardList,
  Trophy,
  Users,
} from "lucide-react";

import { fetchAdminDashboard } from "../services/dashboard.js";

export default function AdminHomePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    upcoming_activities: 0,
    active_projects: 0,
    registered_tournaments: 0,
    sessions_this_week: 0,
    campaigns: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchAdminDashboard();
        if (!active) return;
        setMetrics((prev) => ({ ...prev, ...(data.metrics ?? {}) }));
        setRecentActivities(data.recent_activities ?? []);
        setCampaigns(data.recent_campaigns ?? []);
      } catch (err) {
        console.error("No se pudo cargar el tablero administrativo", err);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const summaryCards = useMemo(() => ([
    {
      title: "Gestionar personas",
      description: "Revisa solicitudes y actualiza perfiles",
      to: "/admin/usuarios",
      icon: "👥",
    },
    {
      title: "Gestionar actividades",
      description: "Crea y edita la programación del CADI",
      to: "/admin/actividades",
      icon: "🎭",
    },
    {
      title: "Ver reportes",
      description: "Indicadores y reportes de bienestar",
      to: "/admin/reportes",
      icon: "📊",
    },
  ]), []);

  const metricCards = [
    {
      title: "Actividades próximas",
      value: metrics.upcoming_activities,
      change: "Planificadas",
      tone: "text-emerald-600",
      Icon: ClipboardList,
    },
    {
      title: "Proyectos activos",
      value: metrics.active_projects,
      change: "PSU y voluntariados",
      tone: "text-emerald-600",
      Icon: Users,
    },
    {
      title: "Torneos registrados",
      value: metrics.registered_tournaments,
      change: "En el semestre",
      tone: "text-slate-500",
      Icon: Trophy,
    },
    {
      title: "Citas de la semana",
      value: metrics.sessions_this_week,
      change: "Apoyo psicológico",
      tone: "text-slate-500",
      Icon: Activity,
    },
  ];

  const quickActions = [
    {
      label: "Crear actividad",
      description: "Nueva experiencia CADI",
      Icon: ClipboardList,
      onClick: () => navigate("/admin/actividades"),
    },
    {
      label: "Publicar torneo",
      description: "Organiza competencias",
      Icon: Trophy,
      onClick: () => navigate("/admin/torneos"),
    },
    {
      label: "Enviar notificación",
      description: "Comunica novedades",
      Icon: Bell,
      onClick: () => navigate("/admin/notificaciones"),
    },
  ];

  const weeklyMetrics = [
    { label: "Campañas activas", value: metrics.campaigns, tone: "text-violet-600" },
    { label: "Proyectos en inscripción", value: metrics.active_projects, tone: "text-emerald-600" },
    { label: "Citas agendadas", value: metrics.sessions_this_week, tone: "text-slate-500" },
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-500 p-6 text-white shadow-lg">
        <p className="text-sm uppercase tracking-wide opacity-80">Panel general</p>
        <h1 className="mt-2 text-3xl font-semibold">Bienvenido al centro administrativo</h1>
        <p className="mt-3 max-w-2xl text-sm text-indigo-100">
          Supervisa las actividades y el impacto del programa de bienestar universitario. Gestiona campañas,
          actividades y reportes desde un mismo lugar.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {summaryCards.map((card) => (
          <Link
            key={card.title}
            to={card.to}
            className="group flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-md"
          >
            <span className="text-3xl">{card.icon}</span>
            <div>
              <h2 className="mt-4 text-lg font-semibold text-slate-800">{card.title}</h2>
              <p className="mt-1 text-sm text-slate-500">{card.description}</p>
            </div>
            <span className="mt-4 text-sm font-medium text-violet-600 group-hover:text-violet-700">
              Ir a la sección →
            </span>
          </Link>
        ))}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricCards.map(({ title, value, change, tone, Icon }) => (
          <div
            key={title}
            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">{title}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-800">{value}</p>
              </div>
              <span className="rounded-full bg-violet-100 p-2 text-violet-600">
                <Icon className="size-5" />
              </span>
            </div>
            <span className={`mt-4 text-xs font-semibold ${tone}`}>{change}</span>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800">⚡ Acciones rápidas</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {quickActions.map(({ label, description, Icon, onClick }) => (
            <button
              key={label}
              type="button"
              onClick={onClick}
              className="flex flex-col items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-violet-200 hover:bg-violet-50"
            >
              <span className="rounded-full bg-white p-2 text-violet-600 shadow-sm">
                <Icon className="size-5" />
              </span>
              <span className="text-base font-semibold text-slate-800">{label}</span>
              <span className="text-sm text-slate-500">{description}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800">📌 Actividades recientes</h3>
          <ul className="mt-4 space-y-3 text-sm">
            {loading && <li className="text-slate-500">Cargando…</li>}
            {!loading && recentActivities.length === 0 && <li className="text-slate-500">No hay actividades registradas.</li>}
            {recentActivities.map((activity) => (
              <li key={activity.id} className="flex items-center justify-between">
                <span className="font-medium text-slate-700">{activity.title}</span>
                <span className="text-xs font-semibold text-violet-600">
                  {new Date(activity.start).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800">📣 Campañas recientes</h3>
          <ul className="mt-4 space-y-3 text-sm">
            {loading && <li className="text-slate-500">Cargando…</li>}
            {!loading && campaigns.length === 0 && <li className="text-slate-500">No hay campañas activas.</li>}
            {campaigns.map((campaign) => (
              <li key={campaign.id} className="flex items-center justify-between">
                <span className="font-medium text-slate-700">{campaign.name}</span>
                <span className="text-xs font-semibold text-slate-500">{campaign.status}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800">📈 Indicadores clave</h3>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3 text-sm">
          {weeklyMetrics.map(({ label, value, tone }) => (
            <li key={label} className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
              <p className="text-xs text-slate-500">{label}</p>
              <p className={`mt-2 text-xl font-semibold ${tone}`}>{value}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
