const app = require("./app");
const config = require("./config");
const prisma = require("./prisma/client");

const startServer = async () => {
  try {
    await prisma.$connect();

    app.listen(config.port, () => {
      console.log(`EvalSphere backend running on port ${config.port}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer();

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
