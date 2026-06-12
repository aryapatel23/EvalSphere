const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/apiResponse");
const adminService = require("../services/admin.service");

const getGovernanceLogs = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? Number(req.query.limit) : 100;
  const logs = await adminService.getGovernanceLogs({ limit });
  return sendResponse(res, 200, "Governance logs fetched", logs);
});

const getActivityLogs = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? Number(req.query.limit) : 100;
  const type = req.query.type;
  const logs = await adminService.getActivityLogs({ limit, type });
  return sendResponse(res, 200, "Activity logs fetched", logs);
});

module.exports = {
  getGovernanceLogs,
  getActivityLogs,
};
