// Rutas de autenticación: registro y login
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const repo = require('./users.memory');



const r = express.Router();

r.post('/register', async(req, res) => {
    try {
        const { email, password, name } = req.body || {};
        if (!email || !password) {
            return res.status(400).json({ error: 'faltan datos' });
        }
        const exists = repo.findByEmail(email);
        if (exists) return res.status(409).json({ error: 'Email ya existe' });

        const hash = await bcrypt.hash(password, 10);
        repo.create({ id: Date.now().toString(), email, name, passwordHash: hash });
        return res.json({ success: true });
    } catch (e) {
        console.error('ERROR /auth/register:', e);
        return res.status(500).json({ error: 'server error' });
    }
});

r.post('/login', async(req, res) => {
    try {
        const { email, password } = req.body || {};
        if (!email || !password) {
            return res.status(400).json({ error: 'faltan datos' });
        }
        const u = repo.findByEmail(email);
        if (!u) return res.status(401).json({ error: 'credenciales' });

        const ok = await bcrypt.compare(password, u.passwordHash);
        if (!ok) return res.status(401).json({ error: 'credenciales' });

        const token = jwt.sign({ sub: u.id },
            process.env.JWT_SECRET || 'dev', { expiresIn: '1d' }
        );
        return res.json({ token, user: { id: u.id, email: u.email, name: u.name } });
    } catch (e) {
        console.error('ERROR /auth/login:', e);
        return res.status(500).json({ error: 'server error' });
    }
});

module.exports = r;