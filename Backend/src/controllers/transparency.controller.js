const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const transparencyService = require("../services/transparency.service");

const getTransparencyReport = asyncHandler(async (req, res) => {
  const projectId = Number(req.params.projectId);

  if (!projectId) {
    throw new ApiError(400, "Valid projectId is required");
  }

  const report = await transparencyService.getTransparencyReport(projectId);
  return sendResponse(res, 200, "Transparency report fetched", report);
});

module.exports = {
  getTransparencyReport,
};
