// const pool = require('./db');

// function normEmail(e = '') {
//   return e.trim().toLowerCase();
// }

// async function findByEmail(email) {
//   const e = normEmail(email);
//   const { rows } = await pool.query(
//     'SELECT id_usuario, nombre, email, password FROM usuario WHERE email = $1',
//     [e]
//   );
//   return rows[0] || null;
// }

// async function create({ nombre, email, passwordHash }) {
//   const e = normEmail(email);
//   const { rows } = await pool.query(
//     `INSERT INTO usuario (nombre, email, password)
//      VALUES ($1, $2, $3)
//      RETURNING id_usuario, nombre, email`,
//     [nombre || null, e, passwordHash]
//   );
//   return rows[0];
// }

// module.exports = { findByEmail, create };

const pool = require('./db');

// --- USERS ---
async function findByEmail(email) {
  const r = await pool.query(
    'SELECT id_usuario AS id, nombre AS name, email, password FROM usuario WHERE email=$1',
    [email]
  );
  return r.rows[0] || null;
}

async function createLocal({ name, email, passwordHash }) {
  const r = await pool.query(
    `INSERT INTO usuario (nombre, email, password)
     VALUES ($1, $2, $3)
     RETURNING id_usuario AS id, nombre AS name, email`,
    [name, email, passwordHash]
  );
  return r.rows[0];
}

// password puede ser NULL para sociales
async function createSocial({ name, email }) {
  const r = await pool.query(
    `INSERT INTO usuario (nombre, email, password)
     VALUES ($1, $2, NULL)
     RETURNING id_usuario AS id, nombre AS name, email`,
    [name, email]
  );
  return r.rows[0];
}

// --- PROVIDERS ---
async function findByProvider(provider, providerId) {
  const r = await pool.query(
    `SELECT u.id_usuario AS id, u.nombre AS name, u.email
     FROM auth_providers ap
     JOIN usuario u ON u.id_usuario = ap.user_id
     WHERE ap.provider = $1 AND ap.provider_id = $2`,
    [provider, providerId]
  );
  return r.rows[0] || null;
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
