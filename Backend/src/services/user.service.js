const prisma = require("../prisma/client");
const ApiError = require("../utils/apiError");
const { hashPassword } = require("../utils/password");

const createUser = async ({ name, email, password, role }) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ApiError(409, "Email already in use");
  }

  return prisma.user.create({
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
};

const getProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

module.exports = {
  createUser,
  getProfile,
};
