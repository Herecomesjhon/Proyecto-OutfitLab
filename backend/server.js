// backend/server.js
require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');

// Prisma (ORM)
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Rutas
const authRoutes = require('./auth.routes');           
const clothesRouter = require('./routes/clothes.routes'); 
const recommendRoutes = require('./routes/recommend.routes');
const outfitsRoutes = require('./routes/outfits.routes');
const collectionsRoutes = require('./routes/collections.routes');
const exploreRoutes = require('./routes/explore.routes');


const app = express();

/* ---------- Middlewares globales ---------- */
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos subidos (imágenes)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* ---------- Health checks ---------- */
app.get('/health', (_req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || 'dev', time: new Date().toISOString() });
});

app.get('/health-db', async (_req, res) => {
  try {
    // chequeo ligero a la DB (SELECT now())
    const r = await prisma.$queryRawUnsafe('SELECT now() AS now');
    res.json({ ok: true, dbTime: r?.[0]?.now || null });
  } catch (err) {
    console.error('health-db error:', err);
    res.status(500).json({ ok: false, error: String(err.message || err) });
  }
});

/* ---------- Auth (tu ruta existente) ---------- */
app.use('/auth', authRoutes);


/* ---------- API de prendas (inventario) ---------- */
app.use('/api/clothes', clothesRouter);

app.use('/api/outfits', outfitsRoutes);

app.use('/api/collections', collectionsRoutes);

app.use('/api/explore', exploreRoutes);

/* ---------- API de recomendaciones ---------- */
app.use('/api/recommend', recommendRoutes);

/* ---------- 404 y errores ---------- */
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', path: req.originalUrl });
});

app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error', detail: err?.message || String(err) });
});

/* ---------- Arranque ---------- */
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API en http://localhost:${PORT}`);
});

