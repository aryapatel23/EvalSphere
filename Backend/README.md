# EvalSphere Backend

Production-ready backend for EvalSphere hackathon management and transparent judging platform.

## Stack

- Node.js + Express
- PostgreSQL
- Prisma ORM
- JWT Authentication
- bcrypt password hashing

## Architecture

- src/controllers
- src/routes
- src/services
- src/middleware
- src/prisma
- src/utils
- prisma/schema.prisma
- prisma/seed.js

## Setup

1. Copy `.env.example` to `.env` and update values.
2. Install dependencies:
   - `npm install`
3. Generate Prisma client:
   - `npm run prisma:generate`
4. Run migrations:
   - `npm run prisma:migrate`
5. Seed sample data:
   - `npm run seed`
6. Run server:
   - Development: `npm run dev`
   - Production: `npm start`

## Core API Endpoints

### Auth
- POST /api/auth/register
- POST /api/auth/login

### User
- POST /api/users (SUPER_ADMIN)
- GET /api/users/me

### Hackathon
- POST /api/hackathon
- GET /api/hackathon
- POST /api/hackathon/:hackathonId/judges

### Team
- POST /api/team
- GET /api/team
- POST /api/team/:teamId/join

### Project
- POST /api/project
- GET /api/project

### Score
- POST /api/score
- GET /api/score/:projectId

### Leaderboard
- GET /api/leaderboard/:hackathonId

### Transparency
- GET /api/transparency/:projectId

### Analytics
- GET /api/analytics/:hackathonId

### Hiring
- POST /api/hiring/interest
- GET /api/hiring/top-teams/:hackathonId

## Seeded Users

All seeded users use password: `Pass@123`

- superadmin@evalsphere.com
- organizer@evalsphere.com
- judge1@evalsphere.com
- judge2@evalsphere.com
- p1@evalsphere.com
- p2@evalsphere.com
- p3@evalsphere.com
- p4@evalsphere.com
- p5@evalsphere.com
