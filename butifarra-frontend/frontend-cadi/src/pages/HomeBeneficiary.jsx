
// src/pages/HomeBeneficiary.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

import Button from "../components/ui/Button.jsx";
import StatCard from "../components/ui/StatCard.jsx";
import ActivityCard from "../components/ActivityCard.jsx";
import SectionHeader from "../components/ui/SectionHeader.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { fetchBeneficiaryHome } from "../services/dashboard.js";

const DEFAULT_STATS = {
  upcoming: 0,
  enrollments: 0,
  appointments: 0,
  favorites: 0,
};

export default function HomeBeneficiary() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [activities, setActivities] = useState([]);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchBeneficiaryHome();
        if (!active) return;
        setStats({ ...DEFAULT_STATS, ...data.stats });
        setActivities(data.highlights ?? []);
        setSessions(data.sessions ?? []);
      } catch (err) {
        console.error("No se pudo cargar el panel", err);
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
  }, []);

  const statCards = useMemo(() => [
    {
      id: "upcoming",
      title: "Próximas actividades",
      value: stats.upcoming,
      cta: "Ver calendario",
      tone: "indigo",
      onClick: () => navigate("/actividades"),
    },
    {
      id: "enrollments",
      title: "Inscripciones activas",
      value: stats.enrollments,
      cta: "Mis inscripciones",
      tone: "orange",
      onClick: () => navigate("/actividades"),
    },
    {
      id: "appointments",
      title: "Citas disponibles",
      value: stats.appointments,
      cta: "Gestionar citas",
      tone: "green",
      onClick: () => navigate("/citas"),
    },
    {
      id: "favorites",
      title: "Favoritos",
      value: stats.favorites,
      cta: "Explorar",
      tone: "purple",
      onClick: () => navigate("/actividades"),
    },
  ], [stats, navigate]);

  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-indigo-600 p-6 text-white shadow-md">
        <p className="text-xs uppercase tracking-wide opacity-80">Bienestar universitario</p>
        <h1 className="mt-2 text-2xl font-semibold">{user?.first_name ? `¡Hola, ${user.first_name}!` : "Bienvenido"}</h1>
        <p className="mt-2 max-w-2xl text-sm opacity-90">
          Explora actividades del Centro Artístico y Deportivo (CADI), inscríbete a eventos y gestiona tu bienestar integral.
        </p>
        <div className="mt-4">
          <Button variant="primary" onClick={() => navigate("/actividades")}>Ver actividades disponibles</Button>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <StatCard
            key={card.id}
            title={card.title}
            value={card.value}
            cta={card.cta}
            tone={card.tone}
            onClick={card.onClick}
          />
        ))}
      </div>

      <SectionHeader
        title="Actividades destacadas"
        subtitle="Programación de la semana"
        onViewAll={() => navigate("/actividades")}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {!loading && activities.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
            Aún no hay actividades programadas. Vuelve pronto.
          </div>
        )}

        {activities.map((activity) => (
          <ActivityCard
            key={activity.id}
            title={activity.title}
            tags={[activity.category]}
            place={activity.location}
            when={format(new Date(activity.start), "dd MMM, HH:mm")}
            rating={activity.available_seats > 0 ? "Cupos disponibles" : "Sin cupos"}
            quota={`${activity.available_seats}/${activity.capacity}`}
            onEnroll={() => navigate("/actividades", { state: { focus: activity.id } })}
          />
        ))}
      </div>

      <SectionHeader
        title="Acompañamiento psicológico"
        subtitle="Próximos espacios disponibles"
        onViewAll={() => navigate("/citas")}
      />

      <div className="grid gap-4 md:grid-cols-3">
        {sessions.length === 0 && (
          <div className="col-span-full rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
            No hay citas disponibles en este momento.
          </div>
        )}
        {sessions.map((session) => (
          <div key={session.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-violet-600">{session.counselor}</p>
            <h3 className="mt-2 text-lg font-semibold text-slate-800">{session.title}</h3>
            <p className="mt-2 text-sm text-slate-500">
              {format(new Date(session.start), "eeee d 'de' MMMM - HH:mm")}
            </p>
            <p className="mt-2 text-sm text-slate-500">{session.available_slots} cupos disponibles</p>
            <Button variant="primary" className="mt-4" onClick={() => navigate("/citas")}>Agendar</Button>
          </div>
        ))}
      </div>
    </div>
  );
}