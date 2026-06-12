const prisma = require("../prisma/client");

const getLeaderboard = async (hackathonId) => {
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
      team: {
        select: {
          id: true,
          name: true,
        },
      },
      finalScore: true,
      scores: {
        select: {
          id: true,
          judgeId: true,
          innovation: true,
          uiux: true,
          impact: true,
          feasibility: true,
          weightedScore: true,
        },
      },
    },
    orderBy: {
      finalScore: {
        totalScore: "desc",
      },
    },
  });

  return projects.map((project, index) => ({
    rank: project.finalScore?.rank || index + 1,
    projectId: project.id,
    projectTitle: project.title,
    team: project.team,
    totalScore: project.finalScore?.totalScore || 0,
    scoreBreakdown: project.scores,
  }));
};

module.exports = {
  getLeaderboard,
};
