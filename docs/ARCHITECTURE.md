# Technical Architecture

## Overview

sabo-mutu uses a monorepo architecture with Next.js for the web application and Express for the API server. The core packages are shared across both applications.

## Repository Layout

```
sabo-mutu/
├── apps/
│   ├── web/           # Next.js frontend application
│   └── api/           # Express backend API server
├── packages/
│   └── core/          # Shared core libraries and utilities
├── tests/
│   └── e2e/           # End-to-end tests
├── docs/              # Documentation
│   ├── specs/         # Feature specifications
│   └── testing/       # Testing strategy and cases
└── .github/
    └── workflows/     # CI/CD pipelines
```

## Tech Stack

| Layer            | Technology                         |
|-----------------|-------------------------------------|
| Frontend        | Next.js, React, TypeScript          |
| Backend API     | Node.js, Express, TypeScript       |
| Database         | PostgreSQL                         |
| Caching         | Redis                              |
| Test Framework  | Jest, Playwright                   |
| Containerization| Docker / Docker Compose             |
| CI/CD           | GitHub Actions                     |

## Directory Structure — `apps/core`

```
apps/
  core/
    src/
      config/
      middleware/
      routes/
      services/
      utils/
    package.json
    tsconfig.json
```

## Directory Structure — `packages/core`

```
packages/
  core/
    src/
      types/
      lib/
      hooks/
    package.json
    tsconfig.json
```

## Communication

- **Frontend ↔ API**: RESTful API with JSON responses.
- **Shared packages**: Imported via local workspace dependencies.
- **Testing**: Unit tests for services, e2e tests for critical user journeys.

## Performance & Scalability

- API runs horizontally scalable behind a load balancer.
- Database connections pooled with PgBouncer.
- Redis used for session management, caching, and rate limiting.
