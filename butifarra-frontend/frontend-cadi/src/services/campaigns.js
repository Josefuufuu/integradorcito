import apiFetch from "./api.js";

const formatScheduledAt = ({ scheduleDate, scheduleTime }) => {
  const time = scheduleTime || "09:00";
  const iso = new Date(`${scheduleDate}T${time}`).toISOString();
  return iso;
};

const normalizeCampaign = (payload) => ({
  id: payload.id,
  name: payload.name,
  message: payload.message,
  channel: payload.channel,
  segment: payload.segment,
  status: payload.status,
  scheduledAt: payload.scheduled_at,
  metricsSent: payload.metrics_sent,
  metricsOpened: payload.metrics_opened,
});

export async function listCampaigns() {
  const response = await apiFetch("/api/campanas/");
  if (!response.ok) {
    throw new Error("No se pudieron obtener las campañas");
  }

  const data = await response.json();
  return Array.isArray(data) ? data.map(normalizeCampaign) : [];
}

export async function createCampaign(data) {
  const response = await apiFetch("/api/campanas/", {
    method: "POST",
    body: JSON.stringify({
      name: data.name,
      message: data.message,
      channel: data.channel,
      segment: data.segment,
      scheduled_at: formatScheduledAt(data),
    }),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.detail ?? "No se pudo crear la campaña");
  }

  const payload = await response.json();
  return normalizeCampaign(payload);
}

export async function updateCampaign(id, data) {
  const response = await apiFetch(`/api/campanas/${id}/`, {
    method: "PATCH",
    body: JSON.stringify({
      name: data.name,
      message: data.message,
      channel: data.channel,
      segment: data.segment,
      scheduled_at: formatScheduledAt(data),
    }),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.detail ?? "No se pudo actualizar la campaña");
  }

  const payload = await response.json();
  return normalizeCampaign(payload);
}

export async function deleteCampaign(id) {
  const response = await apiFetch(`/api/campanas/${id}/`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.detail ?? "No se pudo eliminar la campaña");
  }

  return true;
}
