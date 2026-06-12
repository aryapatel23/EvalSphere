const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const hackathonService = require("../services/hackathon.service");

const createHackathon = asyncHandler(async (req, res) => {
  const { title, description, rules, startDate, endDate, status, weights } = req.body;

  if (!title || !description || !startDate || !endDate) {
    throw new ApiError(400, "title, description, startDate and endDate are required");
  }

  const hackathon = await hackathonService.createHackathon({
    title,
    description,
    rules,
    startDate,
    endDate,
    status,
    weights,
    organizerId: req.user.id,
  });

  return sendResponse(res, 201, "Hackathon created successfully", hackathon);
});

const getHackathons = asyncHandler(async (_req, res) => {
  const hackathons = await hackathonService.listHackathons();
  return sendResponse(res, 200, "Hackathons fetched", hackathons);
});

const assignJudges = asyncHandler(async (req, res) => {
  const hackathonId = Number(req.params.hackathonId);
  const { judgeIds } = req.body;

  if (!hackathonId || !Array.isArray(judgeIds) || judgeIds.length === 0) {
    throw new ApiError(400, "hackathonId and non-empty judgeIds are required");
  }

  const assignments = await hackathonService.assignJudges(hackathonId, judgeIds.map(Number));
  return sendResponse(res, 200, "Judges assigned successfully", assignments);
});

module.exports = {
  createHackathon,
  getHackathons,
  assignJudges,
};
