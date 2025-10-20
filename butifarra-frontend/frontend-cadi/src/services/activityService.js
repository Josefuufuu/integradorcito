// src/services/activityService.js
import apiFetch from "./api.js";

// Obtiene las actividades del usuario autenticado.
export async function getUserActivities() {
  const response = await apiFetch("/api/user/activities/");

  if (!response.ok) {
    throw new Error("No se pudieron obtener las actividades del usuario");
  }

  const data = await response.json();
  if (!Array.isArray(data)) {
    return [];
  }

  return data.map((activity) => ({
    ...activity,
    enrollment_id: activity.enrollment_id ?? null,
    enrollment_status: activity.enrollment_status ?? null,
  }));
}
