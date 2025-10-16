//es un almacen temporal para probar antes de la bd
const users = [];
exports.findByEmail = (email) => users.find(u => u.email === email) || null;
exports.create = (u) => (users.push(u), u);

const pool = require('./db'); // ← reemplaza repo
r.post('/register', async(req, res) => {
    try {
        const { email, password, name } = req.body || {};
        if (!email || !password) {
            return res.status(400).json({ error: 'faltan datos' });
        }

        // Verificar si el email ya existe
        const exists = await pool.query('SELECT * FROM usuario WHERE email = $1', [email]);
        if (exists.rows.length > 0) return res.status(409).json({ error: 'Email ya existe' });

        // Encriptar contraseña
        const hash = await bcrypt.hash(password, 10);

        // Insertar usuario
        const result = await pool.query(
            'INSERT INTO usuario (email, password, nombre) VALUES ($1, $2, $3) RETURNING id_usuario', [email, hash, name]
        );

        return res.json({ success: true, userId: result.rows[0].id_usuario });
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

        // Buscar usuario
        const result = await pool.query('SELECT * FROM usuario WHERE email = $1', [email]);
        const u = result.rows[0];
        if (!u) return res.status(401).json({ error: 'credenciales' });

        // Comparar contraseña
        const ok = await bcrypt.compare(password, u.password);
        if (!ok) return res.status(401).json({ error: 'credenciales' });

        // Generar token
        const token = jwt.sign({ sub: u.id_usuario },
            process.env.JWT_SECRET || 'dev', { expiresIn: '1d' }
        );

        return res.json({ token, user: { id: u.id_usuario, email: u.email, name: u.nombre } });
    } catch (e) {
        console.error('ERROR /auth/login:', e);
        return res.status(500).json({ error: 'server error' });
    }
});