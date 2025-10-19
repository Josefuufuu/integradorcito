// src/pages/HomeBeneficiary.jsx
import PropTypes from "prop-types";

import AppLayout from "../components/layout/AppLayout.jsx";
import Button from "../components/ui/Button.jsx";
import StatCard from "../components/ui/StatCard.jsx";
import ActivityCard from "../components/ActivityCard.jsx";
import SectionHeader from "../components/ui/SectionHeader.jsx";

// Datos mock para arrancar (luego los reemplazas por los del backend)
const defaultStats = [
  { id: "upcoming",     title: "Próximas actividades", value: 3, cta: "Ver calendario",    tone: "indigo" },
  { id: "enrollments",  title: "Inscripciones activas", value: 1, cta: "Ver inscripciones", tone: "orange" },
  { id: "appointments", title: "Citas próximas",        value: 2, cta: "Gestionar citas",   tone: "green" },
  { id: "favorites",    title: "Favoritos",             value: 5, cta: "Ver favoritos",     tone: "purple" },
];

const defaultHighlights = [
  { id: 1, title: "Yoga matutino",   tags: ["Bienestar", "Grupal"], place: "Casa de muñecas", when: "Lun–Vie, 7:00 A.M.", rating: 4.8, quota: "12 / 15" },
  { id: 2, title: "Taller de pintura", tags: ["Arte", "Grupal"],   place: "Salón 203 I",      when: "Lun–Mar, 11:00 A.M.", rating: 4.0, quota: "24 / 30" },
  { id: 3, title: "Música & Ritmo",  tags: ["Música", "Grupal"],   place: "Sala Audiovisual", when: "Jue, 5:00 P.M.",      rating: 4.6, quota: "18 / 20" },
];

export default function HomeBeneficiary({
  userName = "Pablo",
  stats = defaultStats,
  highlights = defaultHighlights,
  onViewCalendar,
  onViewEnrollments,
  onManageAppointments,
  onViewFavorites,
  onViewAllActivities,
  onEnroll,
}) {
  const kpiHandlers = {
    upcoming: onViewCalendar,
    enrollments: onViewEnrollments,
    appointments: onManageAppointments,
    favorites: onViewFavorites,
  };

  return (
    <AppLayout>
      {/* Hero */}
      <section className="rounded-2xl p-6 text-white bg-indigo-600 mb-6">
        <h1 className="text-2xl font-semibold mb-1">¡Hola, {userName}!</h1>
        <p className="opacity-90">
          Explora actividades del Centro Artístico y Deportivo (CADI), inscríbete a eventos y gestiona tu bienestar.
        </p>
        <div className="mt-4">
          <Button onClick={onViewCalendar}>Ver calendario</Button>
        </div>
      </section>

      {/* KPIs */}
      <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-4 mb-6">
        {stats.map((s) => (
          <StatCard
            key={s.id}
            title={s.title}
            value={s.value}
            cta={s.cta}
            tone={s.tone}             // asegúrate que StatCard soporte este prop
            onClick={() => kpiHandlers[s.id]?.()}
          />
        ))}
      </div>

      {/* Encabezado de sección */}
      <SectionHeader title="Actividades destacadas" onViewAll={onViewAllActivities} />

      {/* Cards de actividades */}
      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4">
        {highlights.map((a) => (
          <ActivityCard
            key={a.id}
            title={a.title}
            tags={a.tags}            // Tag.jsx se usa dentro de ActivityCard
            place={a.place}
            when={a.when}
            rating={a.rating}
            quota={a.quota}
            onEnroll={() => onEnroll?.(a)}
          />
        ))}
      </div>
    </AppLayout>
  );
}

HomeBeneficiary.propTypes = {
  userName: PropTypes.string,
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      cta: PropTypes.string,
      tone: PropTypes.string, // ajusta si usas un enum en tu StatCard
    })
  ),
  highlights: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      tags: PropTypes.arrayOf(PropTypes.string),
      place: PropTypes.string,
      when: PropTypes.string,
      rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      quota: PropTypes.string,
    })
  ),
  onViewCalendar: PropTypes.func,
  onViewEnrollments: PropTypes.func,
  onManageAppointments: PropTypes.func,
  onViewFavorites: PropTypes.func,
  onViewAllActivities: PropTypes.func,
  onEnroll: PropTypes.func,
};
