import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Suspense } from "react";
import PropTypes from "prop-types";

import { useAuth } from "./context/AuthContext.jsx";
import { ADMIN_ROLES, Roles } from "./constants/roles.js";

import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import HomeBeneficiary from "./pages/HomeBeneficiary.jsx";
import GestionCadiPage from "./pages/GestionCadiPage.jsx";
import TorneosPage from "./pages/TorneosPage.jsx";
import PsuVoluntariadosPage from "./pages/PsuVoluntariadosPage.jsx";
import CitasPsicologicasPage from "./pages/CitasPsicologicasPage.jsx";
import AdminHomePage from "./pages/AdminHomePage.jsx";
import CreateActivity from "./pages/CreateActivity.jsx";
import AdminTorneosPage from "./pages/AdminTorneosPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import ReportesPage from "./pages/ReportesPage.jsx";
import AdminFormInscripcion from "./pages/AdminFormInscripcion.jsx";

import AppLayout from "./components/layout/AppLayout.jsx";

function LoadingScreen() {
  return (
    <div className="flex h-screen items-center justify-center text-gray-600">
      Cargando sesión...
    </div>
  );
}

function NotFound() {
  return (
    <div className="flex h-full flex-1 items-center justify-center p-12 text-center text-gray-600">
      <div>
        <h1 className="text-3xl font-semibold text-gray-800">404</h1>
        <p className="mt-2">La ruta solicitada no existe.</p>
      </div>
    </div>
  );
}

function ProtectedLayout({ allowedRoles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const fallback = user.role === Roles.BENEFICIARY ? "/inicio" : "/admin/inicio";
    return <Navigate to={fallback} replace />;
  }

  return (
    <AppLayout />
  );
}

ProtectedLayout.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
};

function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (user) {
    return <Navigate to={user.role === Roles.BENEFICIARY ? "/inicio" : "/admin/inicio"} replace />;
  }

  return children;
}

PublicOnlyRoute.propTypes = {
  children: PropTypes.node,
};

function ProtectedRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedLayout />}>
        <Route path="/inicio" element={<HomeBeneficiary />} />
        <Route path="/actividades" element={<GestionCadiPage />} />
        <Route path="/torneos" element={<TorneosPage />} />
        <Route path="/psu" element={<PsuVoluntariadosPage />} />
        <Route path="/citas" element={<CitasPsicologicasPage />} />
      </Route>

      <Route element={<ProtectedLayout allowedRoles={ADMIN_ROLES} />}>
        <Route path="/admin" element={<Navigate to="/admin/inicio" replace />} />
        <Route path="/admin/inicio" element={<AdminHomePage />} />
        <Route path="/admin/actividades" element={<CreateActivity />} />
        <Route path="/admin/torneos" element={<AdminTorneosPage />} />
        <Route path="/admin/notificaciones" element={<NotificationsPage />} />
        <Route path="/admin/reportes" element={<ReportesPage />} />
        <Route path="/admin/usuarios" element={<AdminFormInscripcion />} />
      </Route>

      <Route element={<ProtectedLayout />}>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={(
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          )}
        />
        <Route
          path="/registro"
          element={(
            <PublicOnlyRoute>
              <SignupPage />
            </PublicOnlyRoute>
          )}
        />
        <Route path="/" element={<Navigate to="/inicio" replace />} />
      </Routes>

      <Suspense fallback={<LoadingScreen />}>
        <ProtectedRoutes />
      </Suspense>
    </BrowserRouter>
  );
}
