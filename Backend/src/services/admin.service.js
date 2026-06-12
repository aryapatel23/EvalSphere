const prisma = require("../prisma/client");

const getGovernanceLogs = async ({ limit = 100 }) => {
  return prisma.governanceLog.findMany({
    include: {
      actor: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: Number(limit),
  });
};

const getActivityLogs = async ({ limit = 100, type }) => {
  return prisma.activityLog.findMany({
    where: {
      type: type || undefined,
    },
    include: {
      actor: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: Number(limit),
  });
};

module.exports = {
  getGovernanceLogs,
  getActivityLogs,
};
