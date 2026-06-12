const prisma = require("../prisma/client");
const ApiError = require("../utils/apiError");

const createHackathon = async ({
  title,
  description,
  rules,
  startDate,
  endDate,
  organizerId,
  status,
  weights,
}) => {
  const parsedStart = new Date(startDate);
  const parsedEnd = new Date(endDate);

  if (Number.isNaN(parsedStart.getTime()) || Number.isNaN(parsedEnd.getTime())) {
    throw new ApiError(400, "Invalid startDate or endDate");
  }

  if (parsedStart >= parsedEnd) {
    throw new ApiError(400, "startDate must be before endDate");
  }

  return prisma.hackathon.create({
    data: {
      title,
      description,
      rules,
      organizerId,
      status,
      startDate: parsedStart,
      endDate: parsedEnd,
      innovationWeight: weights?.innovationWeight,
      uiuxWeight: weights?.uiuxWeight,
      impactWeight: weights?.impactWeight,
      feasibilityWeight: weights?.feasibilityWeight,
    },
    include: {
      organizer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

const listHackathons = async () => {
  return prisma.hackathon.findMany({
    include: {
      organizer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      _count: {
        select: {
          teams: true,
          judgeAssignments: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const assignJudges = async (hackathonId, judgeIds) => {
  const hackathon = await prisma.hackathon.findUnique({ where: { id: hackathonId } });
  if (!hackathon) {
    throw new ApiError(404, "Hackathon not found");
  }

  const judges = await prisma.user.findMany({
    where: {
      id: { in: judgeIds },
      role: "JUDGE",
    },
    select: {
      id: true,
    },
  });

  if (judges.length !== judgeIds.length) {
    throw new ApiError(400, "One or more users are not valid judges");
  }

  const result = [];

  for (const judgeId of judgeIds) {
    const assignment = await prisma.judgeAssignment.upsert({
      where: {
        judgeId_hackathonId: {
          judgeId,
          hackathonId,
        },
      },
      update: {},
      create: {
        judgeId,
        hackathonId,
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
    result.push(assignment);
  }

  return result;
};

module.exports = {
  createHackathon,
  listHackathons,
  assignJudges,
};
