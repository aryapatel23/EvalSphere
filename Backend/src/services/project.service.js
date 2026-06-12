const prisma = require("../prisma/client");
const ApiError = require("../utils/apiError");

const submitProject = async ({ teamId, userId, title, description, githubLink, demoLink }) => {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: {
      members: true,
      project: true,
    },
  });

  if (!team) {
    throw new ApiError(404, "Team not found");
  }

  const isMember = team.members.some((member) => member.userId === userId);
  if (!isMember) {
    throw new ApiError(403, "Only team members can submit a project");
  }

  if (team.project) {
    throw new ApiError(409, "This team has already submitted a project");
  }

  return prisma.project.create({
    data: {
      teamId,
      title,
      description,
      githubLink,
      demoLink,
    },
    include: {
      team: {
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          hackathon: true,
        },
      },
    },
  });
};

const listProjects = async (hackathonId) => {
  return prisma.project.findMany({
    where: hackathonId
      ? {
          team: {
            hackathonId,
          },
        }
      : undefined,
    include: {
      team: {
        include: {
          hackathon: {
            select: {
              id: true,
              title: true,
              status: true,
            },
          },
        },
      },
      finalScore: true,
      _count: {
        select: {
          scores: true,
          hiringInterests: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

module.exports = {
  submitProject,
  listProjects,
};
