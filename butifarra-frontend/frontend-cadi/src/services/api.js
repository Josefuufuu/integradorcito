import { ensureCsrfToken, getCookie } from "../utils/csrf";

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? "";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS", "TRACE"]);

export async function apiFetch(path, options = {}) {
  const { headers: customHeaders = {}, method: rawMethod = "GET", ...rest } = options;
  const method = (rawMethod || "GET").toUpperCase();
  const headers = new Headers(customHeaders);

  if (!headers.has("Content-Type") && !(rest.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (!SAFE_METHODS.has(method)) {
    let csrfToken = getCookie("csrftoken");
    if (!csrfToken) {
      csrfToken = await ensureCsrfToken();
    }

    if (csrfToken) {
      headers.set("X-CSRFToken", csrfToken);
    }
  }

  return fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    method,
    headers,
    ...rest,
  });
}

export default apiFetch;
