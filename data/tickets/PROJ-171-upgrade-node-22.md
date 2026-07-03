# PROJ-171: Upgrade runtime to Node.js 22 LTS

**Type:** Chore / Tech Debt
**Priority:** Medium
**Status:** To Do
**Assignee:** Sergii Bondar
**Reporter:** Platform Team
**Created:** 2026-06-20
**Sprint:** Sprint 25

## Description

We are currently running Node.js 20, which moves to maintenance mode later this
year. Upgrade the application and CI pipeline to Node.js 22 LTS to stay on a
supported runtime and pick up performance improvements.

## Scope

- Update `.nvmrc` and `engines` in `package.json` to Node 22.
- Update the Dockerfile base image to `node:22`.
- Update the GitHub Actions workflow matrix.
- Verify all dependencies are compatible; bump any that are not.

## Acceptance Criteria

- [ ] Full test suite passes on Node 22 (`npm run test` and `npm run test:e2e`).
- [ ] Docker image builds and starts successfully.
- [ ] CI is green on the new version.

## Risks

Some native dependencies may need rebuilding. Test the Docker build early.
