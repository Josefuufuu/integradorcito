import AppLayout from "../components/layout/AppLayout.jsx";
import { useRole } from "../components/sidebar/RoleContext.jsx";

export default function ReportesPage() {
  const role = useRole();

  return (
    <AppLayout>
      <section className="rounded-2xl bg-white shadow p-6">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h1 className="text-2xl font-semibold">Reportes</h1>
          {role === "Administrador" && (
            <button className="btn-primary" type="button">
              Exportar
            </button>
          )}
        </div>
        <p className="text-gray-600">
          Visualiza indicadores clave y reportes de participación para hacer seguimiento al
          impacto de los programas de bienestar universitario.
        </p>
        {role !== "Administrador" && (
          <p
            className="mt-4 text-sm text-gray-400 italic"
            title="Disponible solo para administradores"
          >
            La exportación de reportes está disponible únicamente para administradores.
          </p>
        )}
      </section>
    </AppLayout>
  );
}
