import AppLayout from "../components/Layout/AppLayout.jsx";

export default function PsuVoluntariadosPage() {
  return (
    <AppLayout>
      <section className="rounded-2xl bg-white shadow p-6">
        <h1 className="text-2xl font-semibold mb-4">PSU y Voluntariados</h1>
        <p className="text-gray-600">
          Encuentra oportunidades para participar en programas de promoción de la salud
          universitaria y voluntariados que impactan positivamente a la comunidad.
        </p>
      </section>
    </AppLayout>
  );
}
