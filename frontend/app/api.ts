export const API_URL = process.env.EXPO_PUBLIC_API_URL as string;
console.log("API_URL =", API_URL);

export async function get(path: string) {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function post(path: string, body: any) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    // intenta leer el error del backend si lo hay
    let details = "";
    try { details = await res.text(); } catch {}
    throw new Error(`HTTP ${res.status} ${details}`);
  }
  return res.json();
}

