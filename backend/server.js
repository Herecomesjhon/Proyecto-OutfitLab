//
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Vida
app.get('/health', (req, res) => res.json({ ok: true, service: 'OutfitLab API' }));

// Rutas
const authRoutes = require('./auth.routes');
app.use('/auth', authRoutes);

// Ruta protegida para /me 
const jwt = require('jsonwebtoken'); // <-- SOLO una vez en todo este archivo

function authenticate(req, res, next) {
  const h = req.headers.authorization || '';
  const t = h.startsWith('Bearer ') ? h.slice(7) : null; // <-- startsWith
  if (!t) return res.status(401).json({ error: 'falta token' });
  try {
    req.user = jwt.verify(t, process.env.JWT_SECRET || 'dev');
    next();
  } catch {
    return res.status(401).json({ error: 'token inválido' });
  }
}

//es una ruta protegida como ejemplo
app.get('/me', authenticate, (req, res) => {
  res.json({ userId: req.user.sub });
});

// inicia el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API en http://localhost:${PORT}`));
