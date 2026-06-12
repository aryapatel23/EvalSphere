const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const hiringService = require("../services/hiring.service");

const createHiringInterest = asyncHandler(async (req, res) => {
  const { companyName, projectId } = req.body;

  if (!companyName || !projectId) {
    throw new ApiError(400, "companyName and projectId are required");
  }

  const interest = await hiringService.createHiringInterest({
    companyName,
    projectId: Number(projectId),
  });

  return sendResponse(res, 201, "Hiring interest recorded", interest);
});

const getTopTeamsForHiring = asyncHandler(async (req, res) => {
  const hackathonId = Number(req.params.hackathonId);
  const limit = req.query.limit ? Number(req.query.limit) : 10;

  if (!hackathonId) {
    throw new ApiError(400, "Valid hackathonId is required");
  }

  const topTeams = await hiringService.getTopTeamsForHiring(hackathonId, limit);
  return sendResponse(res, 200, "Top teams fetched for hiring", topTeams);
});

const shortlistParticipant = asyncHandler(async (req, res) => {
  const { candidateId, projectId, notes } = req.body;

  if (!candidateId) {
    throw new ApiError(400, "candidateId is required");
  }

  const shortlist = await hiringService.shortlistParticipant({
    companyId: req.user.id,
    candidateId: Number(candidateId),
    projectId: projectId ? Number(projectId) : null,
    notes: notes || null,
  });

  return sendResponse(res, 201, "Participant shortlisted", shortlist);
});

const getMyShortlistedCandidates = asyncHandler(async (req, res) => {
  const list = await hiringService.getMyShortlistedCandidates(req.user.id);
  return sendResponse(res, 200, "Shortlisted candidates fetched", list);
});

module.exports = {
  createHiringInterest,
  getTopTeamsForHiring,
  shortlistParticipant,
  getMyShortlistedCandidates,
};
