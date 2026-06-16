---
id: public-api
title: Public API change coordination
scope: packages/*/src/, packages/*/tests/, packages/*/README.md, .changeset/*.md
triggers:
  - adding, removing, or renaming a public export
  - changing a function or class method signature
  - adding or changing options or defaults
  - behavior changes visible to npm consumers
  - reviewing a PR that modifies the public API
---

# public-api

This is a meta-checklist harness. When a change touches the public API of any `packages/*` package, use this file as the coordination checklist — it ties together the specialized harnesses that each govern one artifact type. All paths are relative to the **js/** project root.

## What counts as a public API change

A change is public-API if it affects anything a downstream npm consumer would observe:

- Adding, removing, or renaming an exported symbol (class, function, type, constant)
- Changing a method or function signature (parameter name, type, optionality, order)
- Adding or removing an option from an options object
- Changing a default value for an option or callback
- Changing thrown error types or their properties
- Changes to `exports` map in `package.json` (new/removed entry points)

Changes that are **not** public-API: test files, CI configs, internal-only helpers not exported, `devDependencies`, lockfile, `.gitignore`.

## Coordinated artifacts checklist

For every public API change, work through the following artifacts in order:

| # | Artifact | Harness |
|---|----------|---------|
| 1 | Source (`src/`) changes + `exceptions.ts` | [`.context/package-arch.md`](package-arch.md) |
| 2 | JSDoc on all changed/new symbols | [`.context/jsdoc.md`](jsdoc.md) |
| 3 | Behavior unit tests (`*.spec.ts`) | [`.context/unit-tests.md`](unit-tests.md) |
| 4 | Distribution tests (`output.spec.ts`) — UMD global, ESM/CJS exports, `.d.ts` | [`.context/unit-tests.md`](unit-tests.md) |
| 5 | README update (options table, usage example) | [`.context/readme-docs.md`](readme-docs.md) |
| 6 | Changeset entry | [`.context/changelogs.md`](changelogs.md) |
| 7 | Workspace dependency update (if new internal dep) | [`.context/dependencies.md`](dependencies.md) |
| 8 | Domain parity check (if `cpf-*` / `cnpj-*`) | [`.context/domain-parity.md`](domain-parity.md) |

## Decision flow

```
src/ change?
  │
  ├─ yes → always update behavior tests (step 3)
  │
  └─ export surface change? (new/removed/renamed export, signature change)
       │
       ├─ yes → also update output.spec.ts (step 4)
       │
       └─ visible option or default change?
            │
            ├─ yes → update README (step 5)
            │
            └─ user-facing? (src/, rollup config, public README)
                 │
                 ├─ yes → add changeset (step 6)
                 │
                 └─ dev-only (tests, CI, lint) → skip changeset
```

## Before starting

1. Identify all packages affected (direct change + transitive aggregators like `cpf-utils`, `br-utils`).
2. For each affected package, run through the 8-step checklist above.
3. Do not mark a task complete until every artifact step is verified or explicitly skipped with a reason.

## `output.spec.ts` scope

Distribution tests (`packages/<pkg>/tests/output.spec.ts`) must be updated whenever the export surface changes. They verify:

- UMD global is accessible by `umdGlobalName`
- ESM default export is the expected value (facade fn or singleton)
- CJS default export matches ESM default
- Named exports include all public symbols
- `.d.ts` and `.d.cts` are present and importable

If `output.spec.ts` does not exist for the affected package, create it following the pattern in `packages/cpf-fmt/tests/output.spec.ts`.

## Aggregator cascade

When changing a sub-package public API, check whether the aggregator that wraps it needs updating:

| Changed sub-package | Check aggregator |
|--------------------|-----------------|
| `cpf-{fmt,gen,val}` | `cpf-utils` re-export module + `CpfUtils` class |
| `cnpj-{fmt,gen,val}` | `cnpj-utils` re-export module + `CnpjUtils` class |
| `cpf-utils` or `cnpj-utils` | `br-utils` |

If the aggregator re-export does not yet expose the new symbol, add it to the appropriate re-export module (see [`.context/aggregator-package.md`](aggregator-package.md)).

## Checklist

- [ ] All `src/` changes implemented per [`.context/package-arch.md`](package-arch.md)
- [ ] JSDoc updated on all changed symbols per [`.context/jsdoc.md`](jsdoc.md)
- [ ] Behavior tests added or updated in `tests/*.spec.ts`
- [ ] `output.spec.ts` updated if export surface changed
- [ ] README updated if option, default, or public behavior changed
- [ ] Changeset added unless change is entirely dev-only
- [ ] Workspace deps updated if new internal dep added
- [ ] Domain parity check done if change is in `cpf-*` or `cnpj-*`
- [ ] Aggregator packages updated if new symbol needs to be re-exported

## Package-level overrides

Before applying this harness, check whether the target package defines `packages/<pkg>/AGENTS.md` or `packages/<pkg>/agents/`. If either exists and contradicts this file on the same topic, **follow the package-level instruction** (see [`.context/README.md`](README.md#instruction-precedence)).
