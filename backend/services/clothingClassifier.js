// backend/services/clothingClassifier.js
const axios = require('axios');

/**
 * Servicio para clasificar prendas usando Hugging Face
 * Modelo: Fashion Classification
 */

// Configuración de la API
const HF_API_URL = 'https://api-inference.huggingface.co/models/Matthijs/swin-base-finetuned-food101';
const HF_FASHION_API = 'https://api-inference.huggingface.co/models/patrickjohncyh/fashion-clip';

/**
 * Clasifica una imagen de ropa usando IA
 * @param {Buffer} imageBuffer - Buffer de la imagen
 * @returns {Promise<Object>} - Resultado de la clasificación
 */
async function classifyClothing(imageBuffer) {
    try {
        // Si no hay token de Hugging Face, usamos clasificación básica
        if (!process.env.HUGGING_FACE_TOKEN) {
            console.warn('⚠️  HUGGING_FACE_TOKEN no configurado, usando clasificación básica');
            return classifyBasic(imageBuffer);
        }

        const response = await axios.post(
            HF_FASHION_API,
            imageBuffer, {
                headers: {
                    'Authorization': `Bearer ${process.env.HUGGING_FACE_TOKEN}`,
                    'Content-Type': 'application/octet-stream',
                },
                timeout: 30000, // 30 segundos
            }
        );

        return response.data;
    } catch (error) {
        console.error('❌ Error clasificando con IA:', error.message);
        // Fallback a clasificación básica
        return classifyBasic(imageBuffer);
    }
}

/**
 * Clasificación básica por análisis de colores (fallback)
 */
function classifyBasic(imageBuffer) {
    // Retorna una clasificación genérica
    return [
        { label: 'ropa', score: 0.85 },
        { label: 'prenda', score: 0.75 }
    ];
}

/**
 * Extrae información útil de la clasificación
 */
function extractClothingInfo(classifications) {
    if (!classifications || classifications.length === 0) {
        return {
            category: 'otro',
            confidence: 0.5,
            originalLabel: 'desconocido'
        };
    }

    const topResult = classifications[0];

    // Mapeo de categorías en español
    const categoryMap = {
        // Tops
        't-shirt': 'camiseta',
        'tshirt': 'camiseta',
        'shirt': 'camisa',
        'blouse': 'blusa',
        'top': 'top',
        'tank': 'playera',
        'pullover': 'sueter',
        'sweater': 'sueter',
        'hoodie': 'sudadera',
        'cardigan': 'cardigan',

        // Bottoms
        'pants': 'pantalon',
        'trouser': 'pantalon',
        'jeans': 'jeans',
        'shorts': 'shorts',
        'skirt': 'falda',
        'leggings': 'leggins',

        // Vestidos y trajes
        'dress': 'vestido',
        'gown': 'vestido',
        'suit': 'traje',
        'jumpsuit': 'enterizo',

        // Abrigos
        'coat': 'abrigo',
        'jacket': 'chamarra',
        'blazer': 'blazer',
        'parka': 'parka',

        // Calzado
        'shoe': 'calzado',
        'sneaker': 'tenis',
        'boot': 'bota',
        'sandal': 'sandalia',
        'heel': 'tacones',
        'ankle boot': 'botín',

        // Accesorios
        'bag': 'bolso',
        'purse': 'bolso',
        'backpack': 'mochila',
        'hat': 'sombrero',
        'cap': 'gorra',
        'scarf': 'bufanda',
        'belt': 'cinturon',
        'watch': 'reloj',
        'sunglasses': 'lentes'
    };

    const label = topResult.label ? topResult.label.toLowerCase() : 'otro';
    const category = categoryMap[label] || 'otro';

    return {
        category,
        confidence: topResult.score || 0.5,
        originalLabel: topResult.label || 'desconocido'
    };
}

/**
 * Analiza color predominante de la imagen
 */
async function analyzeColor(imageBuffer) {
    // Por ahora retorna null, se puede implementar con sharp
    // para extraer color dominante
    return null;
}

module.exports = {
    classifyClothing,
    extractClothingInfo,
    analyzeColor
};