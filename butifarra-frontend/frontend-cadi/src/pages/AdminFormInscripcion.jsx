import { useCallback, useEffect, useMemo, useState } from "react";

import Button from "../components/ui/Button.jsx";
import { crearInscripcion, listarInscripciones, listarProyectosActivos } from "../services/psu.js";

const INITIAL_FORM = {
  nombre: "",
  correo: "",
  telefono: "",
  proyecto: "",
};

const formatDateTime = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export default function AdminFormInscripcion() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [projects, setProjects] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const loadProjects = useCallback(async () => {
    const data = await listarProyectosActivos();
    setProjects(data ?? []);
  }, []);

  const loadRegistrations = useCallback(async () => {
    const data = await listarInscripciones();
    setRegistrations(data ?? []);
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        await Promise.all([loadProjects(), loadRegistrations()]);
      } catch (err) {
        setFeedback({ type: "error", message: err.message || "No se pudo cargar la información." });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [loadProjects, loadRegistrations]);

  const handleManualRefresh = async () => {
    setFeedback(null);
    setLoading(true);
    try {
      await Promise.all([loadProjects(), loadRegistrations()]);
    } catch (err) {
      setFeedback({ type: "error", message: err.message || "No se pudo cargar la información." });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const selectedProject = useMemo(
    () => projects.find((project) => String(project.id) === String(form.proyecto)),
    [projects, form.proyecto],
  );

  const availableSlots = useMemo(() => {
    if (!selectedProject) return null;
    const total = Number(selectedProject.total_slots ?? 0);
    const confirmed = Number(selectedProject.inscripciones_confirmadas ?? selectedProject.confirmed_slots ?? 0);
    return Math.max(total - confirmed, 0);
  }, [selectedProject]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback(null);

    if (!form.nombre.trim()) {
      setFeedback({ type: "error", message: "Ingresa el nombre completo." });
      return;
    }
    if (!form.correo.includes("@")) {
      setFeedback({ type: "error", message: "Ingresa un correo electrónico válido." });
      return;
    }
    if (!form.proyecto) {
      setFeedback({ type: "error", message: "Selecciona un proyecto activo." });
      return;
    }

    setSaving(true);
    try {
      await crearInscripcion({
        project: Number(form.proyecto),
        full_name: form.nombre.trim(),
        email: form.correo.trim(),
        phone: form.telefono.trim(),
      });
      setFeedback({ type: "success", message: "Inscripción registrada correctamente." });
      setForm(INITIAL_FORM);
      await Promise.all([loadRegistrations(), loadProjects()]);
    } catch (err) {
      setFeedback({ type: "error", message: err.message || "No se pudo registrar la inscripción." });
    } finally {
      setSaving(false);
    }
  };

  const projectOptions = projects.map((project) => ({
    id: project.id,
    label: project.nombre ?? project.name,
    state: project.state ?? project.estado,
    available: Math.max(
      Number(project.total_slots ?? 0) - Number(project.inscripciones_confirmadas ?? project.confirmed_slots ?? 0),
      0,
    ),
  }));

  const registrationRows = registrations.map((registration) => {
    const project = projectOptions.find((option) => option.id === registration.project);
    return {
      ...registration,
      projectName: project?.label ?? `Proyecto #${registration.project}`,
    };
  });

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-800">Registro manual de participantes</h1>
        <p className="mt-2 text-sm text-slate-500">
          Gestiona inscripciones en proyectos PSU y voluntariados directamente desde el panel administrativo. Los registros se
          sincronizan con la base de datos local del backend.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr),1.2fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Nueva inscripción</h2>
              <p className="mt-1 text-sm text-slate-500">Completa los datos de la persona para asociarla a un proyecto activo.</p>
            </div>
            <span className="text-3xl" role="img" aria-label="Formulario">📝</span>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-slate-600">
              Nombre completo
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Laura Ríos"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200"
                required
              />
            </label>

            <label className="block text-sm font-medium text-slate-600">
              Correo electrónico
              <input
                type="email"
                name="correo"
                value={form.correo}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200"
                required
              />
            </label>

            <label className="block text-sm font-medium text-slate-600">
              Teléfono de contacto
              <input
                type="tel"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                placeholder="+57 320 000 0000"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200"
              />
            </label>

            <label className="block text-sm font-medium text-slate-600">
              Proyecto activo
              <select
                name="proyecto"
                value={form.proyecto}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200"
                required
              >
                <option value="">Selecciona un proyecto…</option>
                {projectOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label} • {option.available} cupos disponibles
                  </option>
                ))}
              </select>
            </label>

            {selectedProject && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                <p className="font-semibold text-slate-700">{selectedProject.nombre ?? selectedProject.name}</p>
                <p className="mt-1">Estado: {selectedProject.state ?? selectedProject.estado}</p>
                <p className="mt-1">Cupos disponibles: {availableSlots}</p>
              </div>
            )}

            {feedback && (
              <div
                className={`rounded-xl border px-4 py-3 text-sm ${
                  feedback.type === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-rose-200 bg-rose-50 text-rose-700"
                }`}
              >
                {feedback.message}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                onClick={() => {
                  setForm(INITIAL_FORM);
                  setFeedback(null);
                }}
              >
                Limpiar
              </Button>
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? "Registrando…" : "Registrar inscripción"}
              </Button>
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Inscripciones registradas</h2>
              <p className="mt-1 text-sm text-slate-500">
                {loading ? "Consultando inscripciones…" : `${registrations.length} registros sincronizados`}
              </p>
            </div>
            <Button type="button" onClick={handleManualRefresh} disabled={loading}>
              Actualizar
            </Button>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  <th className="px-4 py-2">Participante</th>
                  <th className="px-4 py-2">Correo</th>
                  <th className="px-4 py-2">Proyecto</th>
                  <th className="px-4 py-2">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {registrationRows.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-slate-500">
                      Aún no hay inscripciones registradas desde la administración.
                    </td>
                  </tr>
                )}
                {registrationRows.map((registration) => (
                  <tr key={registration.id} className="border-t">
                    <td className="px-4 py-3 font-medium text-slate-700">{registration.full_name}</td>
                    <td className="px-4 py-3 text-slate-500">{registration.email}</td>
                    <td className="px-4 py-3 text-slate-500">{registration.projectName}</td>
                    <td className="px-4 py-3 text-slate-500">{formatDateTime(registration.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
