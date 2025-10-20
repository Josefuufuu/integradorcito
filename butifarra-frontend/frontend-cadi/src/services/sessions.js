import apiFetch from "./api.js";

export async function listSessions(params = {}) {
  const search = new URLSearchParams();
  if (params.upcoming) {
    search.set("upcoming", "1");
  }

  const response = await apiFetch(`/api/citas/${search.toString() ? `?${search.toString()}` : ""}`);
  if (!response.ok) {
    throw new Error("No se pudieron obtener las citas");
  }

  return response.json();
}
