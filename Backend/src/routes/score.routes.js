const express = require("express");
const scoreController = require("../controllers/score.controller");
const authMiddleware = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const router = express.Router();

router.post("/", authMiddleware, authorize("JUDGE"), scoreController.submitScore);
router.get("/:projectId", authMiddleware, scoreController.getProjectScores);

module.exports = router;
