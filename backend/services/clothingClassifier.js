// backend/services/clothingClassifier.js
// const axios = require('axios');

// /**
//  * Servicio de clasificación con Hugging Face (con fallback).
//  * Usa el router nuevo: https://router.huggingface.co/hf-inference/models
//  */

// const HF_ENABLED = (process.env.HF_ENABLED || 'true').toLowerCase() === 'true';
// const HF_BASE = process.env.HF_BASE || 'https://router.huggingface.co/hf-inference/models';
// const HF_MODEL = process.env.HF_FASHION_MODEL || 'patrickjohncyh/fashion-clip';
// const HF_TOKEN = process.env.HUGGING_FACE_TOKEN || '';

// /** Mapeo simple EN->ES para categorías */
// const CATEGORY_MAP = {
//   't-shirt': 'camiseta',
//   tshirt: 'camiseta',
//   shirt: 'camisa',
//   blouse: 'blusa',
//   top: 'top',
//   tank: 'playera',
//   pullover: 'sueter',
//   sweater: 'sueter',
//   hoodie: 'sudadera',
//   cardigan: 'cardigan',
//   pants: 'pantalon',
//   trouser: 'pantalon',
//   jeans: 'jeans',
//   shorts: 'shorts',
//   skirt: 'falda',
//   leggings: 'leggins',
//   dress: 'vestido',
//   gown: 'vestido',
//   suit: 'traje',
//   jumpsuit: 'enterizo',
//   coat: 'abrigo',
//   jacket: 'chamarra',
//   blazer: 'blazer',
//   parka: 'parka',
//   shoe: 'calzado',
//   sneaker: 'tenis',
//   boot: 'bota',
//   sandal: 'sandalia',
//   heel: 'tacones',
//   'ankle boot': 'botín',
//   bag: 'bolso',
//   purse: 'bolso',
//   backpack: 'mochila',
//   hat: 'sombrero',
//   cap: 'gorra',
//   scarf: 'bufanda',
//   belt: 'cinturon',
//   watch: 'reloj',
//   sunglasses: 'lentes',
// };

// /** Fallback: si no hay IA o falla, devolvemos algo genérico */
// function classifyBasic() {
//   return {
//     aiLabel: 'clothes',
//     category: 'otro',
//     confidence: 0.6,
//   };
// }

// /** Normaliza la respuesta de HF a nuestro formato */
// function normalizeHuggingFace(respData) {
//   // Formatos típicos:
//   // - [{ label: "t-shirt", score: 0.83 }, ...]
//   // - { labels: ["t-shirt", ...], scores: [0.83, ...] }
//   let label = null;
//   let score = null;

//   if (Array.isArray(respData) && respData.length) {
//     label = respData[0]?.label || null;
//     score = respData[0]?.score ?? null;
//   } else if (respData && Array.isArray(respData.labels) && respData.labels.length) {
//     label = respData.labels[0];
//     score = Array.isArray(respData.scores) ? respData.scores[0] : null;
//   }

//   label = (label || 'clothes').toString().toLowerCase();
//   const category = CATEGORY_MAP[label] || 'otro';
//   const confidence = typeof score === 'number' ? score : 0.6;

//   return {
//     aiLabel: label,
//     category,
//     confidence,
//   };
// }

// /** Llama a Hugging Face (si está habilitado) */
// async function classifyWithHF(imageBuffer) {
//   const url = `${HF_BASE.replace(/\/$/, '')}/${HF_MODEL}`;
//   const headers = {
//     'Content-Type': 'application/octet-stream',
//   };
//   if (HF_TOKEN) headers.Authorization = `Bearer ${HF_TOKEN}`;

//   const { data } = await axios.post(url, imageBuffer, { headers, timeout: 30000 });
//   return normalizeHuggingFace(data);
// }

// /** Punto de entrada del servicio */
// async function classifyClothing(imageBuffer) {
//   if (!HF_ENABLED || !HF_TOKEN) {
//     console.warn('⚠️  IA deshabilitada o sin token. Usando fallback.');
//     return classifyBasic();
//   }
//   try {
//     const res = await classifyWithHF(imageBuffer);
//     return res;
//   } catch (e) {
//     const msg = e?.response?.status
//       ? `${e.response.status} ${e.response.statusText}`
//       : e?.message || String(e);
//     console.warn('❌ Error clasificando con IA (HF):', msg);
//     return classifyBasic();
//   }
// }

// module.exports = { classifyClothing };

// backend/services/clothingClassifier.js (fragmento clave)
require('dotenv').config();
const axios = require('axios');
const https = require('https');

const HF_ENABLED = String(process.env.HF_ENABLED || 'true') === 'true';
const HF_TOKEN   = process.env.HUGGING_FACE_TOKEN;
const HF_BASE    = (process.env.HF_BASE || 'https://router.huggingface.co/hf-inference/models').replace(/\/$/, '');
const HF_MODEL   = process.env.HF_FASHION_MODEL || 'microsoft/resnet-50';

const agent = new https.Agent({ keepAlive: true });

function mapHfLabelToCategory(label) {
  const l = (label || '').toLowerCase();
  if (l.includes('t-shirt') || l.includes('tee') || l.includes('jersey')) return 'camiseta';
  if (l.includes('shirt') || l.includes('blouse')) return 'camisa';
  if (l.includes('jean') || l.includes('trouser') || l.includes('pant')) return 'pantalon';
  if (l.includes('dress') || l.includes('gown')) return 'vestido';
  if (l.includes('skirt')) return 'falda';
  if (l.includes('jacket') || l.includes('coat') || l.includes('parka')) return 'chamarra';
  if (l.includes('sandal') || l.includes('sneaker') || l.includes('boot') || l.includes('shoe')) return 'calzado';
  if (l.includes('handbag') || l.includes('bag') || l.includes('backpack')) return 'bolso';
  if (l.includes('hoodie') || l.includes('sweatshirt')) return 'sudadera';
  return 'otro';
}

/**
 * Recibe un Buffer de imagen y devuelve { aiLabel, category, confidence }
 */
async function classifyClothing(imageBuffer) {
  if (!HF_ENABLED) {
    return { aiLabel: 'disabled', category: 'otro', confidence: 0 };
  }
  if (!HF_TOKEN) {
    throw new Error('HUGGING_FACE_TOKEN no configurado');
  }

  const url = `${HF_BASE}/${HF_MODEL}`;
  const headers = {
    'Authorization': `Bearer ${HF_TOKEN}`,
    'Content-Type': 'application/octet-stream',
  };

  // Pequeño retry por si el modelo está "cold"
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const { data } = await axios.post(url, imageBuffer, {
        headers,
        timeout: 60000,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        httpsAgent: agent,
      });

      // data puede ser [{label, score}, ...] o { error: ... }
      const top = Array.isArray(data) ? data[0] : null;
      const aiLabel = top?.label || 'clothes';
      const confidence = Number(top?.score ?? 0);
      const category = mapHfLabelToCategory(aiLabel);

      return { aiLabel, category, confidence };
    } catch (err) {
      // 503 (loading) o errores de red → reintentar una vez
      if (attempt === 2) throw err;
    }
  }
}

module.exports = {
  classifyClothing,
  mapHfLabelToCategory,
};
