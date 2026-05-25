# FanRewards API — Starter Project

This is the starter project for the Belong Backend Developer technical assessment.

## Quick Start

```bash
# 1. Copy env file
cp .env.example .env

# 2. Start PostgreSQL
docker compose up -d

# 3. Install dependencies
npm install

# 4. Generate and run migrations (after implementing entities)
npm run migration:generate src/migrations/Init
npm run migration:run

# 5. Seed the database (after implementing src/seed.ts)
npm run seed

# 6. Start dev server
npm run dev
```

Server runs on http://localhost:3000

## What's Provided

- Project structure with Fastify + TypeScript + TypeORM configured
- Docker Compose with PostgreSQL (dev + test databases)
- Empty entity, route, service, and seed placeholders for you to implement
- TypeScript strict mode enabled

## What You Need to Build

See the [full assessment README](../README.md) for detailed requirements.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript |
| `npm start` | Run compiled output |
| `npm run migration:run` | Run database migrations |
| `npm run seed` | Seed database with sample data |
| `npm test` | Run tests |
| `npm run test:coverage` | Run tests with coverage |
