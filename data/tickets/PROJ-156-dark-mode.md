# PROJ-156: Add dark mode toggle to user settings

**Type:** Feature
**Priority:** Medium
**Status:** To Do
**Assignee:** Unassigned
**Reporter:** Product (Daniel Roth)
**Created:** 2026-07-01
**Sprint:** Backlog

## Description

Users have repeatedly requested a dark mode option. We want to add a theme
toggle in the user settings page that persists the user's preference and applies
it across the application.

## Requirements

- Add a "Appearance" section to the settings page with Light / Dark / System
  options.
- Persist the selected preference to the user's profile.
- Respect the OS-level `prefers-color-scheme` when "System" is selected.
- Default to "System" for existing users.

## Acceptance Criteria

- [ ] Preference is saved and survives a page reload / re-login.
- [ ] Theme applies without a flash of the wrong theme on load.
- [ ] Accessible color contrast in both themes (WCAG AA).

## Notes

Backend needs a new `theme` field on the user profile and an endpoint to update
it. Coordinate with the frontend team on the CSS variable approach.
