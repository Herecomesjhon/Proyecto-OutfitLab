const pool = require('./db');

function normEmail(e = '') {
  return e.trim().toLowerCase();
}

async function findByEmail(email) {
  const e = normEmail(email);
  const { rows } = await pool.query(
    'SELECT id_usuario, nombre, email, password FROM usuario WHERE email = $1',
    [e]
  );
  return rows[0] || null;
}

async function create({ nombre, email, passwordHash }) {
  const e = normEmail(email);
  const { rows } = await pool.query(
    `INSERT INTO usuario (nombre, email, password)
     VALUES ($1, $2, $3)
     RETURNING id_usuario, nombre, email`,
    [nombre || null, e, passwordHash]
  );
  return rows[0];
}

module.exports = { findByEmail, create };
