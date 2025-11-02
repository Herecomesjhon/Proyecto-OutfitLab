// //
// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const morgan = require('morgan');
// const jwt = require('jsonwebtoken'); //conexion a bd

// const pool = require('./db');

// const app = express();
// app.use(cors());
// app.use(morgan('dev'));
// app.use(express.json());

// // Vida
// app.get('/health-db', async (req, res) => {
//   try {
//     const r = await pool.query('SELECT now() AS now');
//     res.json({ ok: true, dbTime: r.rows[0].now });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ ok: false, error: err.message });
//   }
// });

// //Ruta de prueba de la conexión de la base de datos
// app.get('/test-db', async(req, res) => {
//     try {
//         const result = await pool.query('SELECT NOW()');
//         res.json({ time: result.rows[0].now })
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });
// // Rutas
// const authRoutes = require('./auth.routes');
// app.use('/auth', authRoutes);

// function authenticate(req, res, next) {
//     const h = req.headers.authorization || '';
//     const t = h.startsWith('Bearer ') ? h.slice(7) : null; // <-- startsWith
//     if (!t) return res.status(401).json({ error: 'falta token' });
//     try {
//         req.user = jwt.verify(t, process.env.JWT_SECRET || 'dev');
//         next();
//     } catch {
//         return res.status(401).json({ error: 'token inválido' });
//     }
// }

// //es una ruta protegida como ejemplo
// app.get('/me', authenticate, (req, res) => {
//     res.json({ userId: req.user.sub });
// });

// // inicia el servidor
// app.listen(process.env.PORT || 3000, '0.0.0.0', () =>
//   console.log(`API en http://localhost:${process.env.PORT||3000}`)
// );

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
const authRoutes = require('./auth.routes');           // ya lo tienes
const itemsRouter = require('./routes/items.routes');  // el de prendas (con Multer)

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

/* ---------- Middleware de autenticación (ejemplo) ---------- */
function authenticate(req, res, next) {
  const h = req.headers.authorization || '';
  const t = h.startsWith('Bearer ') ? h.slice(7) : null;
  if (!t) return res.status(401).json({ error: 'falta token' });
  try {
    req.user = jwt.verify(t, process.env.JWT_SECRET || 'dev');
    next();
  } catch {
    return res.status(401).json({ error: 'token inválido' });
  }
}

// Ruta protegida de ejemplo
app.get('/me', authenticate, (req, res) => {
  res.json({ userId: req.user.sub, user: req.user });
});

/* ---------- API de prendas (inventario) ---------- */
app.use('/api/items', itemsRouter); // create/list/filter + upload de imagen

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
