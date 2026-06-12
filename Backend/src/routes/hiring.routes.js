const express = require("express");
const hiringController = require("../controllers/hiring.controller");
const authMiddleware = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const router = express.Router();

router.post(
  "/interest",
  authMiddleware,
  authorize("ORGANIZER", "SUPER_ADMIN"),
  hiringController.createHiringInterest
);
router.get(
  "/top-teams/:hackathonId",
  authMiddleware,
  authorize("ORGANIZER", "SUPER_ADMIN"),
  hiringController.getTopTeamsForHiring
);
router.post(
  "/shortlist",
  authMiddleware,
  authorize("COMPANY", "ORGANIZER", "SUPER_ADMIN"),
  hiringController.shortlistParticipant
);
router.get(
  "/shortlist",
  authMiddleware,
  authorize("COMPANY", "ORGANIZER", "SUPER_ADMIN"),
  hiringController.getMyShortlistedCandidates
);

module.exports = router;
