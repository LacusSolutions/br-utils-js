---
id: new-package
title: Scaffold a new workspace package
scope: packages/
triggers:
  - adding a new package to the monorepo
  - scaffolding a new cpf-*, cnpj-*, or br-* package
  - creating a new workspace member
---

# new-package

Step-by-step checklist for adding a new package to the br-utils-js workspace. Adding a package is a rare, high-blast-radius operation. All paths are relative to the **js/** project root.

## Prerequisites

- **Developer approval is required** before adding any new package or dependency. Stop and confirm before starting. See [`.context/dependencies.md`](dependencies.md).
- Identify the archetype (DV / Val / Fmt / Gen / Foundation / Aggregator) — this determines the `src/` layout and export patterns. See [`.context/package-arch.md`](package-arch.md).
- Identify the canonical sibling package to clone from (table below).

## Clone-from table

| New package type | Clone from |
|-----------------|-----------|
| `{domain}-fmt` | `cpf-fmt` |
| `{domain}-val` | `cpf-val` |
| `{domain}-gen` | `cpf-gen` |
| `{domain}-dv` | `cpf-dv` |
| `{domain}-utils` (aggregator) | `cpf-utils` |
| `br-*` (multi-domain aggregator) | `br-utils` |
| Foundation utility | `utils` |

## Step 1 — Create the package directory

```bash
mkdir -p packages/<pkg>/src packages/<pkg>/tests
```

Create these files (copy from sibling and adapt):

```
packages/<pkg>/
  src/
    index.esm.ts
    index.cjs.ts
    index.umd.ts
    (domain source files per archetype)
  tests/
    (test files per unit-tests harness)
  rollup.config.mjs
  tsconfig.json
  package.json
```

## Step 2 — `package.json`

Copy from the sibling package of the same archetype and update all package-specific fields:

```json
{
  "name": "@lacussoft/<pkg>",
  "version": "0.0.0",
  "description": "<one-line description>",
  "license": "MIT",
  "author": {
    "name": "Julio L. Muller",
    "url": "https://github.com/juliolmuller"
  },
  "files": ["dist/**/*", "README.md", "README.pt.md", "CHANGELOG.md", "LICENSE"],
  "publishConfig": { "access": "public", "provenance": true },
  "sideEffects": false,
  "types": "./dist/index.d.ts",
  "module": "./dist/index.mjs",
  "main": "./dist/index.cjs",
  "exports": {
    ".": {
      "import": { "types": "./dist/index.d.ts", "default": "./dist/index.mjs" },
      "require": { "types": "./dist/index.d.cts", "default": "./dist/index.cjs" }
    }
  },
  "scripts": {
    "build": "rollup --config",
    "type-check": "tsc",
    "lint": "bun run lint:ci --fix",
    "lint:ci": "eslint src/ tests/ rollup.config.mjs",
    "test": "bun run test:ci --coverage --coverage-reporter=lcov --coverage-dir=tests/__coverage__",
    "test:ci": "bun test --only-failures"
  },
  "dependencies": {
    "@lacussoft/utils": "workspace:*"
  }
}
```

Set `"version": "0.0.0"` — Changesets will manage the version from the first release.

## Step 3 — `tsconfig.json`

```json
{
  "extends": "../../build/tsconfig.json",
  "include": ["src/"]
}
```

No other overrides unless genuinely required.

## Step 4 — `rollup.config.mjs`

```js
import { makeRollupConfig } from '../../build/rollup/config.mjs';
import packageMeta from './package.json' with { type: 'json' };

export default makeRollupConfig({
  bannerTitle: 'Lacus Solutions :: <pkg-display-name>',
  creationYear: <year>,
  umdGlobalName: '<camelOrPascalName>',
  umdDistFileName: '<pkg>',
  packageMeta,
});
```

See [`.context/build-config.md`](build-config.md) for `umdGlobalName` conventions and parameter details.

## Step 5 — Implement `src/`

Follow [`.context/package-arch.md`](package-arch.md):

- Choose the layout for the archetype (DV / Val / Fmt / Gen / Foundation / Aggregator).
- Implement the facade function (Val/Fmt/Gen) or main class (DV) or re-export modules (Aggregator).
- Write `exceptions.ts` with abstract base classes + concrete subclasses; include `Object.setPrototypeOf`.
- Write `types.ts` for all TypeScript types and input shapes.
- Write `index.esm.ts`, `index.cjs.ts`, `index.umd.ts` per archetype pattern.
- Add JSDoc per [`.context/jsdoc.md`](jsdoc.md).

## Step 6 — Add `tests/`

Follow [`.context/unit-tests.md`](unit-tests.md):

- `tests/<pkg>.spec.ts` — behavior tests (happy path, edge cases, error cases)
- `tests/exceptions.spec.ts` — error class instantiation and prototype chain
- `tests/output.spec.ts` — ESM/CJS/UMD exports, `.d.ts` presence

## Step 7 — Wire root scripts

Add filtered scripts to root `package.json` following the existing naming pattern:

```json
{
  "scripts": {
    "build:<domain>": "bun run --filter \"@lacussoft/{domain}-*\" build",
    "build:<pkg>": "bun run --filter \"@lacussoft/<pkg>\" build",
    "test:<pkg>": "bun run --filter \"@lacussoft/<pkg>\" test",
    "lint:<pkg>": "bun run --filter \"@lacussoft/<pkg>\" lint",
    "type-check:<pkg>": "bun run --filter \"@lacussoft/<pkg>\" type-check"
  }
}
```

If a domain group (`cpf`, `cnpj`) already has a wildcard script (`build:cpf`), the new package is picked up automatically — only add the individual `build:<pkg>` script.

## Step 8 — Declare workspace dependencies

If the package depends on other internal packages, declare them with `workspace:*`:

```json
{
  "dependencies": {
    "@lacussoft/utils": "workspace:*",
    "@lacussoft/<sibling>": "workspace:*"
  }
}
```

Then run from the project root:

```bash
bun install
```

See [`.context/dependencies.md`](dependencies.md) for direction rules (e.g. `utils` must not depend on `cpf-fmt`).

## Step 9 — README and initial changeset

- Write `README.md` and `README.pt.md` per [`.context/readme-docs.md`](readme-docs.md).
- If the package ships user-facing code from the first commit, create a changeset per [`.context/changelogs.md`](changelogs.md).

## Final checklist

- [ ] Directory structure matches the archetype
- [ ] `package.json`: `@lacussoft/<pkg>` name, `exports` map, `files`, all scripts
- [ ] `tsconfig.json` extends `../../build/tsconfig.json`; `include: ["src/"]`
- [ ] `rollup.config.mjs` uses `makeRollupConfig` with required params
- [ ] `src/` implemented per `package-arch.md`
- [ ] `tests/` implemented per `unit-tests.md`
- [ ] Root `package.json` scripts added
- [ ] Workspace deps declared; `bun install` run
- [ ] `bun run build` succeeds
- [ ] `bun run test:<pkg>` passes
- [ ] `bun run lint:<pkg>` passes
- [ ] `bun run type-check:<pkg>` passes
- [ ] `README.md` and `README.pt.md` written
- [ ] Changeset added if shipping user-facing code

## Package-level overrides

Before applying this harness, check whether a package-level `AGENTS.md` or `agents/` directory was created for this package. If so, follow it over this file for any conflicting instructions (see [`.context/README.md`](README.md#instruction-precedence)).
