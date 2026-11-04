# Company Constitution

Welcome to sabo-mutu! This document outlines the foundational principles and guidelines for all team members.

## Our Values

- **Quality over speed** — We prioritize delivering robust, well-tested code over rushed deployments.
- **Transparency** — Communication is open, honest, and frequent.
- **Continuous learning** — Every team member is encouraged to grow and share knowledge.
- **Respect** — Everyone deserves a respectful and inclusive environment.

## Code Standards

- Follow the coding conventions documented in `docs/CONSTITUTION.md` and the style guides per repository.
- Write clean, maintainable, and documented code.
- Use feature flags or configuration toggles for new functionality during development.

## Commit Style

- Keep commits focused and meaningful. One commit per logical change.
- Avoid committing secrets, credentials, or large binaries unless absolutely necessary.
- Use conventional commit messages where applicable (e.g., `feat: add new feature`).

## Pull Requests

- All changes must go through a pull request review process.
- At least one peer review is required before merging.
- Automated checks (linting, type checking, tests) must pass before approval.

## Environment

- Development, staging, and production environments are separate.
- Never commit `.env` files to the repository. Use `.env.example` as a template.
- Configure environment variables via CI/CD pipelines or local `.env` files, never in source code.

## Contribution

We welcome contributions from the community. See `docs/onboarding.md` for contribution guidelines.
