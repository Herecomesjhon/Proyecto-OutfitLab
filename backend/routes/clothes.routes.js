//backend/routes/clothes.routes.js
// const { Router } = require('express');
// const upload = require('../lib/multer');
// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

// const router = Router();

// router.get('/ping', (req, res) => {
//   console.log('[CLOTHES] /ping recibido');
//   res.json({ ok: true, at: new Date().toISOString() });
// });


// // Subir prenda (imagen + metadatos opcionales)
// router.post('/upload', upload.single('image'), async (req, res) => {
//   console.log('[UPLOAD] headers:', req.headers['content-type']);
//   console.log('[UPLOAD] body keys:', Object.keys(req.body || {}));
//   console.log('[UPLOAD] file:', req.file?.originalname, '=>', req.file?.filename);
    
//   try {
//     const { userId, type, color } = req.body;
//     if (!userId) return res.status(400).json({ error: 'Falta userId' });
//     if (!req.file) return res.status(400).json({ error: 'Falta archivo image' });

//     const imageUrl = `/uploads/${req.file.filename}`;

//     const prenda = await prisma.prenda.create({
//       data: {
//         userId,
//         imageUrl,
//         type: type || null,
//         color: color || null,
//       },
//     });

//     // res.json(prenda);
//     res.status(201).json({
//       ...prenda,
//       imageUrl: `${req.protocol}://${req.get('host')}${prenda.imageUrl}`,
//     });
//   } catch (err) {
//     console.error('upload error:', err);
//     res.status(500).json({ error: 'No se pudo subir la prenda' });
//   }
// });

// // Listar prendas por usuario
// // GET /api/clothes/user/:userId
// router.get('/user/:userId', async (req, res) => {
//   try {
//     const base = `${req.protocol}://${req.get('host')}`;
//     const prendas = await prisma.prenda.findMany({
//       where: { userId: req.params.userId },
//       orderBy: { createdAt: 'desc' },
//     });
//     res.json(prendas.map(p => ({ ...p, imageUrl: p.imageUrl.startsWith('http') ? p.imageUrl : `${base}${p.imageUrl}` })));
//   } catch (err) {
//     console.error('list error:', err);
//     res.status(500).json({ error: 'No se pudieron obtener las prendas' });
//   }
// });

// module.exports = router;
// backend/routes/clothes.routes.js
const { Router } = require('express');
const path = require('path');
const fs = require('fs').promises; // ✅ Usar promesas en vez de sync
const upload = require('../lib/multer');
const { PrismaClient } = require('@prisma/client');
const { classifyClothing } = require('../services/clothingClassifier');

const prisma = new PrismaClient();
const router = Router();

router.get('/ping', (req, res) => {
  console.log('[CLOTHES] /ping');
  res.json({ ok: true, at: new Date().toISOString() });
});

/**
 * POST /api/clothes/upload
 * FormData: image (file), userId, [type], [color], [brand]
 */
