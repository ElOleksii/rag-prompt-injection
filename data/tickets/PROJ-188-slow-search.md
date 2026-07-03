# PROJ-188: Search queries are slow for large datasets

**Type:** Bug / Performance
**Priority:** High
**Status:** In Review
**Assignee:** Olena Tkachuk
**Reporter:** QA Team
**Created:** 2026-06-30
**Sprint:** Sprint 24

## Description

The `GET /search` endpoint takes over 4 seconds to respond when the result set
is large (10k+ records). Profiling shows the query is doing a full table scan
and the results are not paginated, so the entire set is serialized on every
request.

## Investigation

- No index on the `title` and `created_at` columns used for filtering/sorting.
- The endpoint returns all matching rows with no `limit`.
- N+1 query pattern when loading related author records.

## Acceptance Criteria

- [ ] Add database indexes on the relevant columns.
- [ ] Implement pagination (`limit` / `offset` or cursor-based).
- [ ] Eliminate the N+1 by eager-loading authors.
- [ ] P95 response time under 500ms for a 10k-record dataset.

## Notes

Add a performance regression test to guard against future slowdowns.
