import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";

import Button from "../components/ui/Button.jsx";
import { createActivity, listActivities } from "../services/activities.js";

const INITIAL_FORM = {
  title: "",
  category: "",
  date: "",
  location: "",
  start_time: "",
  end_time: "",
  capacity: "",
  description: "",
  image_url: "",
};

const CATEGORY_OPTIONS = [
  { value: "DEPORTE", label: "Deporte" },
  { value: "CULTURA", label: "Cultura" },
  { value: "SALUD", label: "Salud / PSU" },
  { value: "VOLUNTARIADO", label: "Voluntariado" },
];

export default function CreateActivity() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [imagePreview, setImagePreview] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const formRef = useRef(null);

  useEffect(() => {
    listActivities()
      .then((data) => setActivities(data ?? []))
      .catch((err) => {
        console.error("Error al cargar actividades", err);
      });
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const start = new Date(`${form.date}T${form.start_time}`);
      const end = new Date(`${form.date}T${form.end_time}`);
      const payload = {
        title: form.title,
        category: form.category,
        description: form.description,
        location: form.location,
        capacity: Number(form.capacity),
        start: start.toISOString(),
        end: end.toISOString(),
        image_url: form.image_url || undefined,
      };

      const created = await createActivity(payload);
      setActivities((prev) => [created, ...prev]);
      setForm(INITIAL_FORM);
      setImagePreview(null);
      if (formRef.current) {
        formRef.current.reset();
      }
    } catch (err) {
      setError(err.message ?? "No se pudo crear la actividad");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-800">Crear nueva actividad</h1>
        <p className="mt-2 text-sm text-slate-500">
          Completa los detalles de la programación del CADI. Las actividades creadas se publicarán automáticamente
          en el portal estudiantil.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.3fr,1fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <form ref={formRef} onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700">Título</span>
              <input
                required
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Ej. Clase de yoga al amanecer"
                className="rounded-xl border border-slate-300 px-3 py-2 focus:border-violet-500 focus:outline-none"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700">Categoría</span>
              <select
                required
                name="category"
                value={form.category}
                onChange={handleChange}
                className="rounded-xl border border-slate-300 px-3 py-2 focus:border-violet-500 focus:outline-none"
              >
                <option value="">Selecciona…</option>
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700">Fecha</span>
              <input
                required
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="rounded-xl border border-slate-300 px-3 py-2 focus:border-violet-500 focus:outline-none"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700">Lugar</span>
              <input
                required
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Ej. Coliseo / Salón 302-C"
                className="rounded-xl border border-slate-300 px-3 py-2 focus:border-violet-500 focus:outline-none"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700">Hora de inicio</span>
              <input
                required
                type="time"
                name="start_time"
                value={form.start_time}
                onChange={handleChange}
                className="rounded-xl border border-slate-300 px-3 py-2 focus:border-violet-500 focus:outline-none"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700">Hora de fin</span>
              <input
                required
                type="time"
                name="end_time"
                value={form.end_time}
                onChange={handleChange}
                className="rounded-xl border border-slate-300 px-3 py-2 focus:border-violet-500 focus:outline-none"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700">Cupos</span>
              <input
                required
                type="number"
                name="capacity"
                min="1"
                value={form.capacity}
                onChange={handleChange}
                className="rounded-xl border border-slate-300 px-3 py-2 focus:border-violet-500 focus:outline-none"
              />
            </label>

            <label className="grid gap-2 md:col-span-2">
              <span className="text-sm font-medium text-slate-700">Descripción</span>
              <textarea
                required
                name="description"
                rows={4}
                value={form.description}
                onChange={handleChange}
                placeholder="Detalles, requisitos, materiales…"
                className="rounded-xl border border-slate-300 px-3 py-2 focus:border-violet-500 focus:outline-none"
              />
            </label>

            <label className="grid gap-2 md:col-span-2">
              <span className="text-sm font-medium text-slate-700">Imagen de portada (URL)</span>
              <input
                name="image_url"
                value={form.image_url}
                onChange={handleChange}
                placeholder="https://…"
                className="rounded-xl border border-slate-300 px-3 py-2 focus:border-violet-500 focus:outline-none"
              />
            </label>

            {error && (
              <div className="md:col-span-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}

            <div className="md:col-span-2 flex items-center justify-end gap-3">
              <Button type="button" onClick={() => { setForm(INITIAL_FORM); setImagePreview(null); formRef.current?.reset(); }}>
                Limpiar
              </Button>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? "Guardando…" : "Crear actividad"}
              </Button>
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800">Vista previa</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Título</p>
              <p className="mt-1 text-lg font-semibold text-slate-800">{form.title || "(Título)"}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p>📍 {form.location || "(Lugar)"}</p>
              <p>🗓️ {form.date || "(Fecha)"}</p>
              <p>⏰ {form.start_time || "--:--"} - {form.end_time || "--:--"}</p>
            </div>
            {form.description && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="whitespace-pre-line">{form.description}</p>
              </div>
            )}
            {imagePreview && (
              <img src={imagePreview} alt="Vista previa" className="w-full rounded-xl object-cover" />
            )}
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">Actividades programadas</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="px-4 py-2">Actividad</th>
                <th className="px-4 py-2">Fecha</th>
                <th className="px-4 py-2">Lugar</th>
                <th className="px-4 py-2">Cupos</th>
              </tr>
            </thead>
            <tbody>
              {activities.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-slate-500">
                    No hay actividades registradas.
                  </td>
                </tr>
              )}
              {activities.map((activity) => (
                <tr key={activity.id} className="border-t">
                  <td className="px-4 py-3 font-medium text-slate-700">{activity.title}</td>
                  <td className="px-4 py-3 text-slate-500">{format(new Date(activity.start), "dd/MM/yyyy HH:mm")}</td>
                  <td className="px-4 py-3 text-slate-500">{activity.location}</td>
                  <td className="px-4 py-3 text-slate-500">{activity.seats_taken}/{activity.capacity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}