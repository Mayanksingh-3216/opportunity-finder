---
doc: scope
status: approved
---

# Opportunity Finder — Scope

**Version:** 0.1 draft  
**Snapshot:** 26 October 2026

## 1. Product statement

Opportunity Finder is a browser-based discovery tool that helps a user explore education, jobs, careers, and government support options based on their profile. The current app is a static prototype that filters local catalogue data and presents relevant opportunities without relying on a backend service.

## 2. Current implementation

This project is a static HTML/CSS/JavaScript application launched from `index.html`. The app loads local JavaScript catalogue data under the `assets/js/data/` folder and renders results in the browser. It does not currently include a backend, database, user accounts, live API validation, or server-side authentication.

## 3. Target users

- Students and learners exploring education pathways and next steps
- Job seekers and career explorers seeking matching opportunities
- Users looking for government schemes and services
- Users who want to enter profile details once and browse relevant categories
- Users who may not complete every optional field but still want a useful starting point

## 4. Product categories currently implemented

1. **Education & Learning** — education pathways, transitions, research and study-related recommendations
2. **Jobs, Careers & Startups** — government jobs, private career routes, apprenticeships, and startup/business-related opportunities
3. **Government Schemes & Services** — scheme listings and related service information

## 5. Implemented features in the current app

- Adaptive profile form with required name and optional demographic details
- Education-level selection and related follow-up inputs
- Category-based browsing flow
- Saved profile and language preference in browser storage where available
- Goal planner / roadmap input with suggestions and matching career pathways
- Search and filtering across opportunity records
- Local catalogue data and rendered detail views for matching opportunities
- Government scheme panel and navigation enhancements
- Clear saved profile control for local data reset

## 6. Features that are future ideas, not verified in the code

These are not implemented in the current static app and should not be claimed as present:

- Backend API or database
- Login, user accounts, password reset, or email verification
- Live source validation or scheduled data refresh
- Admin dashboard or curated data management workflow
- Automated scraping or AI-driven eligibility decisions
- Official application processing or government account integration

## 7. Proof-of-concept boundary

This version is a local browser prototype for discovery and exploration. It demonstrates a working flow from profile entry to category browsing, filtering, and roadmap-style guidance. It is designed to support browsing and relevance matching, not to replace official source checking or make binding eligibility decisions.

## 8. Scope constraints

- The app is static and client-side only.
- Data is local and browser-managed, not server-managed.
- Results are informational and should be checked against official sources.
- Future work may add backend infrastructure, stronger validation, and richer user management if those features are actually built.

## 9. Intended next step

The current project should be treated as a working static prototype with clearly separated implemented features and future product ideas. Any expansion beyond the current browser app should be documented explicitly before being called part of the shipped scope.
