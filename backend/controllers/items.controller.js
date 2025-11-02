const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// POST /api/items  (multipart/form-data)
exports.createItem = async (req, res) => {
  try {
    const { name, description, brand, color, size, season, category, tags } = req.body;

    if (!name) return res.status(400).json({ error: "name es requerido" });

    // Conecta/crea categoría por nombre
    let cat = null;
    if (category) {
      cat = await prisma.category.upsert({
        where: { name: category },
        update: {},
        create: { name: category },
      });
    }

    const item = await prisma.item.create({
      data: {
        name,
        description: description || null,
        brand: brand || null,
        color: color || null,
        size: size || null,
        season: season || null,
        categoryId: cat?.id || null,
      },
    });

    // Imagen (opcional)
    if (req.file) {
      await prisma.image.create({
        data: {
          url: `/uploads/${req.file.filename}`,
          mime: req.file.mimetype,
          itemId: item.id,
        },
      });
    }

    // Tags (opcional) como "casual,algodón"
    if (tags) {
      const list = tags.split(",").map(t => t.trim()).filter(Boolean);
      for (const t of list) {
        const tag = await prisma.tag.upsert({ where: { name: t }, update: {}, create: { name: t } });
        await prisma.itemTag.create({ data: { itemId: item.id, tagId: tag.id } });
      }
    }

    const full = await prisma.item.findUnique({
      where: { id: item.id },
      include: { images: true, category: true, tags: { include: { tag: true } } },
    });

    res.status(201).json(full);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "No se pudo crear la prenda" });
  }
};

// POST /api/items/:id/images  (multipart/form-data)
exports.addImage = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) return res.status(400).json({ error: "Falta imagen" });

    const img = await prisma.image.create({
      data: { url: `/uploads/${req.file.filename}`, mime: req.file.mimetype, itemId: id },
    });
    res.status(201).json(img);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "No se pudo guardar la imagen" });
  }
};

// GET /api/items?q=&category=&size=&color=&tag=
exports.listItems = async (req, res) => {
  try {
    const { q, category, size, color, tag } = req.query;

    const where = {
      AND: [
        q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { brand: { contains: q, mode: "insensitive" } }] } : {},
        size ? { size: { equals: size, mode: "insensitive" } } : {},
        color ? { color: { equals: color, mode: "insensitive" } } : {},
        category ? { category: { name: { equals: category, mode: "insensitive" } } } : {},
        tag ? { tags: { some: { tag: { name: { equals: tag, mode: "insensitive" } } } } } : {},
      ],
    };

    const items = await prisma.item.findMany({
      where,
      include: { images: true, category: true, tags: { include: { tag: true } } },
      orderBy: { createdAt: "desc" },
    });

    res.json(items);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "No se pudo listar" });
  }
};
