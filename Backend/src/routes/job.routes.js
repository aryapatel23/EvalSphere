const express = require("express");
const jobController = require("../controllers/job.controller");
const authMiddleware = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  authorize("COMPANY", "ORGANIZER", "SUPER_ADMIN"),
  jobController.createJob
);
router.get("/", authMiddleware, jobController.listJobs);
router.post("/:jobId/apply", authMiddleware, authorize("PARTICIPANT"), jobController.applyToJob);
router.get(
  "/:jobId/applications",
  authMiddleware,
  authorize("COMPANY", "ORGANIZER", "SUPER_ADMIN"),
  jobController.listApplicationsForJob
);
router.patch(
  "/:jobId/applications/:applicationId",
  authMiddleware,
  authorize("COMPANY", "ORGANIZER", "SUPER_ADMIN"),
  jobController.updateApplicationStatus
);

module.exports = router;
