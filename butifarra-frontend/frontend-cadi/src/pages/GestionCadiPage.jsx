import AppLayout from "../components/layout/AppLayout.jsx";

export default function GestionCadiPage() {
  return (
    <AppLayout>
      <section className="rounded-2xl bg-white shadow p-6">
        <h1 className="text-2xl font-semibold mb-4">Gestión CADI</h1>
        <p className="text-gray-600">
          Explora y administra las actividades disponibles del Centro Artístico y Deportivo
          Icesi. Próximamente podrás revisar información detallada de cada actividad y
          gestionar tus inscripciones desde esta vista.
        </p>
      </section>
    </AppLayout>
  );
}
