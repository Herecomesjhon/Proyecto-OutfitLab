// routes/outfits.routes.js
const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// ================== Multer (subida de fotos) ==================
const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // outfit_ + timestamp + extensión
    const ext = path.extname(file.originalname) || ".jpg";
    cb(null, `outfit_${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

// ================== Helpers ==================
function mapOutfitForClient(outfit) {
  return {
    id: outfit.id,
    userId: outfit.userId,
    name: outfit.name,
    occasion: outfit.occasion,
    dressCode: outfit.dressCode,
    weather: outfit.weather,
    // primera foto (si existe)
    photoUrl: outfit.photos && outfit.photos[0] ? outfit.photos[0].url : null,
    // items: [{ prenda }]
    items:
      outfit.items?.map((it) => ({
        prenda: it.prenda,
      })) ?? [],
  };
}

// ================== Generar outfit sugerido ==================
// POST /api/outfits/generate
router.post("/generate", async (req, res) => {
  try {
    const { userId, occasion, dressCode, weather } = req.body;

    if (!userId) {
      return res
        .status(400)
        .json({ message: "userId es requerido para generar un outfit." });
    }

    // Tomamos las prendas del usuario
    const prendas = await prisma.prenda.findMany({
      where: { userId },
    });

    if (!prendas.length) {
      return res
        .status(400)
        .json({ message: "No tienes prendas suficientes para generar un outfit." });
    }

    // Selección simple: máximo 4 prendas aleatorias
    const shuffled = [...prendas].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(4, shuffled.length));

    const generatedOutfit = {
      id: Date.now(), // id temporal sólo para el frontend
      name: null,
      occasion,
      dressCode,
      weather,
      items: selected.map((p) => ({
        id: p.id,
        imageUrl: p.imageUrl,
        type: p.type,
        color: p.color,
        category: p.category,
        brand: p.brand,
      })),
    };

    return res.json({ outfits: [generatedOutfit] });
  } catch (err) {
    console.error("Error generando outfit:", err);
    return res.status(500).json({
      message: "Error generando outfit",
    });
  }
});

// ================== Crear outfit en BD ==================
// POST /api/outfits
router.post("/", async (req, res) => {
  try {
    const { userId, name, occasion, dressCode, weather, itemIds } = req.body;

    if (!userId || !Array.isArray(itemIds) || itemIds.length === 0) {
      return res
        .status(400)
        .json({ message: "userId e itemIds son requeridos." });
    }

    const outfit = await prisma.outfit.create({
      data: {
        userId,
        name,
        occasion,
        dressCode,
        weather,
        items: {
          create: itemIds.map((prendaId) => ({ prendaId })),
        },
      },
      include: {
        items: {
          include: { prenda: true },
        },
        photos: true,
      },
    });

    return res.status(201).json({
      outfit: mapOutfitForClient(outfit),
    });
  } catch (err) {
    console.error("Error creando outfit:", err);
    return res.status(500).json({
      message: "Error creando outfit",
    });
  }
});

// ================== Listar outfits de un usuario ==================
// GET /api/outfits/user/:userId
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const outfits = await prisma.outfit.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            prenda: true,
          },
        },
        photos: true,
      },
    });

    console.log(
      `[GET] Devolviendo ${outfits.length} outfits para user ${userId}`
    );

    return res.json({
      outfits: outfits.map(mapOutfitForClient),
    });
  } catch (err) {
    console.error("Error listando outfits:", err);
    return res.status(500).json({
      message: "Error listando outfits",
    });
  }
});

// ================== Subir foto de outfit (+ publicar en Explorar) ==================
// POST /api/outfits/:id/photo
router.post("/:id/photo", upload.single("photo"), async (req, res) => {
  try {
    const { id } = req.params;
    const publishToExplore = req.body.publishToExplore === "true";
    const postTitle = req.body.postTitle; // 👈 título opcional

    // outfit con user e items (para usar en ExplorePost)
    const outfit = await prisma.outfit.findUnique({
      where: { id },
      include: {
        items: {
          include: { prenda: true },
        },
        user: true,
        photos: true,
      },
    });

    if (!outfit) {
      return res
        .status(404)
        .json({ ok: false, message: "Outfit no encontrado" });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ ok: false, message: "No se recibió archivo de imagen" });
    }

    // Guardar foto en outfit_photo
    const url = `/uploads/${req.file.filename}`;
    const photo = await prisma.outfitPhoto.create({
      data: {
        outfitId: id,
        url,
      },
    });

    // Si se va a publicar en Explorar, crear ExplorePost
    if (publishToExplore) {
      await prisma.explorePost.create({
        data: {
          outfitId: id,
          userId: outfit.userId,
          title: postTitle || outfit.name || "Outfit sugerido",
          imageUrl: url,
          style: outfit.dressCode || "Casual", // Casual / Formal / Deportivo / etc.
        },
      });
    }

    console.log("Foto subida:", { ok: true, photo });

    return res.status(201).json({
      ok: true,
      photo,
    });
  } catch (err) {
    console.error("Error subiendo foto:", err);
    return res
      .status(500)
      .json({ ok: false, message: "Error subiendo foto" });
  }
});

// Eliminar un outfit completo
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Gracias a onDelete: Cascade en el schema,
    // también se borran OutfitPrenda, OutfitPhoto y ExplorePost relacionados.
    await prisma.outfit.delete({
      where: { id },
    });

    res.json({ ok: true, message: "Outfit eliminado" });
  } catch (err) {
    console.error("Error eliminando outfit:", err);
    res
      .status(500)
      .json({ ok: false, message: "Error eliminando outfit" });
  }
});

module.exports = router;
