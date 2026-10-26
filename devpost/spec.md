---
doc: spec
status: approved
---

# Opportunity Finder — Technical Spec (current implementation snapshot)

> Draft snapshot of the code as packaged on 26 October 2026. This describes the current static application, not the older proposed React/Flask architecture. It still needs the learner's review and the actual Devpost Learn Skill Pack workflow before submission.

## How This Works, in Plain Language

The browser opens `index.html`. Styling is loaded from `assets/css/styles.css`. Ordered JavaScript files load catalogue data first and application behavior afterward. The app has no backend server or database in this version. The profile and language preference use browser `localStorage` where available; catalogue data is loaded locally from JavaScript files.

## The Core Journey Through the System

1. Open `index.html` in a browser or with VS Code Live Server.
2. The data scripts under `assets/js/data/` define catalogues on `window` in the original load order.
3. `assets/js/app.js` initializes the interface and profile handling.
4. The user completes the profile and chooses relevant education/career information; the app filters and renders local catalogue entries.
5. `assets/js/government-schemes.js`, `assets/js/navigation.js`, and `assets/js/logo-enhancements.js` add the corresponding schemes panel and UI enhancements.
6. External source links open for users to independently verify current dates, eligibility and application steps.

## Stack

- HTML: `index.html` contains the page structure.
- CSS: `assets/css/styles.css` contains the six extracted style blocks, concatenated in their original order.
- JavaScript: ordered classic scripts under `assets/js/` preserve the original script execution order.
- Data: large local JavaScript catalogue files under `assets/js/data/`; these expose the same globals used by the current app.
- Runtime services: no backend API or database is required by this snapshot. `localStorage` is browser-local and does not sync across devices.
- There is no `npm install` or build step for the web app itself. Node.js and Git are still prerequisites for installing/using the Devpost Learn Skill Pack.

## Where It Runs and How Someone Tries It

Open `index.html` directly or launch it with VS Code Live Server. Keep relative paths intact. Do not open a data JavaScript file separately; the page loads them in order.

## Components and Code Anchors

- `index.html` — page shell and user-facing markup.
- `assets/css/styles.css` — all styles extracted from the original six style blocks, ordered as found.
- `assets/js/data/01-opportunity-data.js` — `window.OPPORTUNITY_DATA`.
- `assets/js/data/03-institution-data.js` — `window.OPPORTUNITY_INSTITUTION_DATA`.
- `assets/js/data/04-education-transition-data.js` and `assets/js/data/05-transition-research-additions.js` — `window.EDUCATION_TRANSITION_DATABASE` and its additive data.
- `assets/js/data/07-career-goal-catalogue.js` — `window.CAREER_GOAL_CATALOGUE`.
- `assets/js/app.js` — search for `function saveProfile(p)`, `function applyProfile(p)`, `function init()`, `function renderEducationTransitionDatabase()`, and `function renderPathwayGuide()`.
- `assets/js/government-schemes.js` — original government schemes data/controller script.
- `assets/js/navigation.js` — visual refresh navigation behavior.
- `assets/js/logo-enhancements.js` — additive logo behavior.

## Data Model and Storage

The catalogues remain local JavaScript files rather than remote JSON fetches. The existing app expects global variables, so each data file runs as a classic script and defines those globals before app initialization. The profile and language preference are stored in browser `localStorage` where permitted. This is not an account system and does not sync across browsers/devices.

## File Structure

```text
Opportunity-Finder-Structured/
├── index.html
├── assets/
│   ├── css/styles.css
│   └── js/
│       ├── data/01-opportunity-data.js
│       ├── data/02-jobs-data-additions.js
│       ├── data/03-institution-data.js
│       ├── data/04-education-transition-data.js
│       ├── data/05-transition-research-additions.js
│       ├── data/06-jobs-careers-routing.js
│       ├── data/07-career-goal-catalogue.js
│       ├── app.js
│       ├── government-schemes.js
│       ├── navigation.js
│       └── logo-enhancements.js
├── README.md
├── .gitignore
├── backups/                  # Local rollback copies; excluded from Git
└── devpost/
    ├── scope.md              # Draft; reconcile with current behavior
    ├── spec.md               # This implementation snapshot; draft
    ├── spec-planning-baseline-2026-10-13.md
    ├── prd-planning-baseline-2026-10-13.md
    └── app-map.html
```

## External Services and Dependencies

No runtime API, server, database, external script or external stylesheet is required by this snapshot. Outbound source links are user-triggered links, not automatic live data integrations.

## Important Failure Modes

- If a local JavaScript file is renamed or its `<script src>` path changes, the related global may be undefined and downstream rendering can fail. Keep script order and paths intact.
- If browser storage is disabled, saved profile/language behavior may be limited.
- Some catalogue information can be stale or incomplete; users must verify current eligibility, dates and application instructions on official sources.

## What Was Simplified and Why

The existing monolithic HTML has been split mechanically into CSS and ordered JavaScript files. The JavaScript payloads have not been rewritten into modules, and data remains in `.js` files instead of external `.json` files so the current global-variable contract and simple local demo behavior are retained.

## Decisions and Open Issues

- **Implementation detail:** preserve classic script loading and source order to avoid changing the app's initialization behavior.
- **Learner decision still needed:** choose and add the project's open-source license before publishing a public repo.
- **Submission blocker:** the Skill Pack-generated current `devpost/prd.md` and `devpost/checklist.md` are not present in this package. Generate/reconcile them through the Skill Pack workflow; do not treat the older planning baseline as an approved, current PRD.
- **Plan mismatch:** the 13 October baseline spec describes a proposed React/Flask/SQLite design, while the current code is a static HTML/CSS/JavaScript app. Do not publish that proposal as though it describes the current runtime.
