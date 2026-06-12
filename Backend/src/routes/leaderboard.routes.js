const express = require("express");
const leaderboardController = require("../controllers/leaderboard.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/:hackathonId", authMiddleware, leaderboardController.getLeaderboard);

module.exports = router;
