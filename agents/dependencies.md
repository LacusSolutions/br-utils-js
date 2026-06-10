---
id: dependencies
title: Dependency policy
scope: package.json, packages/*/package.json, bun.lock
triggers:
  - adding a new npm dependency
  - adding a devDependency or peerDependency
  - declaring a workspace dependency between packages
  - changing dependency versions
  - asking whether a dependency is allowed
---

# dependencies

Manage dependencies in the br-utils-js monorepo following the rules below. All paths are relative to the **js/** project root.

## Repository constraints

### Hard rules

- **Always ask the developer** before adding any new dependency (root or package) — npm package, `devDependency`, or `peerDependency`. Do not assume approval is implied by any task description.
- Internal monorepo deps must be declared with **`workspace:*`** in the consumer's `package.json`. Run `bun install` after any addition or change to update `bun.lock`.
- Follow the strict **dependency direction** — upstream packages must not depend on downstream ones:

```
utils  →  {cpf,cnpj}-dv
       →  {cpf,cnpj}-{fmt,gen,val}
       →  {cpf,cnpj}-utils
       →  br-utils
```

Reverse edges (e.g. `utils` importing from `cpf-fmt`) are forbidden.

- Do not add package-level build or lint tooling (e.g. `eslint`, `typescript`, `rollup` as direct per-package `devDependencies`). These live at the root and are consumed via root configs.

### When developer approval is NOT needed

Using an **already-declared workspace dependency** that appears in a sibling package of the same archetype is safe to replicate without explicit approval (e.g. adding `@lacussoft/utils` to a new `cpf-*` package mirrors every existing `cpf-*` package). Verify the existing declaration before copying.

## Before changing dependencies

1. Check `packages/<pkg>/package.json` `"dependencies"` and `"peerDependencies"` fields.
2. Check `package.json` root `"devDependencies"` to confirm the tool is not already available.
3. Identify downstream packages that will be affected by a new internal dep (add `bun install` to the task checklist).
4. If approval is needed, stop and ask — do not speculatively add the dependency.

## Internal workspace dependencies

Declare internal deps with `workspace:*`:

```json
{
  "dependencies": {
    "@lacussoft/utils": "workspace:*"
  }
}
```

After editing any `package.json` dependency field, run from the project root:

```bash
bun install
```

This regenerates `bun.lock` and symlinks the workspace package. Do not commit a stale lockfile.

## Dependency direction reference

| Package | Allowed upstream deps |
|---------|----------------------|
| `utils` | (none — foundation) |
| `{cpf,cnpj}-dv` | `utils` |
| `{cpf,cnpj}-{fmt,gen,val}` | `utils`, same-domain `-dv` |
| `{cpf,cnpj}-utils` | all same-domain sub-packages |
| `br-utils` | `cpf-utils`, `cnpj-utils` |

## Changesets

Adding or bumping a runtime `dependency` or `peerDependency` in `packages/<pkg>/package.json` is user-facing and requires a changeset (see [`agents/changelogs.md`](changelogs.md)). Adding `devDependencies` only does not require a changeset.

## Package-level overrides

Before applying this harness, check whether the target package defines `packages/<pkg>/AGENTS.md` or `packages/<pkg>/agents/`. If either exists and contradicts this file on the same topic, **follow the package-level instruction** (see [`agents/README.md`](README.md#instruction-precedence)).

## Reference

| Concern | File |
|---------|------|
| Root dependencies | `package.json` `"devDependencies"` |
| Package runtime deps | `packages/<pkg>/package.json` `"dependencies"` |
| Lockfile | `bun.lock` |
| Build order | Root `package.json` `"scripts"` (`build:*`) |
