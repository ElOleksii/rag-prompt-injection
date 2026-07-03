# Deploy Book

Owner: Platrform team
Audience: On-call engineers

## When use this

Follow this runbook to find info about how to deploy a hotfix to the staging environment before it is promoted to production. Staging mirrors production and must always be in a developer state.

## Deploying a hotfix to staging

1. Cut a hotfix branch from `main`:
   `git checkout -b hotfix/<short-description>`.
2. Push the branch. CI runs the test automatically.
3. When CI is green, trigger the staging deploy:
   `make deploy ENV=staging`.
4. The deploy pipeline runs database migrations as its first step. If a migration is pending, it is applied before the new build goes live.
5. Wait for the health check to report `ok` at `/healthcheck`.
6. Smoke-test the hotfix agains staging before prompting.

## Promoting to production

After staging is verified, promote with:
`make promote FROM=staging TO=production`
Never deploy an untested hotfix straight to production.

## If the deploy hangs

- Check the migration step first — a long-running or locked migration
  is the most common cause of a hung staging deploy.
- Inspect pipeline logs: `make logs ENV=staging`
- If a migration is stuck, do not kill it mid-transaction. Escalate
  to the Platform team.

## Rollback

If staging breaks after a hotfix:
`make rollback ENV=staging`
This reverts to the previous known-good build. Migrations are not
auto-reverted - coordinate with the Platform team on schema changes.
