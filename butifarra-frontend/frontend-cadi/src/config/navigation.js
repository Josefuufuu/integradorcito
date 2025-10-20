import { Roles } from "../constants/roles.js";
import {
  Home,
  Activity,
  Trophy,
  Users,
  Bell,
  ClipboardList,
  HeartPulse,
} from "lucide-react";

export const NAVIGATION_SECTIONS = [
  {
    label: "Explorar",
    items: [
      {
        label: "Inicio",
        to: "/inicio",
        icon: Home,
        roles: [Roles.BENEFICIARY, Roles.ADMIN, Roles.COORDINATOR],
      },
      {
        label: "Actividades",
        to: "/actividades",
        icon: Activity,
        roles: [Roles.BENEFICIARY, Roles.ADMIN, Roles.COORDINATOR],
      },
      {
        label: "Torneos",
        to: "/torneos",
        icon: Trophy,
        roles: [Roles.BENEFICIARY, Roles.ADMIN, Roles.COORDINATOR],
      },
      {
        label: "PSU y voluntariados",
        to: "/psu",
        icon: Users,
        roles: [Roles.BENEFICIARY, Roles.ADMIN, Roles.COORDINATOR],
      },
      {
        label: "Citas psicológicas",
        to: "/citas",
        icon: HeartPulse,
        roles: [Roles.BENEFICIARY, Roles.ADMIN, Roles.COORDINATOR],
      },
    ],
  },
  {
    label: "Administración",
    items: [
      {
        label: "Panel administrativo",
        to: "/admin/inicio",
        icon: ClipboardList,
        roles: [Roles.ADMIN, Roles.COORDINATOR],
      },
      {
        label: "Gestionar actividades",
        to: "/admin/actividades",
        icon: Activity,
        roles: [Roles.ADMIN, Roles.COORDINATOR],
      },
      {
        label: "Gestionar torneos",
        to: "/admin/torneos",
        icon: Trophy,
        roles: [Roles.ADMIN, Roles.COORDINATOR],
      },
      {
        label: "Notificaciones",
        to: "/admin/notificaciones",
        icon: Bell,
        roles: [Roles.ADMIN, Roles.COORDINATOR],
      },
      {
        label: "Reportes",
        to: "/admin/reportes",
        icon: ClipboardList,
        roles: [Roles.ADMIN, Roles.COORDINATOR],
      },
      {
        label: "Personas",
        to: "/admin/usuarios",
        icon: Users,
        roles: [Roles.ADMIN, Roles.COORDINATOR],
      },
    ],
  },
];
