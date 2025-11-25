// backend/test-huggingface.js
// Script para probar la conexión con Hugging Face
// backend/test-huggingface.js
require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const https = require('https');

const HF_TOKEN = process.env.HUGGING_FACE_TOKEN;
const HF_BASE  = (process.env.HF_BASE || 'https://router.huggingface.co/hf-inference/models').replace(/\/$/, '');
const HF_MODEL = process.env.HF_FASHION_MODEL || 'microsoft/resnet-50';

// Usa keepAlive y compatibilidad TLS moderna (Windows a veces corta)
const httpsAgent = new https.Agent({ keepAlive: true });

function hfHeaders() {
  const h = { 'Content-Type': 'application/octet-stream' };
  if (HF_TOKEN) h.Authorization = `Bearer ${HF_TOKEN}`;
  return h;
}

async function testModelInfo() {
  // INFO del modelo: esta sí va a huggingface.co/api (no inference)
  const infoUrl = `https://huggingface.co/api/models/${HF_MODEL}`;
  const { data } = await axios.get(infoUrl, { httpsAgent });
  console.log('✅ Modelo existe:', HF_MODEL, '| pipeline:', data.pipeline_tag);
}

async function testWithImage() {
  const imageDir = path.join(__dirname, 'uploads');
  const file = fs.readdirSync(imageDir).find(f => /\.(png|jpe?g)$/i.test(f));
  if (!file) throw new Error('No hay imágenes de prueba en /uploads');
  const buf = fs.readFileSync(path.join(imageDir, file));

  const url = `${HF_BASE}/${HF_MODEL}`; // <- router + modelo
  console.log('POST =>', url);

  const { data } = await axios.post(url, buf, {
    headers: hfHeaders(),
    httpsAgent,
    timeout: 60000,
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
    // Útil para ver JSON de error del router si no es 200
    validateStatus: () => true,
  });

  if (Array.isArray(data)) {
    console.log('✅ Respuesta OK (top-3):', JSON.stringify(data.slice(0,3), null, 2));
  } else {
    console.log('ℹ️ Respuesta no-array (posible 5xx/4xx):', JSON.stringify(data, null, 2));
    throw new Error('La API no devolvió lista de predicciones');
  }
}

(async () => {
  if (!HF_TOKEN) {
    console.error('❌ Falta HUGGING_FACE_TOKEN en .env');
    process.exit(1);
  }
  try {
    await testModelInfo();
    await testWithImage();
    console.log('🎉 Test completado');
  } catch (e) {
    console.error('❌ Test falló:', e.message);
  }
})();
