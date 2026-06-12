const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const jobService = require("../services/job.service");

const createJob = asyncHandler(async (req, res) => {
  const { title, description, requirements, type } = req.body;

  if (!title || !description || !requirements || !type) {
    throw new ApiError(400, "title, description, requirements and type are required");
  }

  const job = await jobService.createJob({
    ...req.body,
    competitionId: req.body.competitionId ? Number(req.body.competitionId) : null,
    companyId: req.user.id,
  });

  return sendResponse(res, 201, "Job created successfully", job);
});

const listJobs = asyncHandler(async (req, res) => {
  const { type, search, isActive } = req.query;
  const jobs = await jobService.listJobs({
    type,
    search,
    isActive: isActive === undefined ? true : isActive === "true",
  });

  return sendResponse(res, 200, "Jobs fetched", jobs);
});

const applyToJob = asyncHandler(async (req, res) => {
  const jobId = Number(req.params.jobId);
  if (!jobId) {
    throw new ApiError(400, "Valid jobId is required");
  }

  const application = await jobService.applyToJob({
    jobId,
    userId: req.user.id,
    resumeUrl: req.body.resumeUrl,
    coverLetter: req.body.coverLetter,
  });

  return sendResponse(res, 201, "Applied to job successfully", application);
});

const listApplicationsForJob = asyncHandler(async (req, res) => {
  const jobId = Number(req.params.jobId);
  if (!jobId) {
    throw new ApiError(400, "Valid jobId is required");
  }

  const applications = await jobService.listApplicationsForJob({ jobId });
  return sendResponse(res, 200, "Applications fetched", applications);
});

const updateApplicationStatus = asyncHandler(async (req, res) => {
  const jobId = Number(req.params.jobId);
  const applicationId = Number(req.params.applicationId);
  const { status } = req.body;

  if (!jobId || !applicationId || !status) {
    throw new ApiError(400, "jobId, applicationId and status are required");
  }

  const result = await jobService.updateApplicationStatus({
    jobId,
    applicationId,
    status,
    actorId: req.user.id,
  });

  return sendResponse(res, 200, "Application status updated", result);
});

module.exports = {
  createJob,
  listJobs,
  applyToJob,
  listApplicationsForJob,
  updateApplicationStatus,
};
