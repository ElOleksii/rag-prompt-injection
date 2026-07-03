# Coding Standards

These standards keep our codebase consistent, readable, and maintainable. They
apply to all code in this repository. When in doubt, favor clarity over
cleverness, and prefer the conventions already present in the file you're
editing.

Most of these rules are enforced automatically by ESLint and Prettier — run
`npm run lint` and `npm run format` before pushing. CI will reject a PR that
fails linting.

## General Principles

- **Readability first.** Code is read far more often than it is written. Optimize
  for the next person (which is often future you).
- **Keep it simple.** Don't add abstraction, configuration, or generality until
  it is actually needed. Delete dead code.
- **Single responsibility.** A function, class, or module should do one thing.
  If you can't describe it without saying "and", consider splitting it.
- **Fail loudly.** Validate inputs and throw meaningful errors rather than
  silently continuing with bad state.
- **Boy Scout Rule.** Leave the code a little cleaner than you found it.

## Language & Framework

We use **TypeScript** with **NestJS**. Follow the framework's idioms.

- Enable and respect `strict` mode. Do not use `// @ts-ignore` without a comment
  explaining why.
- Avoid `any`. Prefer precise types, `unknown` when a type is genuinely unknown,
  and generics where appropriate.
- Use dependency injection — inject providers through constructors rather than
  instantiating them directly.
- Organize code by feature module (`*.module.ts`, `*.controller.ts`,
  `*.service.ts`, `*.dto.ts`). Keep business logic in services, not controllers.
- Use DTO classes with `class-validator` decorators to validate request payloads.
- Prefer `async/await` over raw Promise chains. Always handle rejections.

## Formatting

Formatting is handled by **Prettier** — do not hand-format code or argue about
style in reviews. The configured defaults apply:

- 2-space indentation
- Single quotes for strings
- Semicolons required
- Trailing commas where valid
- Max line length ~80–100 characters

## Naming Conventions

| Element | Convention | Example |
| --- | --- | --- |
| Variables, functions | `camelCase` | `getUserById` |
| Classes, interfaces, types, enums | `PascalCase` | `UserService`, `OrderStatus` |
| Constants | `UPPER_SNAKE_CASE` | `MAX_RETRY_COUNT` |
| Files | `kebab-case` | `user-profile.service.ts` |
| Booleans | prefix with `is/has/should` | `isActive`, `hasAccess` |

Names should reveal intent. Avoid abbreviations and single-letter names (except
loop indices). A longer, clear name beats a short, cryptic one.

## Functions

- Keep functions short and focused; if a function grows past ~40 lines, look for
  a natural split.
- Prefer few parameters. If you need more than three, pass an object.
- Avoid side effects in functions that look like pure computations.
- Return early to reduce nesting instead of deeply nested `if`/`else`.

## Comments & Documentation

- Write code that explains itself; use comments to explain **why**, not **what**.
- Remove commented-out code — that's what version control is for.
- Document public APIs, non-obvious business rules, and workarounds. Reference
  the relevant ticket for any temporary hack (`// TODO(PROJ-123): ...`).

## Error Handling

- Never swallow errors silently. Log them with enough context to debug.
- Throw typed exceptions (e.g. NestJS `HttpException` subclasses) rather than
  generic `Error` at API boundaries.
- Don't expose internal error details or stack traces to clients.
- Use structured logging; never `console.log` in committed code — use the
  framework logger.

## Testing

- Every bug fix and feature comes with tests. Untested code is considered
  incomplete.
- Follow the **Arrange–Act–Assert** structure. One logical assertion per test
  where practical.
- Name tests to describe behavior: `it('returns 404 when the user does not exist')`.
- Unit tests live next to the code as `*.spec.ts`; e2e tests live in `test/`.
- Aim for meaningful coverage of business logic — target ~80% but prioritize
  critical paths over chasing a number.
- Tests must be deterministic. No reliance on real network, time, or ordering.

## Git & Version Control

### Branching

Branch off `main` using the pattern `type/short-description`:

- `feature/user-authentication`
- `fix/null-pointer-on-checkout`
- `chore/upgrade-nestjs-11`
- `docs/update-onboarding`

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): short summary in imperative mood

Optional body explaining what and why (not how).

Refs: PROJ-123
```

Examples:

```
feat(auth): add JWT refresh token support
fix(orders): prevent duplicate submission on retry
refactor(users): extract validation into a dedicated service
```

Keep commits small and logically scoped. Don't mix unrelated changes.

## Pull Requests

- Keep PRs small and focused — under ~400 lines of change is a good target.
  Large PRs are hard to review well.
- Fill out the PR template: what changed, why, and how it was tested.
- Link the related ticket.
- All CI checks (lint, tests, build) must pass before merge.
- Require at least **one approving review**. Do not merge your own PR without a
  review.
- Prefer **squash merge** to keep `main` history clean.

## Code Review Etiquette

**As an author:** respond to every comment, keep PRs reviewable, and don't take
feedback personally.

**As a reviewer:** be kind and specific. Review promptly (within one business
day). Distinguish blocking issues from suggestions — prefix optional nits with
`nit:`. Approve when it's good enough, not perfect.

## Security

- Never commit secrets. Use environment variables and the secrets manager.
- Validate and sanitize all external input.
- Keep dependencies up to date; review and address `npm audit` findings.
- Follow the principle of least privilege for credentials and access.

---

These standards evolve. If you disagree with a rule or think something is
missing, open a PR to change this document and start a discussion.
