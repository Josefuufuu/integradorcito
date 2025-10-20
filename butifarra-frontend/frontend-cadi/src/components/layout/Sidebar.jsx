// src/components/layout/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiGrid, FiAward, FiUsers, FiHeart, FiBarChart2, FiBell, FiLogOut } from 'react-icons/fi';
import { useAuth } from "../../context/AuthContext.jsx"; 
import PropTypes from "prop-types";

const NavItem = ({ to, icon, children }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => (isActive ? "sidebar-nav-item active" : "sidebar-nav-item")}
  >
    {icon}
    <span>{children}</span>
  </NavLink>
);

NavItem.propTypes = {
  to: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  children: PropTypes.string.isRequired
};

export default function Sidebar() {
  const { user, logout } = useAuth(); 
  const displayName = user?.name || user?.email || "Usuario"; 

  return (

    <div className="flex h-full w-full flex-col p-4"> 
      <div className="sidebar-header">
        <h1>ICESI Bienestar</h1>
        <span>{displayName}</span>
      </div>
      <nav className="sidebar-nav">
        <NavItem to="/inicio" icon={<FiHome />}>Inicio</NavItem>
        <NavItem to="/gestion-cadi" icon={<FiGrid />}>Gestión CADI</NavItem>
        
        <NavItem to="/admin/torneos" icon={<FiAward />}>Torneos</NavItem>
        
        <NavItem to="/psu" icon={<FiUsers />}>PSU / Voluntariados</NavItem>
        <NavItem to="/citas" icon={<FiHeart />}>Citas psicológicas</NavItem>
        <NavItem to="/reportes" icon={<FiBarChart2 />}>Reportes</NavItem>
        <NavItem to="/notificaciones" icon={<FiBell />}>Notificaciones</NavItem>
      </nav>
      <div className="sidebar-footer">
        <button onClick={logout} className="sidebar-nav-item">
          <FiLogOut />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
}