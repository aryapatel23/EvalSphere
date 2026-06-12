const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const leaderboardService = require("../services/leaderboard.service");

const getLeaderboard = asyncHandler(async (req, res) => {
  const hackathonId = Number(req.params.hackathonId);

  if (!hackathonId) {
    throw new ApiError(400, "Valid hackathonId is required");
  }

  const leaderboard = await leaderboardService.getLeaderboard(hackathonId);
  return sendResponse(res, 200, "Leaderboard fetched", leaderboard);
});

module.exports = {
  getLeaderboard,
};
