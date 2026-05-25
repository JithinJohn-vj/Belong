# Backend Developer Technical Assessment

## Project: "FanRewards API"

Build a simplified fan rewards API that demonstrates the core backend patterns used in Belong's platform. We've provided a starter project with the barebones to get you going.

---

## Belong Backend Infrastructure Analysis

### **Tech Stack:**

- **Runtime:** Node.js with TypeScript (strict mode)
- **Framework:** Fastify
- **ORM:** TypeORM with PostgreSQL
- **Authentication:** JWT (access + refresh tokens)
- **Validation:** JSON Schema / Typebox
- **Testing:** Jest + Supertest
- **Infrastructure:** Docker Compose for local development

### **Key Patterns:**

- **Route Architecture:** Fastify plugin-based route registration with schema validation
- **Service Layer:** Business logic separated from route handlers
- **Entity Design:** TypeORM entities with relations, migrations, and repository pattern
- **Middleware:** Authentication guards, rate limiting, request logging
- **Error Handling:** Centralized error handler with typed error codes

---

## Requirements

### 1. Core Features

Build a REST API with these resources:

- **Auth** — Register, login, refresh tokens, logout
- **Users** — Profile retrieval and update
- **Challenges** — CRUD for music challenges (listen-to-earn tasks)
- **Rewards** — Track points earned, redeem rewards, view history
- **Leaderboard** — Ranked list of top fans by points

### 2. Technical Architecture Requirements

#### Entity Design:

Design and implement the following TypeORM entities with appropriate column types, relations, and constraints:

- **User** — email (unique), password hash, total points, display name, timestamps
- **Challenge** — title, artist, description, points value, duration in seconds, difficulty (easy/medium/hard), active status, timestamp
- **ChallengeCompletion** — links a user to a challenge, tracks points earned and listen duration percentage, timestamp
- **Reward** — name, description, points cost, availability status
- **RewardRedemption** — links a user to a reward, tracks points spent, status (pending/fulfilled/cancelled), timestamp

Set up proper relations between entities (e.g. a user has many completions, a challenge has many completions, etc.).

#### Route Architecture:

```typescript
// Fastify plugin-based route registration
// All routes should use JSON Schema validation

// Auth routes (public)
POST   /api/auth/register        // Create account
POST   /api/auth/login            // Get access + refresh tokens
POST   /api/auth/refresh          // Refresh access token
POST   /api/auth/logout           // Invalidate refresh token

// User routes (authenticated)
GET    /api/users/me              // Get current user profile
PATCH  /api/users/me              // Update profile
GET    /api/users/me/stats        // Points, completions, redemptions summary

// Challenge routes (authenticated)
GET    /api/challenges            // List challenges (paginated, filterable)
GET    /api/challenges/:id        // Get challenge detail
POST   /api/challenges/:id/complete  // Mark challenge as completed

// Reward routes (authenticated)
GET    /api/rewards               // List available rewards
POST   /api/rewards/:id/redeem    // Redeem a reward (deduct points)
GET    /api/rewards/history       // User's redemption history

// Leaderboard routes (authenticated)
GET    /api/leaderboard           // Top fans ranked by points (paginated)
GET    /api/leaderboard/me        // Current user's rank
```

#### Service Layer:

Separate business logic from route handlers. Implement services for:

- **AuthService** — registration, login, token refresh, logout
- **ChallengeService** — list (paginated/filterable), get by ID, complete a challenge
- **RewardService** — list available rewards, redeem a reward, get redemption history
- **LeaderboardService** — get top fans ranked by points, get a user's rank

#### Authentication:

Implement JWT-based authentication with:

- **Access tokens** — short-lived, used to authenticate API requests
- **Refresh tokens** — long-lived, used to obtain new access tokens
- **Auth guard** — middleware that protects routes and identifies the current user
- **Password security** — hash passwords before storing

### 3. API Design Standards

#### Request/Response Format:

```typescript
// All responses follow a consistent envelope

// Success
{
  "data": { ... },
  "meta": { "page": 1, "limit": 20, "total": 42 }  // for paginated endpoints
}

// Error
{
  "error": {
    "code": "INSUFFICIENT_POINTS",
    "message": "You need 50 more points to redeem this reward"
  }
}

// Use proper HTTP status codes:
// 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized,
// 403 Forbidden, 404 Not Found, 409 Conflict, 422 Unprocessable Entity
```

#### Validation:

All endpoints should validate input. Use JSON Schema or Typebox for request validation in Fastify.

### 4. Business Rules

#### A) Challenge Completion

- Points are awarded based on how much of the challenge the user listened to (listen duration percentage, 0-100)
- Minimum **80% listen** required to earn full points
- Below 80%, partial credit is awarded proportionally
- A user can complete the same challenge multiple times (each is a separate record)
- The user's total points should be updated accordingly

#### B) Reward Redemption

- A user spends points to redeem a reward
- The user must have enough points — if not, return an error
- Points are deducted and a redemption record is created
- Consider what happens if multiple requests come in at the same time for the same user

#### C) Leaderboard

- Returns fans ranked by total points, with pagination
- Should handle ties gracefully

#### D) Seed Data

