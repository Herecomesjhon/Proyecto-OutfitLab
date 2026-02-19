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
