import axios from 'axios';

export const API_URL = 'http://192.168.0.100:3000'; //poner la ip de su compuuu
console.log('_API_URL =', API_URL);

export const api = axios.create({
  baseURL: API_URL,      // sin slash al final
  timeout: 15000,
});

export async function post<T = any>(path: string, body?: any, config?: any): Promise<T> {
  if (!path.startsWith('/')) path = `/${path}`; // <-- evita "http://ip:3000auth/login"
  const { data } = await api.post(path, body ?? {}, {
    headers: { 'Content-Type': 'application/json' },
    ...(config || {}),
  });
  return data;
}


