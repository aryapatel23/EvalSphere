const prisma = require("../prisma/client");
const ApiError = require("../utils/apiError");
const { logActivity, notifyUser } = require("./activity.service");

const createHiringInterest = async ({ companyName, projectId }) => {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return prisma.hiringInterest.create({
    data: {
      companyName,
      projectId,
    },
  });
};

const shortlistParticipant = async ({ companyId, candidateId, projectId = null, notes = null }) => {
  const company = await prisma.user.findUnique({ where: { id: companyId } });
  if (!company || !["COMPANY", "ORGANIZER", "SUPER_ADMIN"].includes(company.role)) {
    throw new ApiError(403, "Only company, organizer, or super admin can shortlist candidates");
  }

  const candidate = await prisma.user.findUnique({ where: { id: candidateId } });
  if (!candidate || candidate.role !== "PARTICIPANT") {
    throw new ApiError(404, "Participant candidate not found");
  }

  if (projectId) {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      throw new ApiError(404, "Project not found");
    }
  }

  const shortlist = await prisma.companyShortlist.upsert({
    where: {
      companyId_candidateId_projectId: {
        companyId,
        candidateId,
        projectId,
      },
    },
    update: { notes },
    create: {
      companyId,
      candidateId,
      projectId,
      notes,
    },
  });

  await notifyUser({
    userId: candidateId,
    type: "HIRING",
    title: "You were shortlisted",
    message: "A company has shortlisted your profile for hiring consideration.",
    payload: { shortlistId: shortlist.id, companyId, projectId },
  });

  await logActivity({
    actorId: companyId,
    type: "HIRING",
    action: "candidate.shortlisted",
    metadata: { shortlistId: shortlist.id, candidateId, projectId },
  });

  return shortlist;
};

const getMyShortlistedCandidates = async (companyId) => {
  return prisma.companyShortlist.findMany({
    where: { companyId },
    include: {
      candidate: {
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
      project: {
        select: {
          id: true,
          title: true,
          teamId: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

const getTopTeamsForHiring = async (hackathonId, limit = 10) => {
  const projects = await prisma.project.findMany({
    where: {
      team: {
        hackathonId,
      },
      finalScore: {
        isNot: null,
      },
    },
    include: {
      team: {
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      },
      finalScore: true,
      hiringInterests: true,
    },
    orderBy: {
      finalScore: {
        totalScore: "desc",
      },
    },
    take: Number(limit),
  });

  return projects.map((project) => ({
    projectId: project.id,
    projectTitle: project.title,
    teamId: project.team.id,
    teamName: project.team.name,
    finalScore: project.finalScore?.totalScore || 0,
    rank: project.finalScore?.rank || null,
    participants: project.team.members.map((member) => member.user),
    hiringInterestCount: project.hiringInterests.length,
  }));
};

module.exports = {
  createHiringInterest,
  getTopTeamsForHiring,
  shortlistParticipant,
  getMyShortlistedCandidates,
};
