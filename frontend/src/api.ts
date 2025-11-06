//frontend/src/api.ts
import axios from 'axios';

export const API_URL = 'http://192.168.0.103:3000'; //poner la ip de su compuuu
console.log('_API_URL =', API_URL);

export const api = axios.create({
  baseURL: API_URL,     
  timeout: 15000,
});

export async function post<T = any>(path: string, body?: any, config?: any): Promise<T> {
  if (!path.startsWith('/')) path = `/${path}`;
  const { data } = await api.post(path, body ?? {}, {
    headers: { 'Content-Type': 'application/json' },
    ...(config || {}),
  });
  return data;
}

