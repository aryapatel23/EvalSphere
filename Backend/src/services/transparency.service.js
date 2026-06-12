const prisma = require("../prisma/client");
const ApiError = require("../utils/apiError");

const getTransparencyReport = async (projectId) => {
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
      },
      finalScore: true,
    },
  });

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const weights = {
    innovation: project.team.hackathon.innovationWeight,
    uiux: project.team.hackathon.uiuxWeight,
    impact: project.team.hackathon.impactWeight,
    feasibility: project.team.hackathon.feasibilityWeight,
  };

  const explanation = {
    methodology:
      "Each judge gives criterion scores from 0-10. Per-judge weighted score is computed using hackathon-defined criterion weights. Final score is the average of all judge weighted scores.",
    weights,
    judgeCount: project.scores.length,
  };

  return {
    project: {
      id: project.id,
      title: project.title,
      team: {
        id: project.team.id,
        name: project.team.name,
      },
      hackathon: {
        id: project.team.hackathon.id,
        title: project.team.hackathon.title,
      },
    },
    scores: project.scores,
    finalScore: project.finalScore,
    explanation,
  };
};

module.exports = {
  getTransparencyReport,
};
