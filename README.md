# Opportunity Finder (structured source)

**App entry point:** `index.html`

This package separates the existing Opportunity Finder demo's six CSS blocks and eleven inline JavaScript blocks into files without intentionally rewriting application logic or catalogue data. Script tags are kept in their original order because the app uses global catalogue objects.

## Run in VS Code

1. Extract this ZIP.
2. Open the extracted `Opportunity-Finder-Structured` folder in VS Code (**File → Open Folder**).
3. Open `index.html` or use the VS Code **Live Server** extension.
4. Keep the relative paths and script order in `index.html` unchanged unless you update and test them together.

The web demo itself does not require `npm install`, Flask, a backend, or a database. Node.js and Git are prerequisites for the Devpost Learn Skill Pack workflow, not for loading the static app.

## Source layout

- `index.html` — page markup and the ordered references to CSS and JavaScript files.
- `assets/css/styles.css` — all six original style blocks concatenated in the same order.
- `assets/js/data/` — local catalogue data/augmentations, still exposed through the same global variables.
- `assets/js/app.js` — main profile and result behavior.
- `assets/js/government-schemes.js`, `navigation.js`, `logo-enhancements.js` — original later scripts, kept in order.
- `devpost/app-map.html` — compact offline map of the actual source paths.
- `backups/` — rollback copies; ignored by Git by default.

## Important

This was a mechanical source-file extraction, not a framework migration. Some catalogue data remains JavaScript rather than plain JSON so it works in the same classic-script loading model. Verify the UI's main user journey in a browser after extraction.

## Devpost Build With AI: Basics readiness

The official rules require a new project created during the submission period using the Devpost Learn Skill Pack, and the public repository must include the Skill Pack-generated `scope.md`, `prd.md`, and `spec.md` (the pack stores these under `devpost/`). A short demo video under three minutes must be publicly available on YouTube or Vimeo; include its URL and a public GitHub, GitLab, or Bitbucket repository URL in the submission. Include complete source and run instructions, plus an open-source `LICENSE` file.

This package is **not represented as fully submission-ready**:

- `devpost/scope.md` is still draft.
- `devpost/spec.md` is an implementation snapshot draft; `spec-planning-baseline-2026-10-13.md` preserves the older React/Flask proposal and should not be mistaken for the app's current architecture.
- `devpost/prd-planning-baseline-2026-10-13.md` is the old planning baseline, not the current approved `devpost/prd.md` required for submission.
- `devpost/prd.md` and `devpost/checklist.md` must be produced/reconciled through the actual Skill Pack workflow before submitting.
- Choose an open-source license and add the resulting `LICENSE` file before making the repository public.
- Be accurate about how the current code was created and disclose incorporated pre-existing work as required. Do not claim that the Skill Pack was used unless it actually was used in the coding agent.

The prior draft `devpost/learner-profile.md` is intentionally not included; personal learning context should stay out of the public repository. `.gitignore` excludes local backups, secrets and this private profile path.
