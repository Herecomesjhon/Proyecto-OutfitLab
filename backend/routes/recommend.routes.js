// backend/routes/recommend.routes.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { getOutfitRecommendations } = require('../services/recommend.service');

// GET /api/recommend/outfits?userId=...&weather=frio&event=casual&style=grunge
router.get('/outfits', async (req, res) => {
  const { userId, weather, event, style, limit } = req.query;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'userId es requerido',
    });
  }

  try {
    // ⬇️ OJO: cambia "clothing" por el nombre REAL de tu modelo Prisma si es distinto
    const clothes = await prisma.prenda.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const max = Number(limit) || 10;

    const outfits = getOutfitRecommendations(
      clothes,
      { weather, event, style },
      max
    );

    return res.json({
      success: true,
      filters: { weather, event, style },
      totalClothes: clothes.length,
      totalOutfits: outfits.length,
      outfits,
    });
  } catch (err) {
    console.error('[GET /api/recommend/outfits] Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Error al generar recomendaciones de outfit',
    });
  }
});

module.exports = router;
