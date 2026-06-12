const prisma = require("../prisma/client");
const ApiError = require("../utils/apiError");

const validateCriterionValue = (value, criterion) => {
  if (!Number.isInteger(value) || value < 0 || value > 10) {
    throw new ApiError(400, `${criterion} score must be an integer between 0 and 10`);
  }
};

const getHackathonWeights = async (hackathonId) => {
  const hackathon = await prisma.hackathon.findUnique({
    where: { id: hackathonId },
    select: {
      innovationWeight: true,
      uiuxWeight: true,
      impactWeight: true,
      feasibilityWeight: true,
    },
  });

  if (!hackathon) {
    throw new ApiError(404, "Hackathon not found for scoring");
  }

  return hackathon;
};

const calculateWeightedScore = ({ innovation, uiux, impact, feasibility }, weights) => {
  validateCriterionValue(innovation, "innovation");
  validateCriterionValue(uiux, "uiux");
  validateCriterionValue(impact, "impact");
  validateCriterionValue(feasibility, "feasibility");

  const weightSum =
    weights.innovationWeight +
    weights.uiuxWeight +
    weights.impactWeight +
    weights.feasibilityWeight;

  if (weightSum <= 0) {
    throw new ApiError(500, "Invalid scoring configuration: total weight must be greater than 0");
  }

  const total =
    innovation * weights.innovationWeight +
    uiux * weights.uiuxWeight +
    impact * weights.impactWeight +
    feasibility * weights.feasibilityWeight;

  return Number((total / weightSum).toFixed(4));
};

const recalculateProjectFinalScore = async (projectId) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      team: {
        include: {
          hackathon: true,
        },
      },
      scores: true,
    },
  });

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const totalScore =
    project.scores.length === 0
      ? 0
      : Number(
          (
            project.scores.reduce((sum, score) => sum + score.weightedScore, 0) /
            project.scores.length
          ).toFixed(4)
        );

  await prisma.finalScore.upsert({
    where: { projectId },
    update: { totalScore },
    create: {
      projectId,
      totalScore,
    },
  });

  await updateHackathonRanks(project.team.hackathonId);

  return totalScore;
};

const updateHackathonRanks = async (hackathonId) => {
  const projects = await prisma.project.findMany({
    where: {
      team: {
        hackathonId,
      },
      finalScore: {
        isNot: null,
      },
    },
    include: {
      finalScore: true,
    },
    orderBy: {
      finalScore: {
        totalScore: "desc",
      },
    },
  });

  for (let index = 0; index < projects.length; index += 1) {
    const rank = index + 1;
    await prisma.finalScore.update({
      where: { projectId: projects[index].id },
      data: { rank },
    });
  }
};

module.exports = {
  getHackathonWeights,
  calculateWeightedScore,
  recalculateProjectFinalScore,
  updateHackathonRanks,
};
