import { useAuthStore } from "./auth-store";

const API_BASE = "http://127.0.0.1:4000/api";

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const token = useAuthStore.getState().token;

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {})
    }
  });

  if (!response.ok) {
    throw new Error("API_ERROR");
  }

  return response.json() as Promise<T>;
}
