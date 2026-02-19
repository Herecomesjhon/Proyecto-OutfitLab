// backend/src/routes/explore.routes.js
const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * GET /api/explore/outfits?style=Tendencias|Casual|Formal|Deportivo
 * Lista las publicaciones de Explorar
 */
router.get("/outfits", async (req, res) => {
  try {
    const { style } = req.query;

    const where =
      style && style !== "Tendencias"
        ? { style: String(style) }
        : {};

    const posts = await prisma.explorePost.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        outfit: {
          include: {
            user: true,
            items: {
              include: {
                prenda: true,
              },
            },
            photos: true,
          },
        },
        user: true,
        likesList: true,                    // 👈 para saber quién dio like
        comments: {
          include: { user: true },          // 👈 comentarios con info de usuario
        },
      },
    });

    return res.json({ ok: true, posts });
  } catch (err) {
    console.error("Error listando explore:", err);
    return res
      .status(500)
      .json({ ok: false, message: "Error listando explore" });
  }
});

/**
 * POST /api/explore/:postId/like
 * Dar like a una publicación
 * body: { userId }
 */
router.post("/:postId/like", async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ ok: false, message: "Falta userId" });
    }

    // ¿Ya existe el like?
    const existing = await prisma.exploreLike.findUnique({
      where: {
        userId_postId: { userId, postId },
      },
    });

    if (existing) {
      return res.json({ ok: true, alreadyLiked: true });
    }

    await prisma.exploreLike.create({
      data: { userId, postId },
    });

    await prisma.explorePost.update({
      where: { id: postId },
      data: { likes: { increment: 1 } },
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error("Error dando like:", err);
    return res.status(500).json({ ok: false, message: "Error dando like" });
  }
});

/**
 * DELETE /api/explore/:postId/like
 * Quitar like
 * body: { userId }
 */
router.delete("/:postId/like", async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ ok: false, message: "Falta userId" });
    }

    await prisma.exploreLike.delete({
      where: {
        userId_postId: { userId, postId },
      },
    });

    await prisma.explorePost.update({
      where: { id: postId },
      data: { likes: { decrement: 1 } },
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error("Error quitando like:", err);
    return res.status(500).json({ ok: false, message: "Error quitando like" });
  }
});

/**
 * POST /api/explore/:postId/comment
 * Crear comentario
 * body: { userId, content }
 */
router.post("/:postId/comment", async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, content } = req.body;

    if (!userId || !content?.trim()) {
      return res
        .status(400)
        .json({ ok: false, message: "Faltan datos para comentar" });
    }

    const comment = await prisma.exploreComment.create({
      data: {
        postId,
        userId,
        content: content.trim(),
      },
      include: {
        user: true,
      },
    });

    return res.json({ ok: true, comment });
  } catch (err) {
    console.error("Error creando comentario:", err);
    return res
      .status(500)
      .json({ ok: false, message: "Error creando comentario" });
  }
});

/**
 * PUT /api/explore/:postId
 * Editar publicación (solo dueño)
 * body: { userId, title?, style? }
 */
router.put("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, title, style } = req.body;

    const post = await prisma.explorePost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({ ok: false, message: "No encontrado" });
    }

    if (post.userId !== userId) {
      return res.status(403).json({ ok: false, message: "No autorizado" });
    }

    const updated = await prisma.explorePost.update({
      where: { id: postId },
      data: {
        title: title ?? post.title,
        style: style ?? post.style,
      },
    });

    return res.json({ ok: true, post: updated });
  } catch (err) {
    console.error("Error editando publicación:", err);
    return res
      .status(500)
      .json({ ok: false, message: "Error editando publicación" });
  }
});

/**
 * DELETE /api/explore/:postId
 * Eliminar publicación (solo dueño)
 * body: { userId }
 */
router.delete("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    const post = await prisma.explorePost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({ ok: false, message: "No encontrado" });
    }

    if (post.userId !== userId) {
      return res.status(403).json({ ok: false, message: "No autorizado" });
    }

    await prisma.explorePost.delete({
      where: { id: postId },
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error("Error eliminando publicación:", err);
    return res
      .status(500)
      .json({ ok: false, message: "Error eliminando publicación" });
  }
});

module.exports = router;
