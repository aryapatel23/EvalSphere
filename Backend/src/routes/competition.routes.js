const express = require("express");
const competitionController = require("../controllers/competition.controller");
const authMiddleware = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  authorize("ORGANIZER", "SUPER_ADMIN"),
  competitionController.createCompetition
);
router.get("/", authMiddleware, competitionController.listCompetitions);
router.get("/:competitionId", authMiddleware, competitionController.getCompetitionById);
router.post(
  "/:competitionId/register",
  authMiddleware,
  authorize("PARTICIPANT"),
  competitionController.registerForCompetition
);
router.post(
  "/:competitionId/criteria",
  authMiddleware,
  authorize("ORGANIZER", "SUPER_ADMIN"),
  competitionController.createCriterion
);

module.exports = router;
