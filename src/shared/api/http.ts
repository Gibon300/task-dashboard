// src/shared/api/http.ts

const BASE_URL: string = (import.meta.env.VITE_API_URL as string) || "http://localhost:3001";

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  if (!res.ok) {
    // Попробуем вытащить текст ошибки (если бэк что-то вернул)
    let details = "";
    try {
      details = await res.text();
    } catch {
      // ignore
    }

    const message = details
      ? `HTTP ${res.status} ${res.statusText}: ${details}`
      : `HTTP ${res.status} ${res.statusText}`;

    throw new Error(message);
  }

  // DELETE часто возвращает пустое тело
  if (res.status === 204) {
    return undefined as T;
  }

  // Иногда бэк тоже может вернуть пустое тело на 200/201
  const text = await res.text();
  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}

export const http = {
  get<T>(url: string): Promise<T> {
    return request<T>(url, { method: "GET" });
  },

  post<T>(url: string, body: unknown): Promise<T> {
    return request<T>(url, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  patch<T>(url: string, body: unknown): Promise<T> {
    return request<T>(url, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  },

  delete(url: string): Promise<void> {
    return request<void>(url, { method: "DELETE" });
  },
};
