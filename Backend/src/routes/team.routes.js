const express = require("express");
const teamController = require("../controllers/team.controller");
const authMiddleware = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const router = express.Router();

router.post("/", authMiddleware, authorize("PARTICIPANT"), teamController.createTeam);
router.get("/", authMiddleware, teamController.getTeams);
router.post("/:teamId/join", authMiddleware, authorize("PARTICIPANT"), teamController.joinTeam);

module.exports = router;
