import apiFetch from "./api.js";

export async function fetchBeneficiaryHome() {
  const response = await apiFetch("/api/home/");
  if (!response.ok) {
    throw new Error("No se pudo obtener la información del inicio");
  }

  const data = await response.json();
  return data ?? {};
}

export async function fetchAdminDashboard() {
  const response = await apiFetch("/api/dashboard/");
  if (!response.ok) {
    throw new Error("No se pudo obtener el resumen administrativo");
  }

  const data = await response.json();
  return data ?? {};
}
