// ✔ base URL uit ENV of fallback naar lokale backend
const base =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333/api";

// Ensures base always ends with /api
const API = base.endsWith("/api") ? base : base + "/api";

export async function apiGet(path: string) {
  const res = await fetch(API + path, { cache: "no-cache" });
  return res.json();
}

export async function apiPost(path: string, data: any) {
  const res = await fetch(API + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function apiDelete(path: string) {
  const res = await fetch(API + path, { method: "DELETE" });
  return res.json();
}