router.post('/upload', upload.single('image'), async (req, res) => {
  console.log('\n=== INICIO UPLOAD ===');
  console.log('[UPLOAD] Content-Type:', req.headers['content-type']);
  console.log('[UPLOAD] Body keys:', Object.keys(req.body || {}));
  console.log('[UPLOAD] Body:', req.body);
  console.log('[UPLOAD] File:', req.file);

  try {
    const { userId, type, color, brand } = req.body;
    
    if (!userId) {
      console.error('❌ Falta userId');
      return res.status(400).json({ error: 'Falta userId' });
    }
    
    if (!req.file) {
      console.error('❌ Falta archivo image');
      return res.status(400).json({ error: 'Falta archivo image' });
    }

    // Construir rutas
    const relativeUrl = `/uploads/${req.file.filename}`;
    const absoluteImagePath = path.join(__dirname, '..', 'uploads', req.file.filename);
    
    console.log('[UPLOAD] Ruta relativa:', relativeUrl);
    console.log('[UPLOAD] Ruta absoluta:', absoluteImagePath);

    // 1) Clasificar con IA
    let classification = { aiLabel: 'clothes', category: 'otro', confidence: 0.6 };
    
    try {
      // Verificar que el archivo existe
      await fs.access(absoluteImagePath);
      console.log('✅ Archivo existe en disco');
      
      // Leer el archivo
      const imageBuffer = await fs.readFile(absoluteImagePath);
      console.log(`✅ Archivo leído: ${imageBuffer.length} bytes (${(imageBuffer.length / 1024).toFixed(2)} KB)`);
      
      // Verificar que el buffer no está vacío
      if (!imageBuffer || imageBuffer.length === 0) {
        throw new Error('Buffer de imagen vacío');
      }
      
      // Llamar al clasificador
      console.log('🔄 Llamando a classifyClothing...');
      classification = await classifyClothing(imageBuffer);
      console.log('✅ Clasificación exitosa:', classification);
      
    } catch (readError) {
      console.error('❌ Error en clasificación:', readError.message);
      console.error('Stack:', readError.stack);
      console.warn('⚠️  Usando fallback por error en lectura/clasificación');
    }

    // 2) Crear registro en DB
    console.log('💾 Guardando en BD...');
    const prenda = await prisma.prenda.create({
      data: {
        userId,
        imageUrl: relativeUrl,
        type: type || null,
        color: color || null,
        brand: brand || null,
        category: classification.category || null,
        confidence: classification.confidence ?? null,
      },
    });
    console.log('✅ Prenda guardada con ID:', prenda.id);

    // 3) Construir URL completa para el frontend
    const base = `${req.protocol}://${req.get('host')}`;
    const fullImageUrl = prenda.imageUrl.startsWith('http') 
      ? prenda.imageUrl 
      : `${base}${prenda.imageUrl}`;

    const response = {
      success: true,
      message: 'Prenda subida y clasificada correctamente',
      prenda: { ...prenda, imageUrl: fullImageUrl },
      classification,
    };

    console.log('📤 Respuesta:', JSON.stringify(response, null, 2));
    console.log('=== FIN UPLOAD ===\n');

    return res.status(201).json(response);
    
  } catch (err) {
    console.error('❌ ERROR GENERAL:', err);
    console.error('Stack:', err.stack);
    res.status(500).json({ 
      error: 'No se pudo subir la prenda',
      detail: err.message 
    });
  }
});

/**
 * GET /api/clothes/user/:userId
 */
router.get('/user/:userId', async (req, res) => {
  try {
    const base = `${req.protocol}://${req.get('host')}`;
    const prendas = await prisma.prenda.findMany({
      where: { userId: req.params.userId },
      orderBy: { createdAt: 'desc' },
    });
    
    const prendasConUrl = prendas.map((p) => ({
      ...p,
      imageUrl: p.imageUrl.startsWith('http') ? p.imageUrl : `${base}${p.imageUrl}`,
    }));
    
    console.log(`[GET] Devolviendo ${prendasConUrl.length} prendas para user ${req.params.userId}`);
    res.json(prendasConUrl);
    
  } catch (err) {
    console.error('list error:', err);
    res.status(500).json({ error: 'No se pudieron obtener las prendas' });
  }
});

/**
 * DELETE /api/clothes/:id - Eliminar una prenda
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Buscar la prenda para obtener la ruta de la imagen
    const prenda = await prisma.prenda.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!prenda) {
      return res.status(404).json({ error: 'Prenda no encontrada' });
    }
    
    // Eliminar el archivo del disco
    if (prenda.imageUrl && !prenda.imageUrl.startsWith('http')) {
      const imagePath = path.join(__dirname, '..', prenda.imageUrl);
      try {
        await fs.unlink(imagePath);
        console.log('✅ Archivo eliminado:', imagePath);
      } catch (e) {
        console.warn('⚠️  No se pudo eliminar el archivo:', e.message);
      }
    }
    
    // Eliminar de la BD
    await prisma.prenda.delete({
      where: { id: parseInt(id) }
    });
    
    res.json({ success: true, message: 'Prenda eliminada' });
    
  } catch (err) {
    console.error('delete error:', err);
    res.status(500).json({ error: 'No se pudo eliminar la prenda' });
  }
});

module.exports = router;