const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const notificationService = require("../services/notification.service");

const listMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await notificationService.listMyNotifications(req.user.id);
  return sendResponse(res, 200, "Notifications fetched", notifications);
});

const markNotificationRead = asyncHandler(async (req, res) => {
  const notificationId = Number(req.params.notificationId);
  if (!notificationId) {
    throw new ApiError(400, "Valid notificationId is required");
  }

  const notification = await notificationService.markNotificationRead({
    notificationId,
    userId: req.user.id,
  });

  return sendResponse(res, 200, "Notification marked as read", notification);
});

module.exports = {
  listMyNotifications,
  markNotificationRead,
};
