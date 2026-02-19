// backend/routes/collections.routes.js
const { Router } = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = Router();

/**
 * POST /api/collections
 * Body: { userId, name, description? }
 */
router.post("/", async (req, res) => {
  try {
    const { userId, name, description } = req.body;

    if (!userId || !name) {
      return res
        .status(400)
        .json({ message: "Faltan datos (userId, name)" });
    }

    const collection = await prisma.outfitCollection.create({
      data: {
        userId,
        name,
        description: description || null,
      },
    });

    return res.status(201).json({ collection });
  } catch (err) {
    console.error("Error creando colección:", err);
    return res
      .status(500)
      .json({ message: "Error creando colección" });
  }
});

/**
 * GET /api/collections/user/:userId
 * Devuelve colecciones + sus outfits + prendas (para miniatura y conteo)
 */
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const collections = await prisma.outfitCollection.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
      include: {
        outfits: {
          include: {
            items: {
              include: { prenda: true },
            },
          },
        },
      },
    });

    return res.json({ collections });
  } catch (err) {
    console.error("Error listando colecciones:", err);
    return res
      .status(500)
      .json({ message: "Error listando colecciones" });
  }
});

/**
 * PATCH /api/collections/:id
 * Body: { name?, description? }
 */
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const collection = await prisma.outfitCollection.update({
      where: { id },
      data: {
        name,
        description,
      },
    });

    return res.json({ collection });
  } catch (err) {
    console.error("Error actualizando colección:", err);
    return res
      .status(500)
      .json({ message: "Error actualizando colección" });
  }
});

/**
 * DELETE /api/collections/:id
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.outfitCollection.delete({
      where: { id },
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error("Error eliminando colección:", err);
    return res
      .status(500)
      .json({ message: "Error eliminando colección" });
  }
});

module.exports = router;
