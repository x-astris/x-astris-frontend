const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function apiGet(path: string) {
  const res = await fetch(base + path, { cache: "no-cache" });
  return res.json();
}

export async function apiPost(path: string, data: any) {
  const res = await fetch(base + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function apiDelete(path: string) {
  const res = await fetch(base + path, { method: "DELETE" });
  return res.json();
}
