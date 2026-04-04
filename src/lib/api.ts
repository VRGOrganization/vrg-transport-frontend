// ─────────────────────────────────────────────────────────────
// lib/api.ts
// Cliente HTTP centralizado.
// postForm envia FormData (multipart) sem definir Content-Type —
// o browser define automaticamente com o boundary correto.
// ─────────────────────────────────────────────────────────────

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

function getToken() {
  return localStorage.getItem("access_token");
}

export function setTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem("access_token", accessToken);
  localStorage.setItem("refresh_token", refreshToken);
  // Cookie para o middleware server-side conseguir proteger as rotas
  document.cookie = `access_token=${accessToken}; path=/; SameSite=Strict`;
}

export function clearTokens() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  document.cookie = "access_token=; path=/; max-age=0";
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw { message: data?.message ?? "Erro desconhecido", status: res.status };
  }

  return data as T;
}

/**
 * Envia FormData sem forçar Content-Type.
 * O browser define automaticamente "multipart/form-data; boundary=..."
 * — sobrescrever o header quebraria o boundary.
 */
async function requestForm<T>(path: string, body: FormData): Promise<T> {
  const token = getToken();

  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    body,
    headers: {
      // NÃO inclui Content-Type aqui — o browser seta com boundary correto
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw { message: data?.message ?? "Erro desconhecido", status: res.status };
  }

  return data as T;
}

export const api = {
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),

  get: <T>(path: string) => request<T>(path, { method: "GET" }),

  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),

  /** Envia FormData via multipart/form-data (sem base64) */
  postForm: <T>(path: string, body: FormData) => requestForm<T>(path, body),
};