const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();
const SALT_ROUNDS = 12;

async function main() {
  await prisma.governanceLog.deleteMany();
  await prisma.activityLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.jobApplication.deleteMany();
  await prisma.job.deleteMany();
  await prisma.companyShortlist.deleteMany();
  await prisma.scoreAuditLog.deleteMany();
  await prisma.scoreCriterion.deleteMany();
  await prisma.projectHistory.deleteMany();
  await prisma.teamInvite.deleteMany();
  await prisma.competitionJudgeAssignment.deleteMany();
  await prisma.competitionRegistration.deleteMany();
  await prisma.criterion.deleteMany();
  await prisma.competition.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.hiringInterest.deleteMany();
  await prisma.finalScore.deleteMany();
  await prisma.score.deleteMany();
  await prisma.judgeAssignment.deleteMany();
  await prisma.project.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.team.deleteMany();
  await prisma.hackathon.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash("Pass@123", SALT_ROUNDS);

  const [superAdmin, organizer, company, judge1, judge2, p1, p2, p3, p4, p5] = await Promise.all([
    prisma.user.create({ data: { name: "Super Admin", email: "superadmin@evalsphere.com", password, role: "SUPER_ADMIN" } }),
    prisma.user.create({ data: { name: "Organizer One", email: "organizer@evalsphere.com", password, role: "ORGANIZER" } }),
    prisma.user.create({ data: { name: "TalentBridge Inc", email: "company@evalsphere.com", password, role: "COMPANY" } }),
    prisma.user.create({ data: { name: "Judge One", email: "judge1@evalsphere.com", password, role: "JUDGE" } }),
    prisma.user.create({ data: { name: "Judge Two", email: "judge2@evalsphere.com", password, role: "JUDGE" } }),
    prisma.user.create({ data: { name: "Participant One", email: "p1@evalsphere.com", password, role: "PARTICIPANT" } }),
    prisma.user.create({ data: { name: "Participant Two", email: "p2@evalsphere.com", password, role: "PARTICIPANT" } }),
    prisma.user.create({ data: { name: "Participant Three", email: "p3@evalsphere.com", password, role: "PARTICIPANT" } }),
    prisma.user.create({ data: { name: "Participant Four", email: "p4@evalsphere.com", password, role: "PARTICIPANT" } }),
    prisma.user.create({ data: { name: "Participant Five", email: "p5@evalsphere.com", password, role: "PARTICIPANT" } }),
  ]);

  const hackathon = await prisma.hackathon.create({
    data: {
      title: "EvalSphere Transparency Hack 2026",
      description: "A hackathon focused on transparent and explainable judging.",
      rules: "Projects must include source code and demo.",
      organizerId: organizer.id,
      status: "ACTIVE",
      startDate: new Date("2026-04-01T00:00:00.000Z"),
      endDate: new Date("2026-05-01T00:00:00.000Z"),
      innovationWeight: 0.35,
      uiuxWeight: 0.2,
      impactWeight: 0.25,
      feasibilityWeight: 0.2,
    },
  });

  await prisma.judgeAssignment.createMany({
    data: [
      { judgeId: judge1.id, hackathonId: hackathon.id },
      { judgeId: judge2.id, hackathonId: hackathon.id },
    ],
  });

  const teamA = await prisma.team.create({ data: { name: "Team Alpha", hackathonId: hackathon.id, leaderId: p1.id, inviteCode: "ALPHA2026" } });
  const teamB = await prisma.team.create({ data: { name: "Team Beta", hackathonId: hackathon.id, leaderId: p3.id, inviteCode: "BETA2026" } });

  await prisma.teamMember.createMany({
    data: [
      { userId: p1.id, teamId: teamA.id },
      { userId: p2.id, teamId: teamA.id },
      { userId: p3.id, teamId: teamB.id },
      { userId: p4.id, teamId: teamB.id },
      { userId: p5.id, teamId: teamB.id },
    ],
  });

  const projectA = await prisma.project.create({
    data: {
      teamId: teamA.id,
      title: "FairScore AI",
      description: "Explainable judging assistant for hackathon evaluations.",
      githubLink: "https://github.com/example/fairscore-ai",
      demoLink: "https://demo.example.com/fairscore-ai",
    },
  });

  const projectB = await prisma.project.create({
    data: {
      teamId: teamB.id,
      title: "JudgeLens",
      description: "Transparent rubric-driven project scoring platform.",
      githubLink: "https://github.com/example/judgelens",
      demoLink: "https://demo.example.com/judgelens",
    },
  });

  const weights = {
    innovation: 0.35,
    uiux: 0.2,
    impact: 0.25,
    feasibility: 0.2,
  };

  const weighted = (s) =>
    Number(
      (
        s.innovation * weights.innovation +
        s.uiux * weights.uiux +
        s.impact * weights.impact +
        s.feasibility * weights.feasibility
      ).toFixed(4)
    );

  const scoreA1 = { innovation: 9, uiux: 8, impact: 9, feasibility: 8, comment: "Strong innovation and high impact." };
  const scoreA2 = { innovation: 8, uiux: 8, impact: 8, feasibility: 9, comment: "Well-rounded project with practical implementation." };
  const scoreB1 = { innovation: 8, uiux: 9, impact: 8, feasibility: 8, comment: "Great UI and a compelling idea." };
  const scoreB2 = { innovation: 7, uiux: 8, impact: 8, feasibility: 8, comment: "Solid solution with room for deeper novelty." };

  await prisma.score.createMany({
    data: [
      { projectId: projectA.id, judgeId: judge1.id, ...scoreA1, weightedScore: weighted(scoreA1) },
      { projectId: projectA.id, judgeId: judge2.id, ...scoreA2, weightedScore: weighted(scoreA2) },
      { projectId: projectB.id, judgeId: judge1.id, ...scoreB1, weightedScore: weighted(scoreB1) },
      { projectId: projectB.id, judgeId: judge2.id, ...scoreB2, weightedScore: weighted(scoreB2) },
    ],
  });

  const projectAScore = Number(((weighted(scoreA1) + weighted(scoreA2)) / 2).toFixed(4));
  const projectBScore = Number(((weighted(scoreB1) + weighted(scoreB2)) / 2).toFixed(4));

  await prisma.finalScore.createMany({
    data: [
      { projectId: projectA.id, totalScore: projectAScore, rank: projectAScore >= projectBScore ? 1 : 2 },
      { projectId: projectB.id, totalScore: projectBScore, rank: projectBScore > projectAScore ? 1 : 2 },
    ],
  });

  await prisma.hiringInterest.create({
    data: {
      companyName: "TalentBridge Inc",
      companyId: company.id,
      projectId: projectA.id,
    },
  });

  const competition = await prisma.competition.create({
    data: {
      organizerId: organizer.id,
      title: "Global Transparent Hiring Challenge",
      description: "Competition combining project challenge with direct hiring evaluation.",
      type: "HIRING_CHALLENGE",
      status: "ACTIVE",
      visibility: "PUBLIC",
      rules: "All participants must submit complete demo and repo.",
      registrationStart: new Date("2026-04-01T00:00:00.000Z"),
      registrationEnd: new Date("2026-06-01T00:00:00.000Z"),
      submissionDeadline: new Date("2026-06-10T00:00:00.000Z"),
      evaluationStart: new Date("2026-06-11T00:00:00.000Z"),
      evaluationEnd: new Date("2026-06-20T00:00:00.000Z"),
      resultAnnouncement: new Date("2026-06-25T00:00:00.000Z"),
      maxTeamSize: 5,
      eligibilityCriteria: "Open to global participants aged 18+",
    },
  });

  await prisma.criterion.createMany({
    data: [
      { competitionId: competition.id, key: "innovation", name: "Innovation", description: "Novelty and uniqueness", weight: 0.3, maxScore: 10 },
      { competitionId: competition.id, key: "uiux", name: "UI/UX", description: "User experience quality", weight: 0.2, maxScore: 10 },
      { competitionId: competition.id, key: "impact", name: "Impact", description: "Real world impact", weight: 0.3, maxScore: 10 },
      { competitionId: competition.id, key: "feasibility", name: "Feasibility", description: "Implementation feasibility", weight: 0.2, maxScore: 10 },
    ],
  });

  await prisma.competitionRegistration.createMany({
    data: [
      { competitionId: competition.id, userId: p1.id },
      { competitionId: competition.id, userId: p2.id },
      { competitionId: competition.id, userId: p3.id },
    ],
  });

  await prisma.competitionJudgeAssignment.createMany({
    data: [
      { competitionId: competition.id, judgeId: judge1.id },
      { competitionId: competition.id, judgeId: judge2.id },
    ],
  });

  const job = await prisma.job.create({
    data: {
      companyId: company.id,
      competitionId: competition.id,
      type: "FULL_TIME",
      title: "Backend Engineer - Eval Platforms",
      description: "Build scalable competition and hiring infrastructure.",
      requirements: "Node.js, PostgreSQL, system design",
      location: "Remote",
      salaryOrStipend: "$20k-$35k",
      isActive: true,
    },
  });

  const application = await prisma.jobApplication.create({
    data: {
      jobId: job.id,
      userId: p1.id,
      resumeUrl: "https://cdn.example.com/resumes/p1.pdf",
      coverLetter: "I have built hackathon-scale systems and transparent evaluation workflows.",
      status: "APPLIED",
    },
  });

  await prisma.companyShortlist.create({
    data: {
      companyId: company.id,
      candidateId: p1.id,
      projectId: projectA.id,
      notes: "Strong architecture and communication skills.",
    },
  });

  await prisma.notification.create({
    data: {
      userId: p1.id,
      type: "HIRING",
      title: "Shortlisted by company",
      message: "Your profile has been shortlisted for further hiring discussion.",
      payload: { applicationId: application.id, companyId: company.id },
    },
  });

  await prisma.activityLog.createMany({
    data: [
      { actorId: organizer.id, type: "COMPETITION", action: "competition.seeded", metadata: { competitionId: competition.id } },
      { actorId: company.id, type: "JOB", action: "job.seeded", metadata: { jobId: job.id } },
      { actorId: company.id, type: "HIRING", action: "candidate.shortlisted.seeded", metadata: { candidateId: p1.id } },
    ],
  });

  await prisma.governanceLog.create({
    data: {
      actorId: superAdmin.id,
      action: "seed.initialized",
      targetType: "System",
      targetId: "evalsphere",
      details: { version: "v2" },
    },
  });

  console.log("Seeded EvalSphere sample data");
  console.log(`Super Admin: ${superAdmin.email}`);
  console.log(`Company: ${company.email}`);
  console.log("Default password for seeded users: Pass@123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
