const express = require("express");
const projectController = require("../controllers/project.controller");
const authMiddleware = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const router = express.Router();

router.post("/", authMiddleware, authorize("PARTICIPANT"), projectController.submitProject);
router.get("/", authMiddleware, projectController.getProjects);

module.exports = router;
