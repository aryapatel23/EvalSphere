const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const competitionService = require("../services/competition.service");

const createCompetition = asyncHandler(async (req, res) => {
  const { title, description, type, visibility, status } = req.body;

  if (!title || !description || !type) {
    throw new ApiError(400, "title, description and type are required");
  }

  const competition = await competitionService.createCompetition({
    ...req.body,
    visibility: visibility || "PUBLIC",
    status: status || "DRAFT",
    organizerId: req.user.id,
  });

  return sendResponse(res, 201, "Competition created successfully", competition);
});

const listCompetitions = asyncHandler(async (req, res) => {
  const { type, status, visibility, search } = req.query;

  const competitions = await competitionService.listCompetitions({
    type,
    status,
    visibility,
    search,
  });

  return sendResponse(res, 200, "Competitions fetched", competitions);
});

const getCompetitionById = asyncHandler(async (req, res) => {
  const competitionId = Number(req.params.competitionId);
  if (!competitionId) {
    throw new ApiError(400, "Valid competitionId is required");
  }

  const competition = await competitionService.getCompetitionById(competitionId);
  return sendResponse(res, 200, "Competition fetched", competition);
});

const registerForCompetition = asyncHandler(async (req, res) => {
  const competitionId = Number(req.params.competitionId);
  if (!competitionId) {
    throw new ApiError(400, "Valid competitionId is required");
  }

  const registration = await competitionService.registerForCompetition({
    competitionId,
    userId: req.user.id,
  });

  return sendResponse(res, 201, "Registered for competition", registration);
});

const createCriterion = asyncHandler(async (req, res) => {
  const competitionId = Number(req.params.competitionId);
  const { key, name, description, weight, maxScore } = req.body;

  if (!competitionId || !key || !name || weight === undefined) {
    throw new ApiError(400, "competitionId, key, name and weight are required");
  }

  const criterion = await competitionService.createCriterion({
    competitionId,
    key,
    name,
    description,
    weight: Number(weight),
    maxScore: maxScore ? Number(maxScore) : 10,
    actorId: req.user.id,
  });

  return sendResponse(res, 201, "Criterion created", criterion);
});

module.exports = {
  createCompetition,
  listCompetitions,
  getCompetitionById,
  registerForCompetition,
  createCriterion,
};
