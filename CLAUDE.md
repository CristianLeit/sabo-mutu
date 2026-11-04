
# Learning Path — Project Instructions

## Project Objective

Build a free, adaptive learning platform that connects:
1. Professional goals.
2. Real market requirements.
3. User knowledge assessment.
4. Personalized learning roadmaps.
5. Evidence-based learning progress.

## Development Principles

- Use TypeScript as the primary language.
- Prefer simple, modular and testable solutions.
- Use a modular monolith architecture.
- Keep business logic independent from UI, database and AI providers.
- Never invent market data or learning results.
- Never present recommendations as guaranteed employment outcomes.
- Do not introduce unnecessary abstractions or dependencies.

## AI Development Workflow

For every task:

1. Inspect the existing code and documentation.
2. Identify the exact scope.
3. Prepare a small implementation plan.
4. Identify affected files and dependencies.
5. Define acceptance criteria.
6. Implement only the requested task.
7. Add or update automated tests.
8. Run relevant tests and type checking.
9. Review the Git diff.
10. Report evidence of completion.

## Task Restrictions

- Never implement multiple unrelated tasks at once.
- Never modify unrelated modules.
- Never remove tests to make a task pass.
- Never fabricate test results.
- Never modify historical data without explicit authorization.
- Ask before adding dependencies that change the architecture.
- Do not commit secrets, API keys or personal data.

## Quality Requirements

- TypeScript strict mode.
- Input validation at application boundaries.
- Business rules must have automated tests.
- API responses must have validated schemas.
- All external AI output must be validated before use.
- Keep errors explicit and observable.

## Testing

Before completing a task:

- Run relevant unit tests.
- Run integration tests when applicable.
- Run type checking.
- Run linting.
- Confirm no unrelated changes were introduced.

## Documentation

Update the relevant documentation when behavior or architecture changes.

Keep ROADMAP.md and STATUS.md synchronized with verified progress.

## Completion Report

Every completed task must report:

- Files changed.
- Behavior implemented.
- Tests executed.
- Actual test results.
- Known limitations.
- Commit hash, when committed.
