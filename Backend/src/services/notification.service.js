const prisma = require("../prisma/client");
const ApiError = require("../utils/apiError");

const listMyNotifications = async (userId) => {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

const markNotificationRead = async ({ notificationId, userId }) => {
  const notification = await prisma.notification.findUnique({ where: { id: notificationId } });
  if (!notification || notification.userId !== userId) {
    throw new ApiError(404, "Notification not found");
  }

  return prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });
};

module.exports = {
  listMyNotifications,
  markNotificationRead,
};
