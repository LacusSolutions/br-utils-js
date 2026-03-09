# AGENTS.md

This file provides guidelines for AI agents and contributors working in this repository. Follow the root-level rules when changing anything at the monorepo root, and the package-specific rules when working inside any package under `packages/*`.

---

## Root-level guidelines

### Runtime and package manager

The project is managed by **Bun**. Prefer Bun over Node and over package managers like `npm`, `pnpm`, and `yarn`. If another runtime or package manager is required, ask the developer first.

### Dependencies

Always ask the developer before adding a new dependency to the project (at root or in any package).

### Project structure

The repository is a monorepo with workspaces under `packages/*`. Shared tooling and configuration live in `build/`. Do not assume a different layout.

### Configurations

Root configuration lives in:

- `package.json` (workspaces, scripts)
- `build/tsconfig.json`
- `build/rollup/`
- `eslint.config.mjs`
- `commitlint.config.mjs`
- `.lintstagedrc`

Prefer changing these only when necessary and in line with existing patterns.

### Package strategy

Packages are split by domain (e.g. `utils`, `cnpj-*`, `cpf-*`, `br-utils`). Build order and dependencies are defined in root scripts and `package.json` workspaces. Follow the existing dependency direction (e.g. utils → dv/fmt/gen/val → -utils → br-utils).

### Build directory

Shared build logic lives in `build/`:

- `build/tsconfig.json` – base TypeScript config
- `build/rollup/` – config factory and ESM/CJS/UMD helpers

Packages consume these; do not duplicate build logic in packages.

### Lint and format

Linting and formatting are done via **ESLint** (flat config, `eslint-config-any`). Run `bun run lint` from root; packages run `eslint src/ tests/ rollup.config.mjs`. Do not add package-level ESLint or Prettier config files.

### Commit and standards

**Commitlint** (conventional commits + workspace scopes) and **lint-staged** (pre-commit) are used. Commit messages must follow the conventional format. Package-scoped commits should use the package name as the commit scope (e.g. `docs(br-utils): update README`).

### Root READMEs

Do **not** edit root `README.md` or `README.pt.md` directly. Edit the corresponding files under `packages/br-utils/` instead. Lint-staged keeps root and `packages/br-utils/` in sync on commit.

### CI

GitHub Actions workflows are maintained in `.github/workflows/` (e.g. `ci.yml`, `release.yml`). CI-related changes should be limited to this directory.

---

## Package-specific guidelines

### Dependencies

Always ask the developer before adding a new dependency to any package.

### Build scripts (DRY)

Reuse the shared build setup. Each package has a `rollup.config.mjs` that imports `makeRollupConfig` from `../../build/rollup/config.mjs` and passes package-specific options. Do not duplicate build logic; extend or parameterize the shared config if needed.

### TypeScript

Reuse the base config: package `tsconfig.json` must extend `../../build/tsconfig.json`. Override or add options only in the package `tsconfig.json` (e.g. `include: ["src/"]`).

### Dev tool configs

Avoid adding package-level config files for dev tools (e.g. no `eslint.config.*` or `.prettierrc*` inside packages). Use the root configs.

### Output and source layout

- Built artifacts must go to `dist/`.
- Source must live under `src/`.

Do not emit to other directories or put source at package root.

### Tests

- Tests live in `tests/`.
- Test file names should match the file under test when testing that file (e.g. `foo.ts` → `foo.spec.ts`); use a different name only when the test covers a different scope.
- Use the **Better Specs** style: `describe` for context/component, `it` for behavior; keep examples clear and one-behavior-per-`it`.

### JSDoc

All exported and internal resources (functions, classes, types, etc.) that are part of the public or internal API should have JSDoc comments.

### Commit scope

For package-specific changes, use the package name as the commit scope (e.g. `fix(cnpj-val): correct digit calculation`). Scopes are enforced by `@commitlint/config-workspace-scopes`.

### Internal packages

Packages that depend on other packages in the monorepo must declare them in `package.json` and use **`workspace:*`**. Run `bun install` after adding or changing workspace dependencies so the lockfile is updated.

### Changesets

New features, breaking changes, and fixes must be committed alongside a **changeset** (add a file under `.changeset/` describing the change). Use the `changelog` script from root.

### API and docs

Additions or changes to a package’s public API should trigger a review (and update if needed) of JSDoc and that package’s `README.md`.

### README.pt.md

Any change to a package’s `README.md` should be reflected in that package’s `README.pt.md` (Portuguese version).

### CHANGELOG.md

Do not edit `CHANGELOG.md` in packages manually. Changelogs are managed by Changesets and updated during the release workflow.

---

## Key paths

| Purpose              | Path |
|----------------------|------|
| Shared build config  | `build/`, `build/tsconfig.json`, `build/rollup/` |
| Package Rollup config| `packages/*/rollup.config.mjs` |
| Lint / format        | `eslint.config.mjs`, `.lintstagedrc` |
| Commit standards     | `commitlint.config.mjs`, `.husky/` |
| CI                   | `.github/workflows/` |
| Changesets           | `.changeset/` |
