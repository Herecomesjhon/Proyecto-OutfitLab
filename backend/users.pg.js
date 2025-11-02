// backend/users.pg.js
const pool = require('./db');
const cuid = require('cuid');

// ---------- USERS ----------
async function findByEmail(email) {
  const { rows } = await pool.query(
    `SELECT id, name, email, password
     FROM usuario
     WHERE email = $1
     LIMIT 1`,
    [email]
  );
  return rows[0] || null;
}

async function createLocal({ name, email, passwordHash }) {
  const newId = cuid();
  const { rows } = await pool.query(
    `INSERT INTO usuario (id, name, email, password, created_at, updated_at)
     VALUES ($1, $2, $3, $4, NOW(), NOW())
     RETURNING id, name, email`,
    [newId, name, email, passwordHash]
  );
  return rows[0];
}

async function createSocial({ name, email }) {
  const newId = cuid();
  const { rows } = await pool.query(
    `INSERT INTO usuario (id, name, email, password, created_at, updated_at)
     VALUES ($1, $2, $3, NULL, NOW(), NOW())
     RETURNING id, name, email`,
    [newId, name, email]
  );
  return rows[0];
}

// ---------- PROVIDERS (OAuth) ----------
async function findByProvider(provider, providerId) {
  const { rows } = await pool.query(
    `SELECT u.id, u.name, u.email
     FROM auth_providers ap
     JOIN usuario u ON u.id = ap.user_id
     WHERE ap.provider = $1 AND ap.provider_id = $2
     LIMIT 1`,
    [provider, providerId]
  );
  return rows[0] || null;
}

async function linkProvider(userId, provider, providerId) {
  await pool.query(
    `INSERT INTO auth_providers (user_id, provider, provider_id)
     VALUES ($1, $2, $3)
     ON CONFLICT (provider, provider_id) DO NOTHING`,
    [userId, provider, providerId]
  );
  return true;
}

module.exports = {
  findByEmail,
  createLocal,
  createSocial,
  findByProvider,
  linkProvider,
};