```typescript
// Seed challenges using Belong's sample tracks
const SEED_CHALLENGES = [
  {
    title: 'All Night',
    artist: 'Camo & Krooked',
    description: 'Listen to this drum & bass classic to earn points',
    points: 150,
    durationSeconds: 219,
    difficulty: 'easy' as const,
  },
  {
    title: 'New Forms',
    artist: 'Roni Size',
    description: 'Complete this legendary track for bonus points',
    points: 300,
    durationSeconds: 464,
    difficulty: 'medium' as const,
  },
  {
    title: 'Extended Session',
    artist: 'Camo & Krooked',
    description: 'A longer listening challenge for dedicated fans',
    points: 500,
    durationSeconds: 600,
    difficulty: 'hard' as const,
  },
];

const SEED_REWARDS = [
  {
    name: 'Early Access Pass',
    description: 'Get early access to new features',
    pointsCost: 200,
  },
  {
    name: 'Exclusive Playlist',
    description: 'Unlock a curated artist playlist',
    pointsCost: 500,
  },
  {
    name: 'VIP Fan Badge',
    description: 'Show off your dedication with a VIP badge',
    pointsCost: 1000,
  },
  {
    name: 'Concert Ticket Raffle',
    description: 'Enter a raffle for concert tickets',
    pointsCost: 2500,
  },
];
```

### 5. Project Structure

```
backend/test-app/
├── src/
│   ├── config/
│   │   └── index.ts              # Environment config (DB, JWT secrets, etc.)
│   ├── entities/
│   │   ├── User.ts
│   │   ├── Challenge.ts
│   │   ├── ChallengeCompletion.ts
│   │   ├── Reward.ts
│   │   └── RewardRedemption.ts
│   ├── services/
│   │   ├── AuthService.ts
│   │   ├── ChallengeService.ts
│   │   ├── RewardService.ts
│   │   └── LeaderboardService.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── users.ts
│   │   ├── challenges.ts
│   │   ├── rewards.ts
│   │   └── leaderboard.ts
│   ├── middleware/
│   │   └── auth.ts               # JWT auth guard
│   ├── plugins/
│   │   └── db.ts                 # TypeORM Fastify plugin
│   ├── types/
│   │   └── index.ts              # Shared types and interfaces
│   └── app.ts                    # Fastify app setup
├── docker-compose.yml            # PostgreSQL for local dev
├── package.json
├── tsconfig.json
└── README.md
```

### 6. Setup Instructions

#### Setup and Run:

```bash
# 1. Start PostgreSQL
docker compose up -d

# 2. Install dependencies
npm install

# 3. Generate and run migrations (after you've implemented the entities)
npm run migration:generate src/migrations/Init
npm run migration:run

# 4. Seed the database (after you've implemented src/seed.ts)
npm run seed

# 5. Start the dev server
npm run dev

# Server runs on http://localhost:3000
```

#### Run Tests:

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage
```

### Bonus Features (Extra Credit)

#### Advanced Backend Features:

- Rate limiting
- Request logging with correlation IDs
- Health check endpoint with DB connectivity status
- Swagger/OpenAPI documentation auto-generated from schemas
- Database query optimization with EXPLAIN analysis

#### Enhanced Security:

- Refresh token rotation (invalidate old token on refresh)
- Account lockout after failed login attempts
- CORS configuration for specific origins
- Helmet headers and content security policy
- API key authentication for admin endpoints

#### Advanced Architecture:

- Event-driven challenge completion (emit events on completion)
- Caching
- Background job for leaderboard recalculation
- Graceful shutdown handling
- Database connection pooling tuning
- Security measures and considerations

### Submission Requirements

#### Deliverables:

1. **Your own GitHub Repository** (public or private with access granted to `Belong-dev`) with clean commit history — do NOT open a pull request on this repo
2. **README.md** with setup and run instructions
3. **ARCHITECTURE.md** explaining design decisions
4. **ai_use_description.md** — You're welcome to use any AI tools during this assessment. If you do, include this file describing which tools you used, how you used them, and why. Be honest — we value how you leverage AI as a force multiplier, not whether you used it.
5. **Demo Video** (3-4 minutes) — walk us through your project, show it running, and highlight what you're most proud of

#### Before Submitting:

- [ ] Setup instructions in your README work from a clean clone
- [ ] All endpoints function as described
- [ ] Auth flow works end-to-end
- [ ] TypeScript compiles with no errors

#### Timeline:

- **Initial submission:** Take the time you need — we care about what you build, not how long you spent. Most candidates submit within a week.
- **Code review session:** 1 hour technical discussion
- **Follow-up questions:** Architecture and scaling discussions

### Assessment Questions

During code review, we'll discuss:

1. **Architecture:** "Walk me through your service layer. Why separate services from route handlers?"

2. **Development and AI Strategies:** "How do you use tools and AI configurations in your development workflow?"

3. **Database Design:** "How did you decide on the entity relations? What indexes would you add at scale?"

4. **Security:** "Explain your token refresh flow. How do you handle token theft?"

5. **Concurrency:** "What happens if two users redeem the last reward simultaneously? Show me how you handle it."

6. **Performance:** "How would you optimize the leaderboard for 1M users?"

7. **Testing:** "What's your strategy for testing the auth flow end-to-end?"

8. **Scaling:** "How would you evolve this API to support microservices? What would you extract first?"

9. **Error Handling:** "Walk me through what happens when the database is unavailable. How does the API respond?"

---

## Getting Started

**New to this assessment?** Start here:

### **Starter Code:**

- **[Starter Project](./test-app/)** — Ready-to-use project structure with configs

### **Assessment Materials:**

```
backend/
├── test-app/              # Starter project structure
└── README.md              # This file (detailed requirements)
```

### **Support:**

Questions during development? Email **careers@getbelong.app** — we want you to succeed!

Good luck building the future of fandom!
