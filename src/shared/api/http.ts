const BASE_URL = "http://localhost:3001";

export const http = {
  async get<T>(url: string): Promise<T> {
    const res = await fetch(`${BASE_URL}${url}`);
    if (!res.ok) throw new Error(`GET ${url} failed: ${res.status}`);
    return res.json();
  },

  async post<T>(url: string, body: unknown): Promise<T> {
    const res = await fetch(`${BASE_URL}${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`POST ${url} failed: ${res.status}`);
    return res.json();
  },

  async delete(url: string): Promise<void> {
    const res = await fetch(`${BASE_URL}${url}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`DELETE ${url} failed: ${res.status}`);
  },

  async patch<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(`http://localhost:3001${url}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`PATCH ${url} failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
},

};
