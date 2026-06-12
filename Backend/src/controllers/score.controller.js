const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const scoreService = require("../services/score.service");

const submitScore = asyncHandler(async (req, res) => {
  const { projectId, innovation, uiux, impact, feasibility, comment } = req.body;

  if (!projectId && projectId !== 0) {
    throw new ApiError(400, "projectId is required");
  }

  const result = await scoreService.submitScore({
    judgeId: req.user.id,
    projectId: Number(projectId),
    innovation: Number(innovation),
    uiux: Number(uiux),
    impact: Number(impact),
    feasibility: Number(feasibility),
    comment,
  });

  return sendResponse(res, 201, "Score submitted successfully", result);
});

const getProjectScores = asyncHandler(async (req, res) => {
  const projectId = Number(req.params.projectId);

  if (!projectId) {
    throw new ApiError(400, "Valid projectId is required");
  }

  const scores = await scoreService.getProjectScores(projectId);
  return sendResponse(res, 200, "Project scores fetched", scores);
});

module.exports = {
  submitScore,
  getProjectScores,
};
