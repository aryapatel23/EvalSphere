const express = require("express");

const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const hackathonRoutes = require("./hackathon.routes");
const teamRoutes = require("./team.routes");
const projectRoutes = require("./project.routes");
const scoreRoutes = require("./score.routes");
const leaderboardRoutes = require("./leaderboard.routes");
const transparencyRoutes = require("./transparency.routes");
const analyticsRoutes = require("./analytics.routes");
const hiringRoutes = require("./hiring.routes");
const competitionRoutes = require("./competition.routes");
const jobRoutes = require("./job.routes");
const notificationRoutes = require("./notification.routes");
const adminRoutes = require("./admin.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/hackathon", hackathonRoutes);
router.use("/team", teamRoutes);
router.use("/project", projectRoutes);
router.use("/score", scoreRoutes);
router.use("/leaderboard", leaderboardRoutes);
router.use("/transparency", transparencyRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/hiring", hiringRoutes);
router.use("/competitions", competitionRoutes);
router.use("/jobs", jobRoutes);
router.use("/notifications", notificationRoutes);
router.use("/admin", adminRoutes);

module.exports = router;
