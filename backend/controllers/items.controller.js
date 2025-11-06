// controllers/items.controller.js
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Crea una prenda (Item) con imagen y tags opcionales.
 * Campos esperados (multipart/form-data):
 * - name (string)
 * - notes (string opcional)
 * - tags (string opcional, separadas por comas: "casual,verde")
 * - image (file)
 */
exports.createItem = async (req, res) => {
  try {
    const userId = req.user?.sub || req.user?.id || req.userId; // ya tienes auth; ajusta si usas otro campo
    if (!userId) return res.status(401).json({ error: 'No autorizado' });

    const { name, notes, tags } = req.body;
    if (!name) return res.status(400).json({ error: 'name es requerido' });

    // ruta pública a la imagen
    const imgRelPath = req.file ? `/uploads/${req.file.filename}` : null;

    // Crea/encuentra tags (si mandan "casual,verde,verano")
    let tagConnections = [];
    if (tags && tags.trim()) {
      const list = tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      // upsert de tags por nombre
      const tagRecords = await Promise.all(
        list.map(n =>
          prisma.tag.upsert({
            where: { name: n },
            update: {},
            create: { name: n },
          })
        )
      );
      tagConnections = tagRecords.map(t => ({ id: t.id }));
    }

    // Crea el item
    const item = await prisma.item.create({
      data: {
        name,
        notes: notes || null,
        imageUrl: imgRelPath,    // Asegúrate que en tu schema el campo exista (string/nullable)
        userId,                  // Ajusta al nombre real del campo FK a Usuario (p.ej. userId)
        tags: tagConnections.length
          ? { connect: tagConnections } // si tienes m2m directa Item <-> Tag
          : undefined,
      },
      include: { tags: true },
    });

    res.status(201).json(item);
  } catch (err) {
    console.error('createItem error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.listItems = async (req, res) => {
  try {
    const userId = req.user?.sub || req.user?.id || req.userId;
    if (!userId) return res.status(401).json({ error: 'No autorizado' });

    const items = await prisma.item.findMany({
      where: { userId },
      include: { tags: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(items);
  } catch (err) {
    console.error('listItems error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const id = req.params.id;
    // (opcional) valida que el item pertenezca al user
    await prisma.item.delete({ where: { id } });
    res.json({ ok: true });
  } catch (err) {
    console.error('deleteItem error:', err);
    res.status(500).json({ error: err.message });
  }
};

function fullUrl(req, fileName) {
  // http://<host>/uploads/<file>
  return `${req.protocol}://${req.get('host')}/uploads/${fileName}`;
}

// POST /upload (FormData: image, userId, type?, color?)
async function uploadItem(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: 'Falta la imagen' });

    const userId = req.body.userId || req.user?.sub; // acepta de form o del token
    if (!userId) return res.status(400).json({ error: 'Falta userId' });

    const { type, color } = req.body;
    const imageUrl = fullUrl(req, req.file.filename);

    const prenda = await prisma.prenda.create({
      data: {
        userId,                // campo String en tu schema
        user: { connect: { id: userId } }, // asegura relación
        imageUrl,
        type: type || null,
        color: color || null,
      },
      select: { id: true, imageUrl: true, type: true, color: true, userId: true }
    });

    res.json(prenda);
  } catch (err) {
    console.error('uploadItem error:', err);
    res.status(500).json({ error: 'No se pudo guardar la prenda' });
  }
}

// GET /user/:userId
async function listByUser(req, res) {
  try {
    const { userId } = req.params;
    const prendas = await prisma.prenda.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: { id: true, imageUrl: true, type: true, color: true, userId: true },
    });
    res.json(prendas);
  } catch (err) {
    console.error('listByUser error:', err);
    res.status(500).json({ error: 'Error al listar prendas' });
  }
}

// (Opcional) GET / : todas del sistema (útil para debug)
async function listAll(_req, res) {
  const prendas = await prisma.prenda.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(prendas);
}

module.exports = { uploadItem, listByUser, listAll };