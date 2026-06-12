const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const analyticsService = require("../services/analytics.service");

const getHackathonAnalytics = asyncHandler(async (req, res) => {
  const hackathonId = Number(req.params.hackathonId);

  if (!hackathonId) {
    throw new ApiError(400, "Valid hackathonId is required");
  }

  const analytics = await analyticsService.getHackathonAnalytics(hackathonId);
  return sendResponse(res, 200, "Hackathon analytics fetched", analytics);
});

module.exports = {
  getHackathonAnalytics,
};
