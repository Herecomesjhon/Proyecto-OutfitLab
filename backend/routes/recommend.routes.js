// backend/routes/recommend.routes.js
const { Router } = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = Router();

/** LIKE / UNLIKE **/
router.post('/like/:prendaId', async (req, res) => {
  const { prendaId } = req.params;
  const { userId } = req.body || {};
  if (!userId) return res.status(400).json({ error: 'Falta userId' });
  try {
    await prisma.like.upsert({
      where: { userId_prendaId: { userId, prendaId: Number(prendaId) } },
      create: { userId, prendaId: Number(prendaId) },
      update: {},
    });
    res.json({ ok: true });
  } catch (e) {
    console.error('like error:', e);
    res.status(500).json({ error: 'No se pudo registrar el like' });
  }
});

router.delete('/like/:prendaId', async (req, res) => {
  const { prendaId } = req.params;
  const { userId } = req.body || {};
  if (!userId) return res.status(400).json({ error: 'Falta userId' });
  try {
    await prisma.like.delete({
      where: { userId_prendaId: { userId, prendaId: Number(prendaId) } },
    });
    res.json({ ok: true });
  } catch (e) {
    // Si no existe, no pasa nada
    res.json({ ok: true });
  }
});

router.get('/liked/:userId', async (req, res) => {
  const { userId } = req.params;
  const likes = await prisma.like.findMany({
    where: { userId },
    select: { prendaId: true },
  });
  res.json({ likedIds: likes.map((l) => l.prendaId) });
});

/** RECOMENDADOR SIMPLE **/
router.get('/outfit', async (req, res) => {
  const { userId, occasion, weather } = req.query;
  if (!userId) return res.status(400).json({ error: 'Falta userId' });

  const prendas = await prisma.prenda.findMany({
    where: { userId: String(userId) },
  });

  const likes = await prisma.like.findMany({
    where: { userId: String(userId) },
    select: { prendaId: true },
  });
  const liked = new Set(likes.map((l) => l.prendaId));

  const neutrals = new Set(['negro', 'blanco', 'gris', 'beige', 'café', 'marron', 'marrom']);
  const isNeutral = (c) => (c ? neutrals.has(c.toLowerCase()) : false);
  const sameColor = (a, b) => a && b && a.toLowerCase() === b.toLowerCase();

  const tops = prendas.filter((p) => ['camiseta','camisa','blusa','top','sueter','sudadera','cardigan'].includes(p.category || ''));
  const bottoms = prendas.filter((p) => ['pantalon','jeans','shorts','falda','leggins'].includes(p.category || ''));
  const shoes = prendas.filter((p) => ['tenis','bota','sandalia','tacones','calzado'].includes(p.category || ''));
  const access  = prendas.filter((p) => ['bolso','mochila','reloj','lentes','bufanda','gorra','sombrero','cinturon'].includes(p.category || ''));

  function colorScore(c1, c2) {
    if (!c1 || !c2) return 0;
    if (sameColor(c1, c2)) return 2;          // monocromático
    if (isNeutral(c1) || isNeutral(c2)) return 2; // neutros combinan con todo
    return 1; // por ahora, resto de combinaciones suaves
  }

  function prendaScore(p) {
    let s = 0;
    if (liked.has(p.id)) s += 3;
    if (p.confidence && p.confidence > 0.7) s += 1;
    // Puedes sumar reglas por occasion/weather aquí
    return s;
  }

  let best = null;

  for (const t of tops) {
    for (const b of bottoms) {
      for (const s of shoes) {
        let sScore = 0;
        sScore += colorScore(t.color, b.color);
        sScore += colorScore(t.color, s.color);
        sScore += colorScore(b.color, s.color);
        sScore += prendaScore(t) + prendaScore(b) + prendaScore(s);

        if (!best || sScore > best.score) {
          best = { top: t, bottom: b, shoes: s, score: sScore, reasons: [] };
        }
      }
    }
  }

  if (!best) {
    return res.json({ outfit: null, score: 0, explanation: ['No hay suficientes prendas para combinar.'] });
  }

  // Explicación simple
  const R = [];
  if (liked.has(best.top.id) || liked.has(best.bottom.id) || liked.has(best.shoes.id)) {
    R.push('Incluye prendas marcadas con “me gusta”.');
  }
  if (isNeutral(best.bottom.color) || isNeutral(best.shoes.color)) {
    R.push('Uso de colores neutros para balancear la combinación.');
  }
  if (sameColor(best.top.color, best.bottom.color)) {
    R.push('Combinación monocromática entre top y bottom.');
  }

  const base = `${req.protocol}://${req.get('host')}`;
  const expand = (p) => ({ ...p, imageUrl: p.imageUrl.startsWith('http') ? p.imageUrl : `${base}${p.imageUrl}` });

  res.json({
    outfit: { top: expand(best.top), bottom: expand(best.bottom), shoes: expand(best.shoes) },
    score: best.score,
    explanation: R.length ? R : ['Combinación equilibrada por color y preferencias.'],
  });
});

module.exports = router;
