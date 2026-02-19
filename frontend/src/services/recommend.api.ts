// src/services/recommend.api.ts
import { API_URL } from "../api"; // subir un nivel para importar api.ts

export type OutfitFilters = {
  userId: string;
  weather?: string; 
  event?: string;   
  style?: string;   
};

export async function getRecommendedOutfits(filters: OutfitFilters) {
  const params = new URLSearchParams();

  params.append("userId", filters.userId);
  if (filters.weather) params.append("weather", filters.weather);
  if (filters.event) params.append("event", filters.event);
  if (filters.style) params.append("style", filters.style);

  const url = `${API_URL}/api/recommend/outfits?${params.toString()}`;

  const resp = await fetch(url);

  if (!resp.ok) {
    const text = await resp.text();
    console.log("❌ ERROR /recommend/outfits:", resp.status, text);
    throw new Error("No se pudieron obtener recomendaciones");
  }

  return await resp.json();
}
