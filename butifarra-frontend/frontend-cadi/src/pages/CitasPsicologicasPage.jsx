import { useEffect, useState } from "react";
import { format } from "date-fns";

import Button from "../components/ui/Button.jsx";
import { listSessions } from "../services/sessions.js";

export default function CitasPsicologicasPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listSessions({ upcoming: true })
      .then((data) => setSessions(data ?? []))
      .catch((err) => console.error("No se pudo cargar las citas", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-800">Citas psicológicas</h1>
        <p className="mt-2 text-sm text-slate-500">
          Agenda y gestiona tus acompañamientos psicológicos. Conoce la disponibilidad del equipo profesional y mantente atento a tus
          próximas sesiones.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loading && (
          <div className="col-span-full rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
            Consultando disponibilidad…
          </div>
        )}

        {!loading && sessions.length === 0 && (
          <div className="col-span-full rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
            No hay citas disponibles en este momento.
          </div>
        )}

        {sessions.map((session) => (
          <article key={session.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">{session.modality}</p>
            <h2 className="mt-2 text-lg font-semibold text-slate-800">{session.title}</h2>
            <p className="mt-1 text-sm text-slate-500">{session.counselor}</p>
            <p className="mt-3 text-sm text-slate-600">{format(new Date(session.start), "dd/MM/yyyy HH:mm")}</p>
            <p className="mt-2 text-sm text-slate-600">Disponibles: {session.available_slots}</p>
            <Button variant="primary" className="mt-4">Solicitar cupo</Button>
          </article>
        ))}
      </section>
    </div>
  );
}
