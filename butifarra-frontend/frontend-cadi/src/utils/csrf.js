const CSRF_COOKIE_NAME = "csrftoken";
const CSRF_ENDPOINT = "/api/csrf/";

let pendingRequest = null;

export function getCookie(name) {
  if (typeof document === "undefined") {
    return null;
  }

  return (
    document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`))
      ?.split("=")[1] || null
  );
}

export async function ensureCsrfToken() {
  if (typeof document === "undefined") {
    return null;
  }

  const existing = getCookie(CSRF_COOKIE_NAME);
  if (existing) {
    return existing;
  }

  if (!pendingRequest) {
    const base = import.meta.env?.VITE_API_URL ?? "";
    pendingRequest = fetch(`${base}${CSRF_ENDPOINT}`, {
      credentials: "include",
      headers: { "X-Requested-With": "XMLHttpRequest" },
    })
      .catch(() => null)
      .then(() => getCookie(CSRF_COOKIE_NAME))
      .finally(() => {
        pendingRequest = null;
      });
  }

  return pendingRequest;
}

export const CSRF_COOKIE = CSRF_COOKIE_NAME;
