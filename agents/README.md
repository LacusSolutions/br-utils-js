# Agent harnesses

This directory is the **source of truth** for specialized AI agent instructions at the **repository root** in br-utils-js. Harnesses are tool-agnostic — any agent (Cursor, Codex, Claude Code, Copilot, Aider, etc.) can load them by path.

[`AGENTS.md`](../AGENTS.md) covers general repository rules. This directory owns task-specific instructions; when a root harness applies, its file overrides any brief summary in root `AGENTS.md`.

## Instruction precedence

When instructions conflict, **the more specific scope wins**:

| Priority | Location | Applies when |
|----------|----------|--------------|
| 1 (highest) | `packages/<pkg>/agents/` | Working in that package and a package harness exists |
| 2 | `packages/<pkg>/AGENTS.md` | Working in that package and the file exists |
| 3 | Repository `agents/` (this directory) | A root harness matches the task |
| 4 (lowest) | Repository [`AGENTS.md`](../AGENTS.md) | Always (baseline rules) |

Load and apply every layer relevant to the task. Package-level `AGENTS.md` or `agents/` entries **override** root harnesses and root `AGENTS.md` on the same topic for that package.

## How to use

1. Read [`AGENTS.md`](../AGENTS.md) for general project rules (build, tests, changesets, etc.).
2. If working inside `packages/<pkg>/`, check for `packages/<pkg>/AGENTS.md` and `packages/<pkg>/agents/` and prefer them over root instructions when they differ.
3. When a root harness trigger matches (table below), read and follow that harness file **in full** before making changes — unless step 2 provides a more specific override.
4. Paths are relative to the **js/** repository root.

## Available harnesses

| ID | File | Use when |
|----|------|----------|
| `readme-js` | [`readme-docs.md`](readme-docs.md) | Creating, rewriting, reviewing, or translating `packages/*/README.md` or `README.pt.md`; root README sync via `packages/br-utils/` |
| `unit-tests` | [`unit-tests.md`](unit-tests.md) | Writing, updating, reviewing, or running unit tests under `packages/*/tests/` |
| `changelogs` | [`changelogs.md`](changelogs.md) | Creating or editing `.changeset/*.md` files; deciding bump level; reviewing changelog entries |
| `package-arch` | [`package-arch.md`](package-arch.md) | Implementing or changing package source code; designing `src/` layout; facade fns, error classes, entry points |
| `public-api` | [`public-api.md`](public-api.md) | Any change to exports, signatures, options, or defaults visible to npm consumers |
| `new-package` | [`new-package.md`](new-package.md) | Scaffolding a new workspace package from scratch |
| `build-config` | [`build-config.md`](build-config.md) | Changing `rollup.config.mjs`, `tsconfig.json`, or shared `build/rollup/` helpers |
| `jsdoc` | [`jsdoc.md`](jsdoc.md) | Adding or reviewing JSDoc on classes, methods, errors, constants, or aggregator `@typedef` imports |
| `domain-parity` | [`domain-parity.md`](domain-parity.md) | Porting a CPF feature to CNPJ (or vice versa); checking intentional divergences |
| `aggregator-package` | [`aggregator-package.md`](aggregator-package.md) | Implementing or changing `cpf-utils`, `cnpj-utils`, or `br-utils` |
| `demo-pages` | [`demo-pages.md`](demo-pages.md) | Updating static demo pages in `packages/cpf-utils/demo/` or `packages/cnpj-utils/demo/` |
| `ci-release` | [`ci-release.md`](ci-release.md) | Editing `.github/workflows/` files; understanding the CI pipeline; local validation before declaring done |
| `dependencies` | [`dependencies.md`](dependencies.md) | Adding any new npm or workspace dependency; declaring `workspace:*` deps; updating `bun.lock` |

## Adding a harness

### Root harness (this directory)

1. Add `<name>.md` here with YAML frontmatter (`id`, `title`, `scope`, `triggers`).
2. Register it in the table above (this file is the root harness catalog — do not duplicate the table elsewhere).
3. Add a one-line pointer under **Agent harnesses** in [`AGENTS.md`](../AGENTS.md) linking back here.

### Package-level harness

1. Add `packages/<pkg>/agents/` and/or `packages/<pkg>/AGENTS.md` for rules that apply only to that package.
2. Register package harnesses in `packages/<pkg>/agents/README.md` when using an `agents/` directory.
3. Do not duplicate root harness content unless the package genuinely diverges; state overrides explicitly.
