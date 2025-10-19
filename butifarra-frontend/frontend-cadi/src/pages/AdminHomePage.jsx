import React from "react";
import { Link } from "react-router-dom";
import { Sidebar } from "../components/Sidebar/Sidebar";
import { TopBar } from "../components/Dashboard/TopBar";
import { Users, ClipboardList, BarChart3, Activity } from "lucide-react";

export default function AdminHomePage() {
  return (
    <main
      style={{ display: "grid", gridTemplateColumns: "230px 1fr" }}
      className="h-screen w-screen overflow-x-hidden"
    >
      <Sidebar />
      <div className="h-full overflow-y-auto bg-stone-50">
        <TopBar />
        <section role="main" className="p-6 md:p-8 space-y-8">
          {/* Encabezado */}
          <header className="space-y-1">
            <h1 className="text-2xl font-bold text-gray-900">Panel del Administrador</h1>
            <p className="text-sm text-gray-500">
              Vista general del sistema de Bienestar Universitario
            </p>
          </header>

          {/* KPIs */}
          <section
            aria-label="Indicadores clave"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <KpiCard
              title="Asistencia hoy"
              value="324"
              change="+12%"
              changeTone="pos"
              icon={<Users size={20} aria-hidden="true" />}
              data-testid="kpi-asistencia"
            />
            <KpiCard
              title="Inscripciones abiertas"
              value="1,245"
              change="+6%"
              changeTone="pos"
              icon={<ClipboardList size={20} aria-hidden="true" />}
              data-testid="kpi-inscripciones"
            />
            <KpiCard
              title="Ocupación"
              value="85%"
              change="-2%"
              changeTone="neg"
              icon={<BarChart3 size={20} aria-hidden="true" />}
              data-testid="kpi-ocupacion"
            />
            <KpiCard
              title="Incidencias"
              value="3"
              change="+1"
              changeTone="neg"
              icon={<Activity size={20} aria-hidden="true" />}
              data-testid="kpi-incidencias"
            />
          </section>

          {/* Acciones rápidas */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Acciones rápidas</h2>
              <p className="text-sm text-gray-500">Crea y comunica más rápido</p>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <QuickAction to="/actividades/crear" title="Crear actividad" sub="Nueva actividad CADI" />
              <QuickAction to="/torneos" title="Publicar torneo" sub="Abrir inscripciones" />
              <QuickAction to="/notificaciones" title="Enviar notificación" sub="Comunicado masivo" />
            </div>
          </section>

          {/* Doble columna: actividad y métricas */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CardBox title="Actividades recientes">
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span>Yoga mañana (Coliseo)</span>
                  <span className="text-gray-600">15 participantes</span>
                </li>
                <li className="flex justify-between">
                  <span>Torneo fútbol 5 (Grupo B)</span>
                  <span className="text-gray-600">8 inscritos</span>
                </li>
                <li className="flex justify-between">
                  <span>Taller guitarra básica</span>
                  <span className="text-gray-600">20 cupos</span>
                </li>
              </ul>
            </CardBox>

            <CardBox title="Métricas de la semana">
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span>Nuevos usuarios</span>
                  <Badge tone="pos">+23%</Badge>
                </li>
                <li className="flex justify-between">
                  <span>Actividades completadas</span>
                  <Badge tone="pos">+18%</Badge>
                </li>
                <li className="flex justify-between">
                  <span>Cancelaciones</span>
                  <Badge tone="neg">+4%</Badge>
                </li>
                <li className="flex justify-between">
                  <span>Satisfacción promedio</span>
                  <span className="text-gray-800 font-medium">4.6/5</span>
                </li>
              </ul>
            </CardBox>
          </section>
        </section>
      </div>
    </main>
  );
}

/* ---------------- UI helpers ---------------- */

function KpiCard({ title, value, change, changeTone, icon, ...rest }) {
  const tone =
    changeTone === "neg"
      ? "text-red-700 bg-red-50"
      : "text-emerald-700 bg-emerald-50";

  return (
    <div
      {...rest}
      className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex items-start justify-between"
    >
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold text-gray-900">{value}</span>
          <span className={`text-xs px-2 py-0.5 rounded ${tone}`}>{change}</span>
        </div>
      </div>
      <div className="text-indigo-600">{icon}</div>
    </div>
  );
}

function QuickAction({ to, title, sub }) {
  return (
    <Link
      to={to}
      className="p-4 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition text-left block"
    >
      <p className="font-medium text-gray-900">{title}</p>
      <p className="text-sm text-gray-500">{sub}</p>
    </Link>
  );
}

function CardBox({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-base font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  );
}

function Badge({ tone = "pos", children }) {
  const cls =
    tone === "neg"
      ? "bg-red-50 text-red-700"
      : "bg-emerald-50 text-emerald-700";
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded ${cls}`}>
      {children}
    </span>
  );
}