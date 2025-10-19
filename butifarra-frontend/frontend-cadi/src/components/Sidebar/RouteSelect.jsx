import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useRole } from './RoleContext';

import homeIcon from '../../assets/icons/home-icon.png';
import dashboardIcon from '../../assets/icons/dashboard-icon.png';
import groupsIcon from '../../assets/icons/groups-icon.png';
import notificationIcon from '../../assets/icons/notification-icon.png';
import reportIcon from '../../assets/icons/report-icon.png';
import trophyIcon from '../../assets/icons/trophy-icon.png';
import brainIcon from '../../assets/icons/brain-icon.png';

const routes = [
  { path: "/Inicio", icon: homeIcon, title: "Inicio", roles: ["Estudiante", "Administrador", "Colaborador"] },
  { path: "/admin/gestion", icon: dashboardIcon, title: "Gestion CADI", roles: ["Administrador"] },
  { path: "/torneos", icon: trophyIcon, title: "Torneos", roles: ["Estudiante", "Colaborador", "Administrador"] },
  { path: "/psu", icon: groupsIcon, title: "PSU/Voluntariados", roles: ["Estudiante", "Colaborador"] },
  { path: "/citas", icon: brainIcon, title: "Citas Psicologicas", roles: ["Estudiante"] },
  { path: "/admin/reports", icon: reportIcon, title: "Reportes", roles: ["Administrador", "Colaborador"] },
  { path: "/notificaciones", icon: notificationIcon, title: "Notificaciones", roles: ["Estudiante", "Administrador", "Colaborador"] },

  {path: "/Login", icon: notificationIcon, title: "Cerrar sesion", roles: ["Estudiante", "Administrador", "Colaborador"] },
];

export const RouteSelect = () => {
  const role = useRole();
  const location = useLocation();

  if (!role) return null;

  const visibleRoutes = routes.filter(
    (route) => route.roles.includes(role) && route.title !== "Cerrar sesion"
  );

  const logoutRoute = routes.find((route) => route.title === "Cerrar sesion");



  return (
    <div className="space-y-1">
      {visibleRoutes.map((route, index) => (
        <SidebarRoute
          key={index}
          icon={route.icon}
          title={route.title}
          path={route.path}
          selected={location.pathname.startsWith(route.path)}
        />
      ))}
    </div>
  );
};

const SidebarRoute = ({ selected, icon, title, path }) => {
  const baseClasses = "flex items-center gap-3 px-4 py-2 rounded w-full transition-colors";
  const selectedClasses = selected
    ? "bg-violet-200 text-stone-1000 shadow "
    : "hover:bg-stone-200 text-stone-700 shadow-none";

  return (
    <Link to={path} className={`${baseClasses} ${selectedClasses}`}>
      <img src={icon} alt={title} className="w-5 h-5" />
      <span className="text-base font-medium">{title}</span>
    </Link>
  );
};