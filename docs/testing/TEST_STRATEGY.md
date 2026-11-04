# Testing Strategy

## Philosophy

- **Test Pyramid**: 70% unit, 20% integration, 10% E2E
- **Shift Left**: Test early, test often, automate everything
- **Confidence over Coverage**: Focus on critical paths, not line count
- **Fast Feedback**: Unit tests < 1s, Integration < 30s, E2E < 5min

## Test Types

### Unit Tests
- **Scope**: Pure functions, utilities, hooks, business logic
- **Location**: Co-located with source (`*.test.ts`)
- **Tools**: Vitest / Jest
- **Mocking**: Minimal — prefer pure functions; mock only external boundaries (DB, APIs, time)
- **Naming**: `describe` → module/function, `it` → behavior

### Integration Tests
- **Scope**: API routes, service interactions, database operations
- **Location**: `tests/integration/`
- **Tools**: Vitest + Testcontainers (PostgreSQL, Redis)
- **Fixtures**: Shared test database with transaction rollback per test
- **Coverage**: All API endpoints, critical service workflows

### End-to-End Tests
- **Scope**: Critical user journeys (auth, matching, learning)
- **Location**: `tests/e2e/`
- **Tools**: Playwright
- **Environment**: Dedicated staging-like environment
- **Data**: Seeded test accounts, isolated per test run

### Contract Tests
- **Scope**: API contracts between frontend/backend, external APIs
- **Tools**: Pact (provider-driven) or OpenAPI validation
- **Run**: In CI on every PR

### Performance Tests
- **Scope**: API latency under load, database query performance
- **Tools**: k6
- **Schedule**: Nightly, + on release branches

## Test Data Management

- **Factories**: Use `factory-girl` style builders for test entities
- **Fixtures**: Minimal, realistic datasets in `tests/fixtures/`
- **Cleanup**: Transaction rollback (unit/integration), dedicated DB per E2E run
- **PII**: Never use real user data; generate synthetic

## CI Integration

```yaml
# .github/workflows/ci.yml
jobs:
  test:
    steps:
      - pnpm test:unit        # ~30s
      - pnpm test:integration # ~2min
      - pnpm test:e2e         # ~5min (on merge/main)
      - pnpm test:contract    # ~1min
```

## Quality Gates

| Metric           | Threshold | Enforced |
|-----------------|-----------|----------|
| Unit coverage   | ≥ 80%     | PR block |
| Integration cov | ≥ 60%     | PR block |
| E2E pass rate   | 100%      | Merge block |
| TypeScript      | 0 errors  | PR block |
| ESLint          | 0 errors  | PR block |

## Flaky Test Policy

- Quarantine immediately (skip + create issue)
- Fix within 5 business days or remove
- Track flakiness rate in dashboard

## Test Documentation

- `tests/e2e/TEST_CASES.md` — Catalog of E2E scenarios
- `tests/integration/README.md` — Integration test patterns
- Inline comments for complex test setups

## Tools Summary

| Category          | Tool              |
|------------------|-------------------|
| Unit/Integration | Vitest            |
| E2E              | Playwright        |
| Contract         | Pact              |
| Load             | k6                |
| DB (test)        | Testcontainers    |
| Mocking          | MSW (API), vi.fn  |
| Coverage         | c8 / Istanbul     |