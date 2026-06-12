const express = require("express");
const transparencyController = require("../controllers/transparency.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/:projectId", authMiddleware, transparencyController.getTransparencyReport);

module.exports = router;
