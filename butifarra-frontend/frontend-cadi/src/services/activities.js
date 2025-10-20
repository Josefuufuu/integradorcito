import apiFetch from "./api.js";

export async function listActivities() {
  const response = await apiFetch("/api/actividades/");
  if (!response.ok) {
    throw new Error("No se pudo obtener la lista de actividades");
  }

  return response.json();
}

export async function createActivity(activity) {
  const response = await apiFetch("/api/actividades/", {
    method: "POST",
    body: JSON.stringify(activity),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.detail ?? "No se pudo crear la actividad");
  }

  return response.json();
}
