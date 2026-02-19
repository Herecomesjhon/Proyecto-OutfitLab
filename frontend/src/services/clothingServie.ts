//frontend/src/services/clothingServie.ts
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
