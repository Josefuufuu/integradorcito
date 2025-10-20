// src/services/psu.js
import apiFetch from "./api";

// === AUTH opcional (JWT) ===
const authHeaders = () => {
  const t = localStorage.getItem("token");
  return t ? { Authorization: `Bearer ${t}` } : {};
};

// --- util: normaliza formatos distintos de respuesta ---
const toArray = (data) => {
  if (Array.isArray(data)) return data;
  if (data?.results) return data.results;
  if (data?.data) return data.data;
  return [];
};

// --- GET proyectos activos ---
export async function listarProyectosActivos() {
  const res = await apiFetch("/api/proyectos/?estado=inscripcion", {
    method: "GET",
    headers: {
      ...authHeaders(), // quita si usas solo cookie
    },
  });
  if (!res.ok) throw new Error(`GET proyectos: ${res.status}`);
  const raw = await res.json();
  return toArray(raw).map((project) => ({
    ...project,
    nombre: project.name ?? project.nombre,
    tipo: project.type ?? project.tipo,
    inicio: project.start_date ?? project.inicio,
    fin: project.end_date ?? project.fin,
    total_slots: project.total_slots ?? project.cupo_total,
    inscripciones_confirmadas: project.inscripciones_confirmadas ?? project.confirmed_slots,
  }));
}

// --- POST crear inscripción ---
export async function crearInscripcion(payload) {
  const project = payload.project ?? payload.proyecto;
  const fullName = payload.full_name ?? payload.nombres;
  const email = payload.email ?? payload.correo;
  const phone = payload.phone ?? payload.telefono ?? "";

  if (!project) {
    throw new Error("Debes seleccionar un proyecto.");
  }
  if (!fullName) {
    throw new Error("El nombre es obligatorio.");
  }
  if (!email) {
    throw new Error("El correo es obligatorio.");
  }

  const res = await apiFetch("/api/inscripciones/", {
    method: "POST",
    headers: {
      ...authHeaders(),
    },
    body: JSON.stringify({
      project,
      full_name: fullName,
      email,
      phone,
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.project ?? data?.detail ?? "Error al inscribirse");
  }
  return data;
}

export async function listarInscripciones() {
  const res = await apiFetch("/api/inscripciones/", {
    method: "GET",
    headers: {
      ...authHeaders(),
    },
  });

  if (!res.ok) {
    throw new Error(`GET inscripciones: ${res.status}`);
  }

  const raw = await res.json();
  return toArray(raw).map((registration) => ({
    ...registration,
    project: registration.project,
    full_name: registration.full_name ?? registration.nombres,
    email: registration.email,
    phone: registration.phone ?? "",
    created_at: registration.created_at,
  }));
}
