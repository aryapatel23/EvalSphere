const express = require("express");
const hackathonController = require("../controllers/hackathon.controller");
const authMiddleware = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const router = express.Router();

router.post("/", authMiddleware, authorize("ORGANIZER", "SUPER_ADMIN"), hackathonController.createHackathon);
router.get("/", authMiddleware, hackathonController.getHackathons);
router.post(
  "/:hackathonId/judges",
  authMiddleware,
  authorize("ORGANIZER", "SUPER_ADMIN"),
  hackathonController.assignJudges
);

module.exports = router;
