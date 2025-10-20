import { useMemo } from "react";

import { useTorneos } from "../hooks/useTorneos.js";

export default function TorneosPage() {
  const { torneos, loading, error } = useTorneos();

  const grouped = useMemo(() => {
    return torneos.reduce((acc, torneo) => {
      const sport = torneo.sport || "Otros";
      acc[sport] = acc[sport] || [];
      acc[sport].push(torneo);
      return acc;
    }, {});
  }, [torneos]);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-800">Torneos CADI</h1>
        <p className="mt-2 text-sm text-slate-500">
          Consulta la programación de torneos deportivos y culturales, sigue tus equipos favoritos y mantente al tanto de los
          resultados más recientes.
        </p>
      </section>

      {loading && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
          Cargando torneos…
        </section>
      )}

      {error && (
        <section className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
          Ocurrió un error al cargar los torneos. Intenta nuevamente.
        </section>
      )}

      {!loading && !error && Object.keys(grouped).length === 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
          No hay torneos registrados por ahora.
        </section>
      )}

      {!loading && !error && Object.entries(grouped).map(([sport, tournaments]) => (
        <section key={sport} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">{sport}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {tournaments.map((torneo) => (
              <article key={torneo.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-base font-semibold text-slate-800">{torneo.name}</h3>
                <p className="mt-1 text-sm text-slate-500">{torneo.format}</p>
                <p className="mt-2 text-sm text-slate-600">{torneo.startDate} - {torneo.endDate}</p>
                <p className="mt-2 text-sm text-slate-600">Equipos: {torneo.currentTeams}/{torneo.maxTeams}</p>
                <p className="mt-2 text-xs uppercase tracking-wide text-slate-400">{torneo.phase}</p>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
