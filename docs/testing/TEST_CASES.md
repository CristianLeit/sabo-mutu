# E2E Test Cases

This document catalogs the critical user journeys covered by end-to-end tests.

## Authentication

| ID    | Scenario                                  | Priority |
|-------|-------------------------------------------|----------|
| AUTH-01 | User registers with email/password       | P0       |
| AUTH-02 | User registers with OAuth (Google)       | P0       |
| AUTH-03 | User logs in with valid credentials      | P0       |
| AUTH-04 | User logs in with invalid credentials    | P1       |
| AUTH-05 | User requests password reset             | P1       |
| AUTH-06 | User completes password reset            | P1       |
| AUTH-07 | Session persists across browser restart  | P1       |
| AUTH-08 | User logs out                            | P0       |
| AUTH-09 | Protected route redirects to login       | P0       |
| AUTH-10 | Token refresh before expiry              | P1       |

## Career Matcher

| ID    | Scenario                                  | Priority |
|-------|-------------------------------------------|----------|
| MATCH-01 | New user completes onboarding, sees matches | P0    |
| MATCH-02 | User filters matches by location         | P1       |
| MATCH-03 | User filters matches by salary range     | P1       |
| MATCH-04 | User views match breakdown/explanation   | P1       |
| MATCH-05 | User saves a match                       | P1       |
| MATCH-06 | User dismisses a match                   | P1       |
| MATCH-07 | User updates profile, matches refresh    | P0       |
| MATCH-08 | Match score updates after profile edit   | P1       |
| MATCH-09 | Pagination loads more matches            | P2       |
| MATCH-10 | Empty state when no matches              | P1       |

## Market Research

| ID    | Scenario                                  | Priority |
|-------|-------------------------------------------|----------|
| MRKT-01 | User views salary explorer               | P0       |
| MRKT-02 | User filters salary by role/location     | P1       |
| MRKT-03 | User views skill demand trend            | P1       |
| MRKT-04 | User compares industries                 | P2       |
| MRKT-05 | User generates PDF report                | P2       |
| MRKT-06 | Report includes source attribution       | P1       |

## Learning Engine

| ID    | Scenario                                  | Priority |
|-------|-------------------------------------------|----------|
| LEARN-01 | User creates learning path for target role | P0     |
| LEARN-02 | User starts first learning node          | P0       |
| LEARN-03 | User completes node, progress updates    | P0       |
| LEARN-04 | Adaptive assessment adjusts difficulty   | P1       |
| LEARN-05 | User skips node, path adapts             | P1       |
| LEARN-06 | Mastery radar updates after assessment   | P1       |
| LEARN-07 | User modifies goal, path recalculates    | P1       |
| LEARN-08 | Daily agenda shows next recommended node | P2       |
| LEARN-09 | Content player syncs progress            | P1       |
| LEARN-10 | User completes path, sees celebration    | P2       |

## Profile & Settings

| ID    | Scenario                                  | Priority |
|-------|-------------------------------------------|----------|
| PROF-01 | User edits profile (skills, preferences) | P0       |
| PROF-02 | User uploads avatar                      | P2       |
| PROF-03 | User changes notification preferences    | P2       |
| PROF-04 | User deletes account                     | P1       |
| PROF-05 | User exports data (GDPR)                 | P2       |

## Cross-cutting

| ID    | Scenario                                  | Priority |
|-------|-------------------------------------------|----------|
| XC-01  | Responsive layout (mobile/tablet/desktop) | P0       |
| XC-02  | Dark/light theme toggle                  | P2       |
| XC-03  | Error boundary catches render errors     | P1       |
| XC-04  | Offline indicator + sync on reconnect    | P2       |
| XC-05  | Accessibility (keyboard nav, ARIA)       | P1       |

## Test Data Requirements

Each test should:
- Use unique test users (format: `e2e-test-{uuid}@sabo-mutu.test`)
- Clean up created data in `afterEach`/`afterAll`
- Run in isolated test database
- Complete within 60 seconds

## Running Tests

```bash
# All E2E tests
pnpm test:e2e

# Specific test file
pnpm test:e2e -- tests/e2e/auth.spec.ts

# Headed mode for debugging
pnpm test:e2e -- --headed

# Update snapshots
pnpm test:e2e -- --update-snapshots
```