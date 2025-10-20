import { useEffect, useState } from "react";
import { format } from "date-fns";

import { listActivities } from "../services/activities.js";

export default function GestionCadiPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listActivities()
      .then((data) => setActivities(data ?? []))
      .catch((err) => console.error("No se pudo cargar la programación", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-800">Actividades CADI</h1>
        <p className="mt-2 text-sm text-slate-500">
          Explora las actividades disponibles del Centro Artístico y Deportivo Icesi. Gestiona tus inscripciones y mantente al día
          con la programación semanal.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loading && (
          <div className="col-span-full rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
            Cargando actividades…
          </div>
        )}

        {!loading && activities.length === 0 && (
          <div className="col-span-full rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
            No hay actividades disponibles por el momento.
          </div>
        )}

        {activities.map((activity) => (
          <article key={activity.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">{activity.category}</p>
            <h2 className="mt-2 text-lg font-semibold text-slate-800">{activity.title}</h2>
            <p className="mt-2 text-sm text-slate-500">{activity.description}</p>
            <div className="mt-4 space-y-1 text-sm text-slate-600">
              <p>📍 {activity.location}</p>
              <p>🗓️ {format(new Date(activity.start), "dd/MM/yyyy HH:mm")}</p>
              <p>👥 Cupos: {activity.seats_taken}/{activity.capacity}</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
