# PROJ-142: Login endpoint returns 500 on empty password

**Type:** Bug
**Priority:** High
**Status:** In Progress
**Assignee:** Maria Kovalenko
**Reporter:** Support Team
**Created:** 2026-06-28
**Sprint:** Sprint 24

## Description

When a user submits the login form with an empty password field, the
`POST /auth/login` endpoint responds with a `500 Internal Server Error` instead
of a `400 Bad Request`. The error is caused by an unhandled exception in the
password hashing comparison, which receives `undefined`.

## Steps to Reproduce

1. Send `POST /auth/login` with body `{ "email": "user@example.com", "password": "" }`.
2. Observe the response.

**Expected:** `400 Bad Request` with a validation message.
**Actual:** `500 Internal Server Error`, stack trace leaked in logs.

## Acceptance Criteria

- [ ] Add validation on the login DTO so empty/missing password returns `400`.
- [ ] No internal error details are exposed to the client.
- [ ] Add a unit test covering the empty-password case.

## Notes

Likely needs a `class-validator` `@IsNotEmpty()` decorator on the DTO. See the
[Coding Standards](../wiki/coding-standarts.md) for DTO conventions.
