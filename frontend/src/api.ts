// frontend/src/api.ts
import axios from "axios";

export const API_URL = "http://10.52.55.33:3000";
console.log("_API_URL =", API_URL);

// Cliente Axios configurado
export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

// ======================================================
// 🔵 GET – para traer datos (ej: outfits guardados)
// ======================================================
export async function get<T = any>(path: string, config?: any): Promise<T> {
  if (!path.startsWith("/")) path = `/${path}`;

  const { data } = await api.get(path, {
    ...(config || {}),
  });

  return data;
}

// ======================================================
// 🔵 POST – para enviar datos (login, registrar, generar outfit…)
// ======================================================
export async function post<T = any>(
  path: string,
  body?: any,
  config?: any
): Promise<T> {
  if (!path.startsWith("/")) path = `/${path}`;

  const { data } = await api.post(
    path,
    body ?? {},
    {
      headers: {
        "Content-Type": "application/json",
      },
      ...(config || {}),
    }
  );

  return data;
}

export async function put(path: string, body: any) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Error en la petición");
  }
  return data;
}

export async function del(path: string, body?: any) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Error en la petición");
  }
  return data;
}

