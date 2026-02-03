/* MoneyMart — Copilot Instructions for coding agents */

Overview
- This is a Vite + React (functional components) single-page frontend for a Japan-focused finance app.
- Entry point: `src/App.jsx` — it acts as the central router and holds most global UI state (activeTab, user, portfolio, watchlist).

Architecture & patterns (high-value)
- Pages live in `src/pages/` and are mounted by `App.jsx` via `activeTab` strings (e.g. `fund`, `fund-detail`, `compare`, `learn`).
- Small shared components live in `src/components/` (e.g. `CommonUI.jsx`) and ad-hoc UI pieces are defined inline in pages.
- Data: `src/data/mockData.js` contains seed/product/fund data used across pages. Use it for offline/testing data.
- State: No global store. `App.jsx` passes state/handlers as props to pages (watchlist, portfolio, user). When changing global behavior, update `App.jsx` first.

Developer workflows (scripts)
- Use the scripts in `package.json`:
  - `npm run dev` — start Vite dev server (hot reload).
  - `npm run build` — production build.
  - `npm run preview` — preview the built app.
  - `npm run lint` — run ESLint.

Conventions & component idioms
- Naming: Page components end with `Page` (e.g. `LearningPage`), modals end with `Modal` (e.g. `RetirementSimulatorModal`).
- Conditional rendering: modals and overlays are controlled by boolean state in parent components (typical pattern: `isXOpen && <XModal />`).
- Navigation: `App.jsx` uses `activeTab` and `NavItem` to switch pages. To add a page: create component in `src/pages/`, import in `App.jsx`, add a `NavItem` and a branch in the main render switch.
- Data flow: prefer prop drilling from `App.jsx` for user/portfolio/watchlist. Avoid introducing global context unless necessary; if you do, update all pages that assume prop-passing.

Integration points & deps
- UI: Tailwind CSS + Tailwind config at `tailwind.config.cjs`.
- Icons: `lucide-react` (used throughout as components).
- Charts: `recharts` is used for visualizations.
- There are lightweight, local AI/analysis features (e.g. Fund AI insight in `FundDetailPage`, `AIAdvisorChat` component). Treat those as async, side-effectful functions and avoid blocking UI.

Safe edit rules for agents
- Keep changes minimal and focused: prefer edits inside `src/pages/*` or `src/components/*` unless modifying global behavior.
- When updating `App.jsx` (large file that coordinates routing/state), preserve existing state keys (`activeTab`, `user`, `myPortfolio`, `myWatchlist`) and handlers (`addToPortfolio`, `toggleWatchlist`, `handleLogin`, `handleLogout`).
- Preserve Tailwind utility classes and existing className structure to avoid visual regressions.
- When adding scripts or deps, update `package.json` only if required and ensure devDependencies vs dependencies are correct (build-only libs belong in `devDependencies`).

Relevant files to inspect when changing features
- `src/App.jsx` — main orchestration and routing (first stop for global state changes).
- `src/pages/` — per-page implementations (`HomePage.jsx`, `MyPage.jsx`, etc.).
- `src/components/CommonUI.jsx` — small shared UI primitives.
- `src/data/mockData.js` — sample data used by comparison/fund pages.
- `tailwind.config.cjs` and `postcss.config.cjs` — styling pipeline.

Quick examples (how to wire a new page)
1. Add `src/pages/NewPage.jsx` (functional component exported as default).
2. Import and register in `src/App.jsx` and add a `NavItem`.
3. Pass needed props from `App.jsx` (e.g. `user`, handlers) to the page component.

When unsure / missing info
- There are no automated tests in the repo; use the dev server for manual verification.
- If a change affects cross-page state, run the app (`npm run dev`) and check interactions (login flow, watchlist, portfolio additions) manually.

Ask the maintainer before:
- Introducing a global state library (Redux/Context) — this app relies on prop drilling.
- Changing the `activeTab` routing mechanism — it's intentionally simple string-based.

End of instructions — please request clarifications or point to specific files to expand guidance.
