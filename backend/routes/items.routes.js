const express = require("express");
const upload = require("../lib/multer");
const Ctrl = require("../controllers/items.controller");

const router = express.Router();

router.get("/", Ctrl.listItems);
router.post("/", upload.single("image"), Ctrl.createItem);
router.post("/:id/images", upload.single("image"), Ctrl.addImage);

module.exports = router;
