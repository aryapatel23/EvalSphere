const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const userService = require("../services/user.service");

const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    throw new ApiError(400, "name, email, password and role are required");
  }

  const user = await userService.createUser({ name, email, password, role });
  return sendResponse(res, 201, "User created successfully", user);
});

const getMyProfile = asyncHandler(async (req, res) => {
  const profile = await userService.getProfile(req.user.id);
  return sendResponse(res, 200, "User profile fetched", profile);
});

module.exports = {
  createUser,
  getMyProfile,
};
