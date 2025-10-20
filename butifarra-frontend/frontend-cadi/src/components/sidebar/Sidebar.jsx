import { NavLink } from "react-router-dom";
import { useMemo } from "react";
import { NAVIGATION_SECTIONS } from "../../config/navigation.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { Roles } from "../../constants/roles.js";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function SidebarSection({ label, items }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <p className="px-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <nav className="space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              classNames(
                "flex items-center gap-3 rounded-xl px-4 py-2 text-sm font-medium transition",
                isActive
                  ? "bg-violet-100 text-violet-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
              )
            }
          >
            <item.icon className="size-4" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default function Sidebar() {
  const { user } = useAuth();

  const sections = useMemo(() => {
    const role = user?.role ?? Roles.BENEFICIARY;
    return NAVIGATION_SECTIONS.map((section) => ({
      ...section,
      items: section.items.filter((item) => item.roles.includes(role)),
    })).filter((section) => section.items.length > 0);
  }, [user]);

  return (
    <aside className="h-full w-full bg-white p-4">
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">ICESI Bienestar</p>
          <p className="text-lg font-semibold text-slate-800">Plataforma CADI</p>
          {user && (
            <p className="mt-2 text-sm text-slate-500">
              Sesión: <span className="font-medium text-slate-700">{user.first_name || user.username}</span>
            </p>
          )}
        </div>

        <div className="space-y-6">
          {sections.map((section) => (
            <SidebarSection key={section.label} label={section.label} items={section.items} />
          ))}
        </div>
      </div>
    </aside>
  );
}
