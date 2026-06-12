const prisma = require("../prisma/client");
const ApiError = require("../utils/apiError");
const { logActivity, notifyUser } = require("./activity.service");

const createJob = async ({
  companyId,
  title,
  description,
  requirements,
  salaryOrStipend,
  location,
  type,
  competitionId,
}) => {
  if (competitionId) {
    const competition = await prisma.competition.findUnique({ where: { id: competitionId } });
    if (!competition) {
      throw new ApiError(404, "Competition not found");
    }
  }

  const job = await prisma.job.create({
    data: {
      companyId,
      title,
      description,
      requirements,
      salaryOrStipend,
      location,
      type,
      competitionId,
    },
    include: {
      company: {
        select: { id: true, name: true, email: true, role: true },
      },
      competition: {
        select: { id: true, title: true, type: true },
      },
    },
  });

  await logActivity({
    actorId: companyId,
    type: "JOB",
    action: "job.created",
    metadata: { jobId: job.id },
  });

  return job;
};

const listJobs = async ({ type, search, isActive = true }) => {
  return prisma.job.findMany({
    where: {
      type: type || undefined,
      isActive: isActive === undefined ? undefined : isActive,
      OR: search
        ? [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
            { requirements: { contains: search, mode: "insensitive" } },
          ]
        : undefined,
    },
    include: {
      company: {
        select: { id: true, name: true, role: true },
      },
      _count: {
        select: { applications: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

const applyToJob = async ({ jobId, userId, resumeUrl, coverLetter }) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.role !== "PARTICIPANT") {
    throw new ApiError(403, "Only participants can apply to jobs");
  }

  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job || !job.isActive) {
    throw new ApiError(404, "Job not found or no longer active");
  }

  const application = await prisma.jobApplication.upsert({
    where: {
      jobId_userId: {
        jobId,
        userId,
      },
    },
    update: {
      resumeUrl,
      coverLetter,
      status: "APPLIED",
    },
    create: {
      jobId,
      userId,
      resumeUrl,
      coverLetter,
    },
  });

  await notifyUser({
    userId: job.companyId,
    type: "JOB",
    title: "New job application received",
    message: `A participant applied to your job #${job.id}.`,
    payload: { jobId: job.id, applicationId: application.id },
  });

  await logActivity({
    actorId: userId,
    type: "JOB",
    action: "job.applied",
    metadata: { jobId, applicationId: application.id },
  });

  return application;
};

const listApplicationsForJob = async ({ jobId }) => {
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  return prisma.jobApplication.findMany({
    where: { jobId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          skills: true,
          resumeUrl: true,
          githubUrl: true,
          linkedinUrl: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

const updateApplicationStatus = async ({ jobId, applicationId, status, actorId }) => {
  const application = await prisma.jobApplication.findFirst({
    where: { id: applicationId, jobId },
  });

  if (!application) {
    throw new ApiError(404, "Application not found for this job");
  }

  const updated = await prisma.jobApplication.update({
    where: { id: applicationId },
    data: { status },
  });

  await notifyUser({
    userId: application.userId,
    type: "JOB",
    title: "Application status updated",
    message: `Your application status is now ${status}.`,
    payload: { jobId, applicationId, status },
  });

  await logActivity({
    actorId,
    type: "JOB",
    action: "application.status.updated",
    metadata: { jobId, applicationId, status },
  });

  return updated;
};

module.exports = {
  createJob,
  listJobs,
  applyToJob,
  listApplicationsForJob,
  updateApplicationStatus,
};
