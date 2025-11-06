//backend/routes/clothes.routes.js
const { Router } = require('express');
const upload = require('../lib/multer');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const router = Router();

router.get('/ping', (req, res) => {
  console.log('[CLOTHES] /ping recibido');
  res.json({ ok: true, at: new Date().toISOString() });
});


// Subir prenda (imagen + metadatos opcionales)
router.post('/upload', upload.single('image'), async (req, res) => {
  console.log('[UPLOAD] headers:', req.headers['content-type']);
  console.log('[UPLOAD] body keys:', Object.keys(req.body || {}));
  console.log('[UPLOAD] file:', req.file?.originalname, '=>', req.file?.filename);
    
  try {
    const { userId, type, color } = req.body;
    if (!userId) return res.status(400).json({ error: 'Falta userId' });
    if (!req.file) return res.status(400).json({ error: 'Falta archivo image' });

    const imageUrl = `/uploads/${req.file.filename}`;

    const prenda = await prisma.prenda.create({
      data: {
        userId,
        imageUrl,
        type: type || null,
        color: color || null,
      },
    });

    // res.json(prenda);
    res.status(201).json({
      ...prenda,
      imageUrl: `${req.protocol}://${req.get('host')}${prenda.imageUrl}`,
    });
  } catch (err) {
    console.error('upload error:', err);
    res.status(500).json({ error: 'No se pudo subir la prenda' });
  }
});

// Listar prendas por usuario
// GET /api/clothes/user/:userId
router.get('/user/:userId', async (req, res) => {
  try {
    const base = `${req.protocol}://${req.get('host')}`;
    const prendas = await prisma.prenda.findMany({
      where: { userId: req.params.userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(prendas.map(p => ({ ...p, imageUrl: p.imageUrl.startsWith('http') ? p.imageUrl : `${base}${p.imageUrl}` })));
  } catch (err) {
    console.error('list error:', err);
    res.status(500).json({ error: 'No se pudieron obtener las prendas' });
  }
});

module.exports = router;
