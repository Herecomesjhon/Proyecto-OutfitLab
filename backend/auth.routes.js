const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const repo = require('./users.pg'); // <-- usar Postgres, no memory

const r = express.Router();

const emailOk = (s='') => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

// REGISTER
r.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'faltan datos' });
    if (!emailOk(email))     return res.status(400).json({ error: 'email inválido' });
    if (password.length < 6) return res.status(400).json({ error: 'password muy corto (min 6)' });

    const exists = await repo.findByEmail(email);
    if (exists) return res.status(409).json({ error: 'Email ya existe' });

    const hash = await bcrypt.hash(password, 10);
    const created = await repo.create({ nombre: name || null, email, passwordHash: hash });
    return res.status(201).json({ success: true, user: created });
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ error: 'Email ya existe' });
    console.error('ERROR /auth/register:', e);
    return res.status(500).json({ error: 'server error' });
  }
});

// LOGIN
r.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'faltan datos' });

    const u = await repo.findByEmail(email);
    if (!u) return res.status(401).json({ error: 'credenciales' });

    const ok = await bcrypt.compare(password, u.password);
    if (!ok) return res.status(401).json({ error: 'credenciales' });

    const token = jwt.sign(
      { sub: u.id_usuario },
      process.env.JWT_SECRET || 'dev',
      { expiresIn: '1d' }
    );

    return res.json({ token, user: { id: u.id_usuario, email: u.email, name: u.nombre } });
  } catch (e) {
    console.error('ERROR /auth/login:', e);
    return res.status(500).json({ error: 'server error' });
  }
});

module.exports = r;
