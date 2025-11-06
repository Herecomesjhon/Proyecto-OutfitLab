// routes/items.routes.js
const path = require('path');
const { Router } = require('express');
const upload = require('../lib/multer');                 // <- tu multer
const { uploadItem, listByUser, listAll } = require('../controllers/items.controller');

const router = Router();

// Subida de imagen (FormData)
router.post('/upload', upload.single('image'), uploadItem);

// Listar prendas por usuario
router.get('/user/:userId', listByUser);

// (Opcional) Listar todas para debug
router.get('/', listAll);

module.exports = router;
