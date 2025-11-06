// backend/auth.routes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const fetch = require('node-fetch');

const repo = require('./users.pg'); // <-- usa PG, no memory
const r = express.Router();

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// helper para JWT
function sign(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET || 'dev', { expiresIn: '1d' });
}

/* =========================
   Registro local (opcional)
========================= */
r.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'faltan datos' });
    }
    const exists = await repo.findByEmail(email);
    if (exists) return res.status(409).json({ error: 'Email ya existe' });

    const hash = await bcrypt.hash(password, 10);
    const u = await repo.createLocal({ name: name || '', email, passwordHash: hash });

    return res.json({ success: true, user: u });
  } catch (e) {
    console.error('ERROR /auth/register:', e);
    return res.status(500).json({ error: 'server error' });
  }
});

/* =========================
   Login local (email+pass)
========================= */
r.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'faltan datos' });
    }

    const u = await repo.findByEmail(email);
    if (!u) return res.status(401).json({ error: 'credenciales' });

    // si es una cuenta social sin password
    if (!u.password) {
      return res.status(400).json({ error: 'Esta cuenta usa login social' });
    }

    const ok = await bcrypt.compare(password, u.password);
    if (!ok) return res.status(401).json({ error: 'credenciales' });

    const token = sign(u.id);
    return res.json({ token, user: { id: u.id, email: u.email, name: u.name } });
  } catch (e) {
    console.error('ERROR /auth/login:', e);
    return res.status(500).json({ error: 'server error' });
  }
});

/* =========================
   Google Sign-In
   Body: { idToken }
========================= */
r.post('/google', async (req, res) => {
  try {
    const { idToken } = req.body || {};
    if (!idToken) return res.status(400).json({ error: 'falta idToken' });

    // 1) Verificar token con Google
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload(); // sub, email, name, picture...
    const provider = 'google';
    const providerId = payload.sub;
    const email = payload.email;
    const name = payload.name || '';

    // 2) Buscar por proveedor
    let u = await repo.findByProvider(provider, providerId);
    if (!u) {
      // 3) Si no existe, buscar por email
      const existing = email ? await repo.findByEmail(email) : null;
      if (existing) {
        await repo.linkProvider(existing.id, provider, providerId);
        u = existing;
      } else {
        // 4) Crear usuario social (password NULL) y link
        const created = await repo.createSocial({ name, email });
        await repo.linkProvider(created.id, provider, providerId);
        u = created;
      }
    }

    const token = sign(u.id);
    return res.json({ token, user: { id: u.id, email: u.email, name: u.name } });
  } catch (e) {
    console.error('ERROR /auth/google:', e);
    return res.status(401).json({ error: 'token inválido' });
  }
});

/* =========================
   Facebook Login
   Body: { accessToken } (o { accessToken, userID })
========================= */
r.post('/facebook', async (req, res) => {
  try {
    const { accessToken } = req.body || {};
    if (!accessToken) return res.status(400).json({ error: 'falta accessToken' });

    // 1) Consultar Graph API: id, name, email
    const url = `https://graph.facebook.com/me?fields=id,name,email&access_token=${encodeURIComponent(accessToken)}`;
    const resp = await fetch(url);
    if (!resp.ok) return res.status(401).json({ error: 'token inválido' });

    const data = await resp.json(); // { id, name, email? }
    const provider = 'facebook';
    const providerId = data.id;
    const email = data.email || null;
    const name = data.name || '';

    // 2) Buscar por proveedor
    let u = await repo.findByProvider(provider, providerId);
    if (!u) {
      // 3) Si no existe, buscar por email
      const existing = email ? await repo.findByEmail(email) : null;
      if (existing) {
        await repo.linkProvider(existing.id, provider, providerId);
        u = existing;
      } else {
        // 4) Crear usuario social y link
        const created = await repo.createSocial({ name, email });
        await repo.linkProvider(created.id, provider, providerId);
        u = created;
      }
    }

    const token = sign(u.id);
    return res.json({ token, user: { id: u.id, email: u.email, name: u.name } });
  } catch (e) {
    console.error('ERROR /auth/facebook:', e);
    return res.status(401).json({ error: 'token inválido' });
  }
});

module.exports = r;