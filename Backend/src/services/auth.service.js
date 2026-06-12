const prisma = require("../prisma/client");
const crypto = require("crypto");
const config = require("../config");
const ApiError = require("../utils/apiError");
const { generateToken } = require("../utils/jwt");
const { hashPassword, comparePassword } = require("../utils/password");

const issueRefreshToken = async (userId) => {
  const token = crypto.randomBytes(48).toString("hex");
  const expiresAt = new Date(Date.now() + config.refreshTokenDays * 24 * 60 * 60 * 1000);

  await prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });

  return token;
};

const register = async ({ name, email, password, role }) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ApiError(409, "Email already in use");
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: await hashPassword(password),
      role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  const token = generateToken({ userId: user.id, role: user.role });
  const refreshToken = await issueRefreshToken(user.id);

  return { user, token, accessToken: token, refreshToken };
};

const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isMatch = await comparePassword(password, user.password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = generateToken({ userId: user.id, role: user.role });
  const refreshToken = await issueRefreshToken(user.id);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
    token,
    accessToken: token,
    refreshToken,
  };
};

const refreshAccessToken = async ({ refreshToken }) => {
  if (!refreshToken) {
    throw new ApiError(400, "refreshToken is required");
  }

  const session = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: true },
  });

  if (!session || session.revokedAt || session.expiresAt < new Date()) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const accessToken = generateToken({ userId: session.user.id, role: session.user.role });

  return {
    accessToken,
    token: accessToken,
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: session.user.role,
    },
  };
};

const logout = async ({ refreshToken }) => {
  if (!refreshToken) {
    throw new ApiError(400, "refreshToken is required");
  }

  await prisma.refreshToken.updateMany({
    where: {
      token: refreshToken,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });

  return { loggedOut: true };
};

module.exports = {
  register,
  login,
  refreshAccessToken,
  logout,
};
