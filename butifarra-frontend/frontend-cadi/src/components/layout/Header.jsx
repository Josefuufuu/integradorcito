import { FiBell, FiUser } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext.jsx";
import { Roles } from "../../constants/roles.js";

export default function Header() {
  const { user } = useAuth();
  const roleLabel = user?.role === Roles.ADMIN
    ? "Administrador CADI"
    : user?.role === Roles.COORDINATOR
      ? "Coordinador CADI"
      : "Beneficiario";

  return (
    <div className="flex h-16 items-center justify-between px-4 sm:px-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">Bienestar universitario</p>
        <p className="text-lg font-semibold text-slate-700">
          {user?.first_name ? `Hola, ${user.first_name}` : "Panel de bienestar"}
        </p>
        <p className="text-xs text-slate-500">{roleLabel}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-violet-300 hover:text-violet-600"
          aria-label="Notificaciones"
        >
          <FiBell className="size-5" />
        </button>
        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-violet-300 hover:text-violet-600"
          aria-label="Perfil"
        >
          <FiUser className="size-5" />
        </button>
      </div>
    </div>
  );
}