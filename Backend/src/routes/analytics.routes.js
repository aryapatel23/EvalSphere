const express = require("express");
const analyticsController = require("../controllers/analytics.controller");
const authMiddleware = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const router = express.Router();

router.get(
  "/:hackathonId",
  authMiddleware,
  authorize("ORGANIZER", "SUPER_ADMIN"),
  analyticsController.getHackathonAnalytics
);

module.exports = router;
