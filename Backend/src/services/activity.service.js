const prisma = require("../prisma/client");

const logActivity = async ({ actorId = null, type, action, metadata = null }) => {
  return prisma.activityLog.create({
    data: {
      actorId,
      type,
      action,
      metadata,
    },
  });
};

const logGovernance = async ({ actorId = null, action, targetType, targetId = null, details = null }) => {
  return prisma.governanceLog.create({
    data: {
      actorId,
      action,
      targetType,
      targetId,
      details,
    },
  });
};

const notifyUser = async ({ userId, type = "SYSTEM", title, message, payload = null }) => {
  return prisma.notification.create({
    data: {
      userId,
      type,
      title,
      message,
      payload,
    },
  });
};

module.exports = {
  logActivity,
  logGovernance,
  notifyUser,
};
