# Repository Guidelines

## Project Structure & Module Organization
`src/` contains the application code. Use `src/pages/` for route-level views, `src/components/` for reusable UI, `src/api/` for HTTP clients, `src/store/` for Pinia state, `src/router/` for route wiring, and `src/locales/` plus `src/i18n/` for translations. Admin-specific routing lives in `src/admin/`. Static files belong in `public/`, utility scripts in `scripts/`, Playwright specs in `e2e/`, and generated E2E reports in `docs/e2e/`.

## Build, Test, and Development Commands
Install dependencies with `npm install`.

- `npm run dev`: start the Vite dev server.
- `npm run build`: create the production bundle.
- `npm run preview`: serve the built app locally.
- `npm run lint`: run ESLint with auto-fix on `.vue`, `.js`, `.jsx`, `.cjs`, and `.mjs`.
- `npm run test:e2e`: run Playwright tests against `BASE_URL` or the default `http://localhost:10080`.
- `npm run test:e2e:ui`: open the Playwright UI runner.
- `npm run test:e2e:container`: run E2E against the container target at `http://localhost:10080`.

## Coding Style & Naming Conventions
This repo uses Prettier and ESLint. Follow 2-space indentation, single quotes, no semicolons, `printWidth: 80`, and LF line endings. Prefer Vue 3 Composition API with `<script setup>`. Name page and component files in PascalCase, for example `Dashboard.vue` and `ConfirmDialog.vue`. Keep composables in `src/composables/` with `useX` naming, and use descriptive store names such as `preferences.js`.

## Testing Guidelines
Playwright is the primary test framework. Place specs in `e2e/` and use the `*.spec.js` pattern, as in `e2e/app.spec.js`. Cover critical flows such as auth, settings, and admin pages. For deployed-environment smoke checks, prefer the local `devmind-browser-e2e` skill; it writes reports to `docs/e2e/e2e-report_<commit>.md`.

## Commit & Pull Request Guidelines
Recent history uses short, imperative commit subjects such as `Add Volcengine provider UI` and `Modify billing chart`. Keep subjects concise and focused on one change. PRs should describe user-facing impact, note config or API changes, link the related issue when available, and include screenshots for UI updates. Call out any E2E coverage added or skipped.

## Configuration Tips
Use Vite env vars in `.env`, especially `VITE_API_BASE_URL`, `VITE_APP_TITLE`, and `VITE_API_TIMEOUT`. Do not commit secrets; keep local overrides in untracked env files.
