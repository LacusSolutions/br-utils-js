---
id: changelogs
title: Changelog entries (Changesets)
scope: .changeset/*.md
triggers:
  - adding a changeset entry
  - deciding whether a change needs a changeset
  - choosing a SemVer bump level
  - writing or editing .changeset/*.md files
  - reviewing changelog entries before release
---

# changelogs

Maintain `.changeset/*.md` files that feed `packages/*/CHANGELOG.md` at release. All git and Changesets operations run from the **js/** project root.

**Naming note:** The harness is called `changelogs` because agents interact with the changelog workflow. The underlying tool is **Changesets** — but you never run `changeset version` or `changeset publish`; only the developer does that.

## Repository constraints

- `.changeset/*.md` files are the **only** files agents create or edit in this workflow.
- Do **not** edit `packages/*/CHANGELOG.md` — Changesets owns them.
- Do **not** edit any `package.json` `"version"` field — Changesets owns those too.
- Do **not** run `bun run changeset version`, `bun run changeset publish`, or `bun run release`.
- Do not delete or rename a changeset you did not create this turn unless explicitly merging entries.

## Before writing a changeset

1. List all files you changed this turn.
2. Classify each file as **user-facing** or **dev-only** (table below).
3. If every change is dev-only → skip the changeset entirely.
4. If any change is user-facing → create (or edit) a changeset describing only the user-facing parts.
5. Check `.changeset/` for an existing entry for the same logical change; edit it instead of creating a duplicate.

### User-facing vs dev-only

| User-facing (changeset needed) | Dev-only (skip) |
|-------------------------------|-----------------|
| Anything under `src/` | `tests/`, `__tests__/`, `__coverage__/` |
| `rollup.config.mjs`, `tsconfig.json` | `eslint.config.mjs`, `.lintstagedrc`, `.editorconfig`, `.husky/` |
| Runtime `"dependencies"`, `"peerDependencies"`, `"name"`, `"exports"`, `"types"` in `package.json` | `"devDependencies"`, `"scripts"`, `"lint-staged"` in `package.json` |
| Public `README.md` | CI workflows under `.github/`, root `build/` helpers |
| | `bun.lock`, `dist/`, `node_modules/`, `.gitignore` |

## File naming

Use a three-word kebab slug (match the Changesets CLI convention):

```
.changeset/structured-cpf-errors.md
.changeset/brisk-otters-rest.md
```

Generate three random English words separated by hyphens. Do not reuse existing filenames.

## File format

```markdown
---
"@lacussoft/<pkg-a>": patch
"@lacussoft/<pkg-b>": minor
---

One sentence describing the user-facing change.
```

- Keys must match the `"name"` in each `packages/<pkg>/package.json` (always `@lacussoft/<pkg>`).
- Include **every** package whose user-facing source was modified directly — not cascades, which `.changeset/config.json` handles automatically via `"updateInternalDependencies": "patch"`.

## Choosing the bump level

| Level | When to use |
|-------|-------------|
| **major** | Removal or rename of a public export; signature change; behavior change that breaks callers; raising minimum Node/Bun version |
| **minor** | New public export, class, or option |
| **patch** | Bug fix in `src/`; `README.md` user-visible fix; `rollup.config.mjs` / `tsconfig.json` change whose bundle effect is invisible to callers; runtime dep bump that doesn't surface |

## Conciseness rules (strict)

- **One sentence per changeset body.** Two sentences only when the second is a brief migration tip: "To restore the old behavior, …".
- **No expository prose.** No motivation, internals, test details, or doc recaps.
- **Use backticks** for every class, function, option, export, file path, and CLI flag.
- Keep descriptions minimal: "Fix off-by-one in `cpfVal` array input." beats a paragraph.

## Examples

Minimal patch:

```markdown
---
"@lacussoft/cpf-val": patch
---

Fix off-by-one error in array-input handling of `cpfVal`.
```

Multi-package minor:

```markdown
---
"@lacussoft/cpf-val": minor
"@lacussoft/cpf-utils": minor
---

Add `CpfValidator#strict` mode that throws on ineligible base CPFs instead of returning `false`.
```

Major with migration tip:

```markdown
---
"@lacussoft/cnpj-fmt": major
---

The default `onFail` callback now returns an empty string instead of the original input. To restore the old behavior, pass `onFail: (value) => String(value)` explicitly.
```

## One changeset per turn

You may cover all affected packages in a single changeset entry, or split into multiple entries when changes are independent and should ship in separate release notes. Never create more than one changeset per logical change set.

## Package-level overrides

Before applying this harness, check whether the target package defines `packages/<pkg>/AGENTS.md` or `packages/<pkg>/agents/`. If either exists and contradicts this file on the same topic, **follow the package-level instruction** (see [`agents/README.md`](README.md#instruction-precedence)).

## Reference

| Concern | Path |
|---------|------|
| Changeset files | `.changeset/*.md` |
| Changeset config | `.changeset/config.json` |
| Package npm names | `packages/<pkg>/package.json` `"name"` |
| Package changelogs (read-only) | `packages/<pkg>/CHANGELOG.md` |
