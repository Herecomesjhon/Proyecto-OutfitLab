const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Si algún día prefieres variables separadas, descomenta:
  // host: process.env.DB_HOST,
  // port: process.env.DB_PORT,
  // user: process.env.DB_USER,
  // password: process.env.DB_PASS,
  // database: process.env.DB_NAME,
});

pool.on('connect', () => console.log('✅ Conectado a PostgreSQL'));
pool.on('error', (err) => {
  console.error('❌ Error de PG:', err);
  process.exit(1);
});

module.exports = pool;
