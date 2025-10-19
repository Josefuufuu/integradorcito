// src/components/layout/AppLayout.jsx

import React, { useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { FiHome, FiGrid, FiAward, FiUsers, FiHeart, FiBarChart2, FiBell, FiLogOut } from "react-icons/fi";
import Header from "./Header"; // Importamos el nuevo Header
import { useAuth } from "../../context/AuthContext.jsx";

// Componente reutilizable para los elementos de navegación
const NavItem = ({ to, icon, children }) => (
  <NavLink
    to={to}
    // Esto aplica la clase 'active' solo si la ruta es la correcta
    className={({ isActive }) => (isActive ? "sidebar-nav-item active" : "sidebar-nav-item")}
  >
    {icon}
    <span>{children}</span>
  </NavLink>
);

// PropTypes para el NavItem
NavItem.propTypes = {
  to: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  children: PropTypes.string.isRequired
};

// El nuevo AppLayout
export default function AppLayout({ children }) {
  const { user, logout } = useAuth();

  const displayName = useMemo(() => {
    if (!user) {
      return "Usuario";
    }

    return user.name || user.full_name || user.username || user.email || "Usuario";
  }, [user]);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Error al cerrar sesión", err);
    }
  }, [logout]);

  return (
    <div className="app-layout">
      {/* BARRA LATERAL (SIDEBAR) */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>ICESI Bienestar</h1>
          <span>{displayName}</span>
        </div>
        <nav className="sidebar-nav">
          <NavItem to="/inicio" icon={<FiHome />}>Inicio</NavItem>
          <NavItem to="/gestion-cadi" icon={<FiGrid />}>Gestión CADI</NavItem>
           <NavItem to="/admin/torneos" icon={<FiAward />}>Torneos</NavItem>
          <NavItem to="/torneos" icon={<FiAward />}>Torneos</NavItem>
          <NavItem to="/psu" icon={<FiUsers />}>PSU / Voluntariados</NavItem>
          <NavItem to="/citas" icon={<FiHeart />}>Citas psicológicas</NavItem>
          <NavItem to="/reportes" icon={<FiBarChart2 />}>Reportes</NavItem>
          <NavItem to="/notificaciones" icon={<FiBell />}>Notificaciones</NavItem>
        </nav>
        <div className="sidebar-footer">
          <button className="sidebar-nav-item" type="button" onClick={handleLogout}>
            <FiLogOut />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL DE LA PÁGINA */}
      <div className="main-content">
        <Header /> {/* Aquí va la cabecera con los iconos de campana y perfil */}
        <main>
          {children} {/* Aquí se renderizarán tus páginas (PanelGeneral, GestionCadi, etc.) */}
        </main>
      </div>
    </div>
  );
}

AppLayout.propTypes = { children: PropTypes.node };
