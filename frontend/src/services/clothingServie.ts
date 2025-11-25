// // frontend/src/services/clothingService.ts
// import { api, API_URL } from '../api';

// export interface Prenda {
//   id: number;
//   userId: string;
//   imageUrl: string;
//   type?: string;
//   color?: string;
//   category?: string;
//   brand?: string;
//   confidence?: number;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface UploadResult {
//   success: boolean;
//   message: string;
//   prenda: Prenda;
//   classification: {
//     category: string;
//     confidence: number;
//     aiLabel: string;
//   };
// }

// export interface ClothingStats {
//   total: number;
//   byCategory: Array<{ category: string; count: number }>;
//   byColor: Array<{ color: string; count: number }>;
// }

// /**
//  * Subir una prenda con clasificación automática por IA
//  * @param userId - ID del usuario
//  * @param imageUri - URI local de la imagen
//  * @param metadata - Datos opcionales (color, brand, type)
//  */
// export async function uploadClothing(
//   userId: string,
//   imageUri: string,
//   metadata?: { color?: string; brand?: string; type?: string }
// ): Promise<UploadResult> {
//   try {
//     const formData = new FormData();
//     formData.append('userId', userId);

//     // Agregar metadata opcional
//     if (metadata?.color) formData.append('color', metadata.color);
//     if (metadata?.brand) formData.append('brand', metadata.brand);
//     if (metadata?.type) formData.append('type', metadata.type);

//     // Preparar imagen para subir
//     const filename = imageUri.split('/').pop() || 'prenda.jpg';
//     const match = /\.(\w+)$/.exec(filename);
//     const type = match ? `image/${match[1]}` : 'image/jpeg';

//     // @ts-ignore - React Native FormData acepta este formato
//     formData.append('image', {
//       uri: imageUri,
//       name: filename,
//       type,
//     });

//     const response = await fetch(`${API_URL}/api/clothes/upload`, {
//       method: 'POST',
//       body: formData,
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.error || 'Error al subir prenda');
//     }

//     return data;
//   } catch (error) {
//     console.error('❌ Error uploadClothing:', error);
//     throw error;
//   }
// }

// /**
//  * Obtener todas las prendas del usuario
//  * @param userId - ID del usuario
//  */
// export async function getUserClothes(userId: string): Promise<Prenda[]> {
//   try {
//     const response = await api.get(`/api/clothes/user/${userId}`);
//     return response.data.prendas || [];
//   } catch (error) {
//     console.error('❌ Error getUserClothes:', error);
//     throw error;
//   }
// }

// /**
//  * Filtrar prendas por categoría y/o color
//  * @param userId - ID del usuario
//  * @param category - Categoría (camiseta, pantalon, etc.)
//  * @param color - Color de la prenda
//  */
// export async function filterClothes(
//   userId: string,
//   filters?: { category?: string; color?: string }
// ): Promise<Prenda[]> {
//   try {
//     const params = new URLSearchParams({ userId });
//     if (filters?.category) params.append('category', filters.category);
//     if (filters?.color) params.append('color', filters.color);

//     const response = await api.get(`/api/clothes/filter?${params}`);
//     return response.data.prendas || [];
//   } catch (error) {
//     console.error('❌ Error filterClothes:', error);
//     throw error;
//   }
// }

// /**
//  * Obtener estadísticas del closet del usuario
//  * @param userId - ID del usuario
//  */
// export async function getClothingStats(userId: string): Promise<ClothingStats> {
//   try {
//     const response = await api.get(`/api/clothes/stats/${userId}`);
//     return response.data.stats;
//   } catch (error) {
//     console.error('❌ Error getClothingStats:', error);
//     throw error;
//   }
// }

// /**
//  * Eliminar una prenda
//  * @param id - ID de la prenda
//  * @param userId - ID del usuario (para verificar permisos)
//  */
// export async function deleteClothing(id: number, userId: string): Promise<void> {
//   try {
//     await api.delete(`/api/clothes/${id}`, {
//       data: { userId },
//     });
//   } catch (error) {
//     console.error('❌ Error deleteClothing:', error);
//     throw error;
//   }
// }

// /**
//  * Categorías disponibles para filtrar
//  */
// export const CATEGORIES = [
//   'camiseta',
//   'camisa',
//   'blusa',
//   'top',
//   'sueter',
//   'sudadera',
//   'pantalon',
//   'jeans',
//   'shorts',
//   'falda',
//   'vestido',
//   'abrigo',
//   'chamarra',
//   'tenis',
//   'bota',
//   'sandalia',
//   'bolso',
//   'otro',
// ] as const;

// export type CategoryType = typeof CATEGORIES[number];

// frontend/src/services/clothingService.ts
import { api, API_URL } from '../api';

export interface Prenda {
  id: number;
  userId: string;
  imageUrl: string;
  type?: string | null;
  color?: string | null;
  category?: string | null;
  brand?: string | null;
  confidence?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface UploadResult {
  success: boolean;
  message: string;
  prenda: Prenda;
  classification: {
    category: string;
    confidence: number;
    aiLabel: string;
  };
}

export async function uploadClothing(
  userId: string,
  imageUri: string,
  metadata?: { color?: string; brand?: string; type?: string }
): Promise<UploadResult> {
  const formData = new FormData();
  formData.append('userId', userId);
  if (metadata?.color) formData.append('color', metadata.color);
  if (metadata?.brand) formData.append('brand', metadata.brand);
  if (metadata?.type)  formData.append('type',  metadata.type);

  const filename = imageUri.split('/').pop() || 'prenda.jpg';
  const match = /\.(\w+)$/.exec(filename);
  const mime = match ? `image/${match[1]}` : 'image/jpeg';

  // @ts-ignore (React Native FormData)
  formData.append('image', { uri: imageUri, name: filename, type: mime });

  const resp = await fetch(`${API_URL}/api/clothes/upload`, {
    method: 'POST',
    body: formData,
    // 🚫 No pongas Content-Type con FormData
  });

  const data = await resp.json();
  if (!resp.ok) {
    throw new Error(data?.error || 'Error al subir prenda');
  }

  // Garantiza forma homogénea (por si el backend algún día devolviera otra cosa)
  if (!('classification' in data) || !('prenda' in data)) {
    const prenda: Prenda = data;
    return {
      success: true,
      message: 'Prenda subida correctamente',
      prenda,
      classification: {
        category: prenda.category ?? 'otro',
        confidence: typeof prenda.confidence === 'number' ? prenda.confidence : 0,
        aiLabel: 'fallback',
      },
    };
  }

  return data as UploadResult;
}

export async function getUserClothes(userId: string): Promise<Prenda[]> {
  const r = await api.get(`/api/clothes/user/${userId}`);
  return Array.isArray(r.data) ? r.data : r.data?.prendas || [];
}
