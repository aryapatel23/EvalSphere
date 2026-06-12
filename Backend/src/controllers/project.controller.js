const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const projectService = require("../services/project.service");

const submitProject = asyncHandler(async (req, res) => {
  const { teamId, title, description, githubLink, demoLink } = req.body;

  if (!teamId || !title || !description || !githubLink || !demoLink) {
    throw new ApiError(400, "teamId, title, description, githubLink and demoLink are required");
  }

  const project = await projectService.submitProject({
    teamId: Number(teamId),
    userId: req.user.id,
    title,
    description,
    githubLink,
    demoLink,
  });

  return sendResponse(res, 201, "Project submitted successfully", project);
});

const getProjects = asyncHandler(async (req, res) => {
  const hackathonId = req.query.hackathonId ? Number(req.query.hackathonId) : undefined;
  const projects = await projectService.listProjects(hackathonId);
  return sendResponse(res, 200, "Projects fetched", projects);
});

module.exports = {
  submitProject,
  getProjects,
};
