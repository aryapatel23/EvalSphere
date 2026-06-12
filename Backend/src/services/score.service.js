const prisma = require("../prisma/client");
const ApiError = require("../utils/apiError");
const {
  getHackathonWeights,
  calculateWeightedScore,
  recalculateProjectFinalScore,
} = require("./scoring.service");

const submitScore = async ({
  judgeId,
  projectId,
  innovation,
  uiux,
  impact,
  feasibility,
  comment,
}) => {
  if (!comment || comment.trim().length < 10) {
    throw new ApiError(400, "Judge comment is required and must be at least 10 characters");
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      team: true,
    },
  });

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const assignment = await prisma.judgeAssignment.findUnique({
    where: {
      judgeId_hackathonId: {
        judgeId,
        hackathonId: project.team.hackathonId,
      },
    },
  });

  if (!assignment) {
    throw new ApiError(403, "Judge is not assigned to this hackathon");
  }

  const weights = await getHackathonWeights(project.team.hackathonId);
  const weightedScore = calculateWeightedScore(
    { innovation, uiux, impact, feasibility },
    weights
  );

  const score = await prisma.score.upsert({
    where: {
      projectId_judgeId: {
        projectId,
        judgeId,
      },
    },
    update: {
      innovation,
      uiux,
      impact,
      feasibility,
      comment,
      weightedScore,
    },
    create: {
      projectId,
      judgeId,
      innovation,
      uiux,
      impact,
      feasibility,
      comment,
      weightedScore,
    },
    include: {
      judge: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  const finalScore = await recalculateProjectFinalScore(projectId);

  return { score, finalScore };
};

const getProjectScores = async (projectId) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      team: {
        include: {
          hackathon: true,
        },
      },
      scores: {
        include: {
          judge: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
      finalScore: true,
    },
  });

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return project;
};

module.exports = {
  submitScore,
  getProjectScores,
};
