const express = require("express");
const notificationController = require("../controllers/notification.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/me", authMiddleware, notificationController.listMyNotifications);
router.patch("/:notificationId/read", authMiddleware, notificationController.markNotificationRead);

module.exports = router;
