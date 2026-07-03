# Engineering Onboarding Guide

Welcome to the team! This guide will help you get set up and productive during
your first two weeks. If anything here is out of date or unclear, please open a
pull request against this file — keeping onboarding fresh is everyone's
responsibility.

## Your First Day

1. Make sure you have access to the following systems (your manager or IT will
   send invites):
   - Email and calendar
   - Slack (join `#engineering`, `#dev-help`, `#incidents`, and your team channel)
   - GitHub organization
   - Jira (or our issue tracker) and Confluence
   - The password manager (1Password) and SSO
   - VPN access, if you'll be connecting to internal resources
2. Complete the mandatory HR and security compliance training.
3. Find a buddy. Every new hire is paired with an onboarding buddy for their
   first month — reach out and schedule a 30-minute intro call.
4. Read through this wiki, especially the [Coding Standarts](./coding-standarts.md)
   and the [Deploy Runbook](./deploy-runbook.md).

## Who to Talk To

| Need                        | Who                                |
| --------------------------- | ---------------------------------- |
| Access and accounts         | IT / `#it-support`                 |
| Where does this code live?  | Your onboarding buddy or team lead |
| Product questions           | Product Manager for your squad     |
| Incident / production issue | On-call engineer, `#incidents`     |
| HR, payroll, time off       | People Ops                         |

## Development Environment Setup

### Prerequisites

- **Node.js** — use the version pinned in `.nvmrc` (install via [nvm](https://github.com/nvm-sh/nvm)
  or [nvm-windows](https://github.com/coreybutler/nvm-windows)).
- **npm** (bundled with Node). We commit `package-lock.json`, so use `npm ci`
  for reproducible installs.
- **Git** configured with your work email and SSH key added to GitHub.
- A code editor. Most of the team uses **VS Code**; recommended extensions are
  listed in `.vscode/extensions.json`.
- **Docker Desktop** for running services locally via `compose.yml`.

### Getting the Code Running

```bash
# 1. Clone the repository
git clone git@github.com:your-org/rag-system-demo.git
cd rag-system-demo

# 2. Install dependencies (clean, lockfile-based install)
npm ci

# 3. Copy the example environment file and fill in secrets
cp .env.example .env

# 4. Start the app in watch mode
npm run start:dev
```

The API will be available at `http://localhost:3000`.

To run the full stack (app + dependencies such as the database) with Docker:

```bash
docker compose up --build
```

### Useful Commands

| Command             | What it does                   |
| ------------------- | ------------------------------ |
| `npm run start:dev` | Start the app in watch mode    |
| `npm run build`     | Compile the project to `dist/` |
| `npm run lint`      | Run ESLint and auto-fix        |
| `npm run format`    | Format code with Prettier      |
| `npm run test`      | Run unit tests                 |
| `npm run test:cov`  | Run tests with coverage        |
| `npm run test:e2e`  | Run end-to-end tests           |

## Tech Stack Overview

- **Language:** TypeScript
- **Framework:** [NestJS](https://nestjs.com/) on Node.js
- **Testing:** Jest (unit + e2e via Supertest)
- **Tooling:** ESLint, Prettier
- **Containerization:** Docker / Docker Compose
- **CI/CD:** GitHub Actions (lint, test, build on every PR)

Take an hour to skim the NestJS docs if you're new to it — understanding
modules, providers, controllers, and dependency injection will make the codebase
much easier to navigate.

## How We Work

- **Sprints** run for two weeks. We hold sprint planning at the start and a
  retrospective at the end.
- **Daily standup** is a short async or live check-in: what you did, what you're
  doing, and any blockers.
- **Issue tracking:** every unit of work has a ticket. Move your ticket across
  the board as you progress and link the PR to it.
- **Definition of Done:** code merged, tests passing, documentation updated, and
  the feature verified in staging.

## Making Your First Contribution

1. Pick a ticket labeled `good first issue` — your buddy can help you choose.
2. Create a branch off `main` following our naming convention (see the
   [Coding Standarts](./coding-standarts.md)).
3. Make your change with tests.
4. Open a pull request, fill out the PR template, and request a review.
5. Address feedback, get an approval, and merge.

Aim to ship a small change to production in your first week — it builds
confidence and validates that your environment and access are all working.

## Security & Data Handling

- Never commit secrets, API keys, or credentials. Use `.env` (git-ignored) and
  the shared secrets manager.
- Follow least-privilege: only request the access you actually need.
- Report anything suspicious to `#security` immediately. It is always better to
  ask than to stay silent.
- Handle customer data according to our data classification policy. When in
  doubt, treat data as confidential.

## Getting Help

You are not expected to know everything. A good rule of thumb: if you've been
stuck for more than 30 minutes, ask. Post in `#dev-help`, tag your buddy, or
drop into the team's office hours. Asking questions early is a sign of a strong
engineer, not a weak one.

Welcome aboard — we're glad you're here. 🎉
