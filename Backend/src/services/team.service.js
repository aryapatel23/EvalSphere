const prisma = require("../prisma/client");
const ApiError = require("../utils/apiError");

const createTeam = async ({ name, hackathonId, creatorUserId, memberIds = [] }) => {
  const hackathon = await prisma.hackathon.findUnique({ where: { id: hackathonId } });
  if (!hackathon) {
    throw new ApiError(404, "Hackathon not found");
  }

  const ids = Array.from(new Set([creatorUserId, ...memberIds]));

  const existingMembership = await prisma.teamMember.findFirst({
    where: {
      userId: { in: ids },
      team: {
        hackathonId,
      },
    },
  });

  if (existingMembership) {
    throw new ApiError(400, "One or more users are already in a team for this hackathon");
  }

  const users = await prisma.user.findMany({
    where: {
      id: { in: ids },
      role: "PARTICIPANT",
    },
    select: { id: true },
  });

  if (users.length !== ids.length) {
    throw new ApiError(400, "All team members must be valid participants");
  }

  return prisma.team.create({
    data: {
      name,
      hackathonId,
      members: {
        create: ids.map((userId) => ({ userId })),
      },
    },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      },
      hackathon: true,
    },
  });
};

const joinTeam = async ({ teamId, userId }) => {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: {
      hackathon: true,
    },
  });

  if (!team) {
    throw new ApiError(404, "Team not found");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.role !== "PARTICIPANT") {
    throw new ApiError(400, "Only participants can join teams");
  }

  const existingHackathonMembership = await prisma.teamMember.findFirst({
    where: {
      userId,
      team: {
        hackathonId: team.hackathonId,
      },
    },
  });

  if (existingHackathonMembership) {
    throw new ApiError(400, "User is already part of a team in this hackathon");
  }

  return prisma.teamMember.create({
    data: {
      userId,
      teamId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      team: true,
    },
  });
};

const listTeams = async (hackathonId) => {
  return prisma.team.findMany({
    where: hackathonId ? { hackathonId } : undefined,
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
      project: {
        select: {
          id: true,
          title: true,
        },
      },
      hackathon: {
        select: {
          id: true,
          title: true,
          status: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

module.exports = {
  createTeam,
  joinTeam,
  listTeams,
};
