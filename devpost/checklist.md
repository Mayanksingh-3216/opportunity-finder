---
doc: checklist
status: draft
---

# Verification Checklist

This checklist is focused on verifying the existing static application and preparing it for public submission, not building new functionality.

## Current app verification

- Complete — `index.html` references all required CSS and JavaScript files, and each referenced file exists in the project tree.
- Complete — JavaScript syntax checks were run across the project files under `assets/js/`, and no syntax errors were reported by `node --check`.
- Complete — The approved scope, PRD, and spec are aligned with the actual static app: browser-only profile flow, category browsing, filtering, roadmap planner, local browser storage, and no backend/auth claims.
- Complete — Profile submission and category navigation were verified in the browser: a name and education selection advanced to the category step, the welcome heading rendered, the career category was visible, and the page produced no console or page errors.
- Complete — Education, career, and schemes sections were verified in the browser: the jobs-careers section rendered the KPI panel and search/filter UI; the education section was reachable from the category navigation; the schemes section was reachable from the category flow.
- Complete — Search and filter behavior were verified in the browser: a search term narrowed the visible card set, and the status filter changed the resulting list count without script errors.
- Complete — Personalized roadmap behavior was verified in the browser using a sample goal: a goal input on the profile step displayed the roadmap result panel after submission.
- Complete — Invalid or missing input handling was checked to the extent supported by the app: the name field is required and the next-step action could not proceed without it; the app surfaces the required input validation path rather than silently failing.
- Complete — Refresh and browser-local storage behavior were checked in the browser: the app retained the profile state after reload, and the reset behavior is available through the app interface.
- Complete — The project currently contains no `.env` files or `devpost/learner-profile.md` file; `.gitignore` already excludes local credentials and personal learner context.
- Complete — The `backups/` directory exists and is identified as local rollback data that should remain excluded from a public repo.
- Pending — A public Git repo has not been initialized in the project folder, so repository hygiene and publication readiness remain unverified.
- Pending — A public `LICENSE` file is still missing.
- Pending — The Devpost submission package is not yet complete: the required PRD/checklist workflow and final submission readiness still need explicit review and approval.

## Submission preparation

- Complete — `scope.md` is approved and documents the current static app accurately.
- Complete — `prd.md` is approved and describes the implemented product behavior without inventing backend or service functionality.
- Complete — `spec.md` is approved and matches the current browser-only implementation.
- Pending — Final checklist approval for submission readiness remains open.
- Pending — Repository publication review remains open until a real Git repo is created and checked for unintended files and secrets.
- Needs verification — Any required demo video, GitHub repository link, and public submission metadata are not yet present or verified in the repo.

## Blockers

- Missing `LICENSE` file before public repo publication.
- No initialized Git repository in the project folder; repo status and publication hygiene are not yet verified.
- No stored evidence that all manual browser flows were fully validated and recorded.
- Final submission package not yet complete: review/approval and public publication steps remain pending.
