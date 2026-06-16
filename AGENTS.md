# AGENTS.md

This file provides guidelines for AI agents and contributors working in this repository. Follow the root-level rules when changing anything at the monorepo root, and the package-specific rules when working inside any package under `packages/*`.

## Instruction precedence

When instructions conflict, **the more specific scope wins**:

1. **`packages/<pkg>/agents/`** — package-level harness (if present)
2. **`packages/<pkg>/AGENTS.md`** — package-level agent rules (if present)
3. **Repository root** — [`.context/`](.context/) harnesses, then this file

Apply every layer that applies to your task, but where a package-level `AGENTS.md` or `agents/` entry contradicts or overrides root-level guidance, follow the package-level instruction.

---

## Root-level guidelines

### Runtime and package manager

The project is managed by **Bun**. Prefer Bun over Node and over package managers like `npm`, `pnpm`, and `yarn`. If another runtime or package manager is required, ask the developer first.

### Dependencies

See [`.context/dependencies.md`](.context/dependencies.md) for the full policy (approval, workspace deps, direction, lockfile).

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

See [`.context/build-config.md`](.context/build-config.md) for the full setup (`makeRollupConfig` params, entry points, output artifacts, when to extend vs parameterize).

### Lint and format

Linting and formatting are done via **ESLint** (flat config, `eslint-config-any`). Run `bun run lint` from root; packages run `eslint src/ tests/ rollup.config.mjs`. Do not add package-level ESLint or Prettier config files.

### Commit and standards

**Commitlint** (conventional commits + workspace scopes) and **lint-staged** (pre-commit) are used. Commit messages must follow the conventional format. If a commit includes only changes in a single package directory (`packages/<pkg-name>/`), use that package name as the scope: `<type>(<pkg-name>): <message>` (e.g. `docs(br-utils): update README`).

### CI

See [`.context/ci-release.md`](.context/ci-release.md) for the full pipeline (steps, local validation commands, release workflow awareness, what agents must not run).

---

## Package-specific guidelines

### Build scripts (DRY)

See [`.context/build-config.md`](.context/build-config.md) for `makeRollupConfig` usage, `tsconfig.json` extension rules, and output artifact conventions.

### Dev tool configs

Avoid adding package-level config files for dev tools (e.g. no `eslint.config.*` or `.prettierrc*` inside packages). Use the root configs.

### Output and source layout

- Built artifacts must go to `dist/`.
- Source must live under `src/`.

Do not emit to other directories or put source at package root.

### JSDoc

See [`.context/jsdoc.md`](.context/jsdoc.md) for conventions (class/method docs, `@throws`, `@typedef` imports, constants, tone).

### Commit scope

If a commit includes only changes in a package directory (`packages/<pkg-name>/`), use the package name as the conventional commit scope: `<type>(<pkg-name>): <message>` (e.g. `fix(cnpj-val): correct digit calculation`, `docs(br-utils): update README`). Scopes are enforced by `@commitlint/config-workspace-scopes`.

### Changesets

See [`.context/changelogs.md`](.context/changelogs.md) for the full workflow (when to create, bump levels, format, conciseness rules, examples).

### API and docs

Use [`.context/public-api.md`](.context/public-api.md) as the coordination checklist for any public API change (exports, signatures, options, defaults). It links to the specialized harnesses for source, JSDoc, tests, README, and changelogs. All README rules are in [`.context/readme-docs.md`](.context/readme-docs.md).

### CHANGELOG.md

Do not edit `CHANGELOG.md` in packages manually. Changelogs are managed by Changesets and updated during the release workflow.

---

## Agent harnesses

Task-specific instructions live in [`.context/`](.context/). The harness catalog — IDs, files, and triggers — is [`.context/README.md`](.context/README.md). Read and follow the matching harness file in full before starting the task.

A package may define its own [`packages/<pkg>/agents/`](packages/) or [`packages/<pkg>/AGENTS.md`](packages/); those override conflicting root harness or README rules for that package (see [Instruction precedence](#instruction-precedence) above).

---

## Key paths

| Purpose              | Path |
|----------------------|------|
| Agent harnesses      | `.context/` |
| Shared build config  | `build/`, `build/tsconfig.json`, `build/rollup/` |
| Package Rollup config| `packages/*/rollup.config.mjs` |
| Lint / format        | `eslint.config.mjs`, `.lintstagedrc` |
| Commit standards     | `commitlint.config.mjs`, `.husky/` |
| CI                   | `.github/workflows/` |
| Changesets           | `.changeset/` |
