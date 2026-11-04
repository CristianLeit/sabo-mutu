# Onboarding Specification

## Purpose

This document describes the onboarding flow for new users, developers, and clients of the sabo-mutu platform.

## User Onboarding

### Welcome Flow

1. **Landing Page** — Clear value proposition, primary CTA ("Get Started")
2. **Account Creation** — Email/password or OAuth (Google, GitHub, LinkedIn)
3. **Email Verification** — One-time code sent to registered email
4. **Profile Setup** — Role selection (Professional, Company, Recruiter)
5. **Skills & Preferences** — Multi-step wizard:
   - Professional skills (tech stack, domain expertise)
   - Career preferences (remote, hybrid, on-site; salary range; industries)
   - Learning goals (upskilling areas, certifications)

### Progressive Profiling

- Minimal required fields upfront to reduce friction
- Optional detailed sections prompted contextually
- Smart defaults based on role selection

### Guided Tour

- Interactive walkthrough of key features
- Tooltips on first visit to each major section
- Skip option always available

## Developer Onboarding

### Repository Setup

```bash
# Clone
git clone <repository-url>

# Install dependencies (pnpm workspace)
pnpm install

# Configure environment
cp .env.example .env
# Edit .env with local values

# Start development
pnpm dev
```

### Architecture Overview

- `apps/web` — Next.js frontend
- `apps/api` — Express backend
- `packages/core` — Shared types, utilities, hooks

### Development Workflow

1. Create feature branch from `main`
2. Implement changes with tests
3. Run lint, type-check, and tests locally
4. Open Pull Request
5. Pass CI checks + peer review
6. Merge via squash

## Client Onboarding

### Discovery Phase

- Initial consultation call
- Requirements gathering document
- Technical assessment of existing systems

### Implementation Phase

- Sprint planning with client stakeholders
- Regular demo sessions (bi-weekly)
- Dedicated Slack channel for communication

### Handoff Phase

- Documentation delivery (architecture, runbooks)
- Knowledge transfer sessions
- 30-day support window post-launch