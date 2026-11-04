# Decisions Log

This document records important decisions made during development, along with the rationale and context.

## Decision 1: Monorepo with pnpm Workspaces
- **Date**: 2026-11-04
- **Decision**: Use pnpm workspaces for monorepo management
- **Rationale**: Efficient dependency sharing, better disk usage, simpler multi-package development

## Decision 2: Tech Stack (Next.js + Express + PostgreSQL)
- **Date**: 2026-10-28
- **Decision**: Next.js for frontend, Express for backend, PostgreSQL for data
- **Rationale**: Existing expertise, mature ecosystem, good performance characteristics

## Decision 3: CI Pipeline with GitHub Actions
- **Date**: 2026-10-20
- **Decision**: GitHub Actions for CI/CD
- **Rationale**: Native integration, free public repos, easy configuration

## Decision 4: Feature Flags for Development
- **Date**: 2026-10-28
- **Decision**: Use feature flags for new functionality
- **Rationale**: Safe rollback, gradual rollout, A/B testing capability
