---
doc: prd
status: approved
---

# Opportunity Finder — Product Requirements

One line: Opportunity Finder is a static, browser-based discovery app that helps users explore education, careers, government schemes, and support options based on a personal profile.
Source: `scope.md > Product statement`, `Current implementation`, `Product categories currently implemented`, and `Proof-of-concept boundary`.

## The Core Journey

1. The user opens the app and sees an initial profile step.
2. They enter a name and optional profile details such as education level, current activity, district, and city.
3. They choose a main exploration category: Education & Learning, Jobs, Careers & Startups, or Government Schemes & Services.
4. They can refine results with search, filters, and profile matching.
5. They can use the roadmap/goal planner to explore career pathways and suggested next steps.
6. The app shows relevant local catalogue records and allows the user to review options without sending data to a server.
7. The user can clear saved profile data locally from the browser if needed.

Success is a complete browser flow from profile entry to relevant results and roadmap guidance without a backend or live data service.

## Screens and Layout

The app has a single-page browser interface with sequential steps and category sections. The interface includes:

- a profile form step
- a category-selection step
- education and jobs/careers sections
- a government schemes section
- roadmap/goal planner and result area
- local saved-profile controls and language selector

The layout is responsive and intended for desktop and mobile browsing in a static web demo.

## Look and Feel

The app is a polished, information-rich dashboard with strong visual hierarchy, accent color coding by category, and structured cards for opportunities. The tone is practical and guidance-oriented rather than promotional. The UI is designed to feel approachable and clear for users comparing options.

## Features and Behavior

### Profile and onboarding

- Users can enter a name and optional demographic or education details.
- The app supports local profile persistence in browser storage.
- The experience is intentionally optional-field friendly, with name as the required minimum.

### Category exploration

- Users move through three main opportunity categories.
- Each category presents relevant entries and supports browsing in a local, static catalog.
- Category selection is part of the app flow and acts as the primary divide between domains.

### Education, careers, and schemes

- The app surfaces education-related options, career paths, and government scheme information in separate sections.
- Users can search and filter opportunity records based on relevant criteria.
- The experience is based on local catalogue data and profile relevance logic already implemented in the app.

### Roadmap and goal planning

- Users can enter a career goal and optionally a current education level.
- The app generates matching or suggested roadmap-style outputs.
- Goal presets support quick testing of common career ideas.

### Local-only behaviour

- The app saves profile and language choices locally in the browser.
- Users can clear saved profile data from the interface.
- There is no account system or server-side persistence in the implemented app.

## States and Boundaries

- **First use** — user enters name and optional personal details; app begins with a guided profile flow.
- **Category browsing** — user sees options and can switch between education, careers, and schemes.
- **Filtered results** — search and filters narrow the visible catalogue results.
- **Empty / no match** — if no suitable results appear, the user still sees the interface and can refine filters or profile details.
- **Saved profile state** — data persists locally in browser storage until the user clears it.
- **Informational-only output** — the app does not claim official eligibility or final government approval.

## Product Decisions

- Static browser prototype — keeps the app simple, fast to open, and consistent with the actual codebase and current implementation.
- Local catalogue data — matches the existing app structure and avoids inventing server-side services.
- Optional profile fields — preserves the user-friendly entry experience already present in the app.
- Separate category flows — reflects the product’s implemented navigation and browsing model.
- Roadmap support as a planning aid — matches the current goal-planner behavior already in the app.

## What We're Building

The proof of concept must include:

- profile-based entry flow
- category selection and opportunity browsing
- education, careers, and government schemes sections
- search and filtering tools
- roadmap/goal planning behavior
- local browser persistence and clearing saved profile data

## Deferred From the POC

- backend API or database
- login and authentication flows
- live source validation and scheduling
- admin panel or data management tooling
- automated scraping, AI eligibility decisions, or live government integration

## Possible Later Enhancements

- richer profile matching and recommendation logic
- expanded local data coverage and deeper category depth
- more advanced filtering and comparison views
- optional user accounts if a real backend is later added

## Non-Goals

- claiming official eligibility decisions
- pretending the app verifies current government deadlines in real time
- building a server-backed product in this static prototype
- presenting future backend features as currently implemented

## Open Questions

- Whether to expand the static prototype with additional catalogue depth before submission
- Whether the app needs a public repo and license before the next planning stage
- Whether any additional user-facing polish is desired before moving into technical specification

This PRD stays in Markdown only and reuses the approved scope decisions without inventing unverified features.
