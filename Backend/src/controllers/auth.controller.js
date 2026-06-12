const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const authService = require("../services/auth.service");
const { USER_ROLES } = require("../utils/constants");

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "name, email and password are required");
  }

  if (role && role !== USER_ROLES.PARTICIPANT) {
    throw new ApiError(403, "Public registration is allowed only for PARTICIPANT role");
  }

  const result = await authService.register({
    name,
    email,
    password,
    role: USER_ROLES.PARTICIPANT,
  });
  return sendResponse(res, 201, "Registration successful", result);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "email and password are required");
  }

  const result = await authService.login({ email, password });
  return sendResponse(res, 200, "Login successful", result);
});

const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken: token } = req.body;
  const result = await authService.refreshAccessToken({ refreshToken: token });
  return sendResponse(res, 200, "Access token refreshed", result);
});

const logout = asyncHandler(async (req, res) => {
  const { refreshToken: token } = req.body;
  const result = await authService.logout({ refreshToken: token });
  return sendResponse(res, 200, "Logout successful", result);
});

module.exports = {
  register,
  login,
  refreshToken,
  logout,
};
