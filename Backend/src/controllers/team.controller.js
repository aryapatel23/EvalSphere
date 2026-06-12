const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const teamService = require("../services/team.service");

const createTeam = asyncHandler(async (req, res) => {
  const { name, hackathonId, memberIds } = req.body;

  if (!name || !hackathonId) {
    throw new ApiError(400, "name and hackathonId are required");
  }

  const team = await teamService.createTeam({
    name,
    hackathonId: Number(hackathonId),
    creatorUserId: req.user.id,
    memberIds: Array.isArray(memberIds) ? memberIds.map(Number) : [],
  });

  return sendResponse(res, 201, "Team created successfully", team);
});

const joinTeam = asyncHandler(async (req, res) => {
  const teamId = Number(req.params.teamId);
  if (!teamId) {
    throw new ApiError(400, "Valid teamId is required");
  }

  const membership = await teamService.joinTeam({ teamId, userId: req.user.id });
  return sendResponse(res, 200, "Joined team successfully", membership);
});

const getTeams = asyncHandler(async (req, res) => {
  const hackathonId = req.query.hackathonId ? Number(req.query.hackathonId) : undefined;
  const teams = await teamService.listTeams(hackathonId);
  return sendResponse(res, 200, "Teams fetched", teams);
});

module.exports = {
  createTeam,
  joinTeam,
  getTeams,
};
