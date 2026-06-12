const prisma = require("../prisma/client");
const ApiError = require("../utils/apiError");
const { logActivity, logGovernance } = require("./activity.service");

const createCompetition = async ({
  organizerId,
  title,
  description,
  type,
  visibility,
  status,
  rules,
  bannerImage,
  faqs,
  prizeDetails,
  registrationStart,
  registrationEnd,
  submissionDeadline,
  evaluationStart,
  evaluationEnd,
  resultAnnouncement,
  maxTeamSize,
  eligibilityCriteria,
}) => {
  const competition = await prisma.competition.create({
    data: {
      organizerId,
      title,
      description,
      type,
      visibility,
      status,
      rules,
      bannerImage,
      faqs,
      prizeDetails,
      registrationStart: registrationStart ? new Date(registrationStart) : null,
      registrationEnd: registrationEnd ? new Date(registrationEnd) : null,
      submissionDeadline: submissionDeadline ? new Date(submissionDeadline) : null,
      evaluationStart: evaluationStart ? new Date(evaluationStart) : null,
      evaluationEnd: evaluationEnd ? new Date(evaluationEnd) : null,
      resultAnnouncement: resultAnnouncement ? new Date(resultAnnouncement) : null,
      maxTeamSize,
      eligibilityCriteria,
    },
    include: {
      organizer: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
  });

  await logActivity({
    actorId: organizerId,
    type: "COMPETITION",
    action: "competition.created",
    metadata: { competitionId: competition.id },
  });

  return competition;
};

const listCompetitions = async ({ type, status, visibility, search }) => {
  return prisma.competition.findMany({
    where: {
      type: type || undefined,
      status: status || undefined,
      visibility: visibility || undefined,
      title: search
        ? {
            contains: search,
            mode: "insensitive",
          }
        : undefined,
    },
    include: {
      organizer: {
        select: { id: true, name: true, email: true, role: true },
      },
      _count: {
        select: {
          registrations: true,
          criteria: true,
          judgeAssignments: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

const getCompetitionById = async (competitionId) => {
  const competition = await prisma.competition.findUnique({
    where: { id: competitionId },
    include: {
      organizer: {
        select: { id: true, name: true, email: true, role: true },
      },
      criteria: true,
      registrations: {
        include: {
          user: {
            select: { id: true, name: true, email: true, role: true, skills: true },
          },
        },
      },
      judgeAssignments: {
        include: {
          judge: {
            select: { id: true, name: true, email: true, role: true },
          },
        },
      },
    },
  });

  if (!competition) {
    throw new ApiError(404, "Competition not found");
  }

  return competition;
};

const registerForCompetition = async ({ competitionId, userId }) => {
  const competition = await prisma.competition.findUnique({ where: { id: competitionId } });
  if (!competition) {
    throw new ApiError(404, "Competition not found");
  }

  if (competition.registrationEnd && new Date() > competition.registrationEnd) {
    throw new ApiError(400, "Registration has ended for this competition");
  }

  const registration = await prisma.competitionRegistration.upsert({
    where: {
      competitionId_userId: {
        competitionId,
        userId,
      },
    },
    update: {},
    create: {
      competitionId,
      userId,
    },
  });

  await logActivity({
    actorId: userId,
    type: "COMPETITION",
    action: "competition.registered",
    metadata: { competitionId, registrationId: registration.id },
  });

  return registration;
};

const createCriterion = async ({ competitionId, key, name, description, weight, maxScore, actorId }) => {
  const competition = await prisma.competition.findUnique({ where: { id: competitionId } });
  if (!competition) {
    throw new ApiError(404, "Competition not found");
  }

  const criterion = await prisma.criterion.create({
    data: {
      competitionId,
      key,
      name,
      description,
      weight,
      maxScore,
    },
  });

  await logGovernance({
    actorId,
    action: "criterion.created",
    targetType: "Criterion",
    targetId: String(criterion.id),
    details: { competitionId },
  });

  return criterion;
};

module.exports = {
  createCompetition,
  listCompetitions,
  getCompetitionById,
  registerForCompetition,
  createCriterion,
};
