// src/pages/PsuVoluntariadosPage.jsx
import { useEffect, useState } from "react";

import Modal from "../components/ui/Modal.jsx";
import InscripcionFormCard from "../components/Inscripcion/InscripcionFormCard.jsx";
import { listarProyectosActivos } from "../services/psu.js";

export default function PsuVoluntariadosPage() {
  const [loading, setLoading] = useState(true);
  const [proyectos, setProyectos] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  const cargar = async () => {
    setLoading(true);
    try {
      const data = await listarProyectosActivos();
      setProyectos(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const cuposDisponibles = (proyecto) =>
    Math.max((proyecto.total_slots ?? 0) - (proyecto.inscripciones_confirmadas ?? 0), 0);

  return (
    <div className="space-y-6">
      <section className="mb-6 rounded-2xl bg-white p-6 shadow">
        <h1 className="mb-1 text-2xl font-semibold">PSU y Voluntariados</h1>
        <p className="text-gray-600">
          Gestiona programas de servicio social y voluntariados. Inscríbete en los proyectos activos.
        </p>
      </section>

      <section className="overflow-hidden rounded-2xl border bg-white">
        <div className="border-b px-5 py-4">
          <h2 className="font-medium">Proyectos activos</h2>
          <p className="text-sm text-gray-500">
            {loading ? "Cargando…" : `${proyectos.length} proyectos registrados`}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-5 py-3 text-left">Programa</th>
                <th className="px-5 py-3 text-left">Tipo</th>
                <th className="px-5 py-3 text-left">Cupos</th>
                <th className="px-5 py-3 text-left">Periodo</th>
                <th className="px-5 py-3 text-left">Estado</th>
                <th className="px-5 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td className="px-5 py-6 text-center text-gray-500" colSpan={6}>
                    Cargando…
                  </td>
                </tr>
              )}

              {!loading && proyectos.length === 0 && (
                <tr>
                  <td className="px-5 py-6 text-center text-gray-500" colSpan={6}>
                    No hay proyectos activos.
                  </td>
                </tr>
              )}

              {!loading &&
                proyectos.map((proyecto) => {
                  const disponibles = cuposDisponibles(proyecto);
                  const sinCupo = disponibles <= 0;
                  const inscrito = proyecto.yaInscrito === true;

                  return (
                    <tr key={proyecto.id} className="border-t">
                      <td className="px-5 py-4">
                        <div className="font-medium">{proyecto.nombre}</div>
                        <div className="text-gray-500">{proyecto.area ?? proyecto.subtipo ?? ""}</div>
                      </td>
                      <td className="px-5 py-4">{proyecto.tipo ?? "Voluntariado"}</td>
                      <td className="px-5 py-4">{disponibles}/{proyecto.total_slots ?? "-"}</td>
                      <td className="px-5 py-4">
                        {proyecto.inicio && proyecto.fin ? `${proyecto.inicio} a ${proyecto.fin}` : "—"}
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs text-emerald-700">
                          Inscripción
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          disabled={sinCupo || inscrito}
                          onClick={() => {
                            setSeleccionado({ id: proyecto.id, nombre: proyecto.nombre, cupos_disponibles: disponibles });
                            setModalAbierto(true);
                          }}
                          className={`rounded-xl px-3 py-2 text-sm text-white ${
                            sinCupo || inscrito ? "bg-indigo-300" : "bg-indigo-600 hover:bg-indigo-700"
                          }`}
                        >
                          {inscrito ? "Inscrito" : "Inscribirme"}
                        </button>
                        {sinCupo && <div className="mt-1 text-xs text-rose-600">Sin cupo</div>}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </section>

      <Modal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        title="Formulario de inscripción"
      >
        {seleccionado && (
          <InscripcionFormCard
            proyecto={seleccionado}
            onSuccess={() => {
              setModalAbierto(false);
              cargar();
            }}
          />
        )}
      </Modal>
    </div>
  );
}
