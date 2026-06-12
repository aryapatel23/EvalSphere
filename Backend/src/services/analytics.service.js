const prisma = require("../prisma/client");
const ApiError = require("../utils/apiError");

const getHackathonAnalytics = async (hackathonId) => {
  const hackathon = await prisma.hackathon.findUnique({
    where: { id: hackathonId },
    include: {
      teams: {
        include: {
          project: {
            include: {
              finalScore: true,
              scores: true,
            },
          },
          members: true,
        },
      },
      judgeAssignments: true,
    },
  });

  if (!hackathon) {
    throw new ApiError(404, "Hackathon not found");
  }

  const projects = hackathon.teams.map((team) => team.project).filter(Boolean);
  const finalScores = projects
    .map((project) => project.finalScore?.totalScore)
    .filter((score) => typeof score === "number");
  const allScores = projects.flatMap((project) => project.scores);

  const avg = (arr) =>
    arr.length === 0 ? 0 : Number((arr.reduce((sum, x) => sum + x, 0) / arr.length).toFixed(4));

  return {
    hackathon: {
      id: hackathon.id,
      title: hackathon.title,
      status: hackathon.status,
      startDate: hackathon.startDate,
      endDate: hackathon.endDate,
    },
    statistics: {
      totalTeams: hackathon.teams.length,
      totalParticipants: hackathon.teams.reduce((sum, team) => sum + team.members.length, 0),
      totalProjects: projects.length,
      totalJudges: hackathon.judgeAssignments.length,
      totalEvaluations: allScores.length,
      averageFinalScore: avg(finalScores),
      highestFinalScore: finalScores.length ? Math.max(...finalScores) : 0,
      lowestFinalScore: finalScores.length ? Math.min(...finalScores) : 0,
    },
    criteriaAverages: {
      innovation: avg(allScores.map((score) => score.innovation)),
      uiux: avg(allScores.map((score) => score.uiux)),
      impact: avg(allScores.map((score) => score.impact)),
      feasibility: avg(allScores.map((score) => score.feasibility)),
      weightedScore: avg(allScores.map((score) => score.weightedScore)),
    },
    performanceTrend: projects.map((project) => ({
      projectId: project.id,
      projectTitle: project.title,
      judgeCount: project.scores.length,
      averageWeightedScore: avg(project.scores.map((score) => score.weightedScore)),
      finalScore: project.finalScore?.totalScore || 0,
    })),
  };
};

module.exports = {
  getHackathonAnalytics,
};
