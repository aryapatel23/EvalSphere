const express = require("express");
const adminController = require("../controllers/admin.controller");
const authMiddleware = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const router = express.Router();

router.get(
  "/governance-logs",
  authMiddleware,
  authorize("SUPER_ADMIN"),
  adminController.getGovernanceLogs
);
router.get(
  "/activity-logs",
  authMiddleware,
  authorize("SUPER_ADMIN"),
  adminController.getActivityLogs
);

module.exports = router;
