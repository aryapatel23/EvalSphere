const express = require("express");
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const router = express.Router();

router.post("/", authMiddleware, authorize("SUPER_ADMIN"), userController.createUser);
router.get("/me", authMiddleware, userController.getMyProfile);

module.exports = router;
