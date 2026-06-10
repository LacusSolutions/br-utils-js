---
id: build-config
title: Build configuration
scope: build/rollup/, packages/*/rollup.config.mjs, packages/*/tsconfig.json
triggers:
  - changing a package's rollup configuration
  - changing a package's tsconfig.json
  - adding a new entry point or build output format
  - modifying the shared build helpers in build/rollup/
  - investigating build artifacts in dist/
---

# build-config

Manage the Rollup and TypeScript build setup for br-utils-js packages. All paths are relative to the **js/** project root.

## Repository constraints

- **Do not duplicate build logic in packages.** Shared logic lives in `build/rollup/`; packages only parameterize it via `makeRollupConfig`.
- **Do not add package-level TypeScript configs beyond extending the base.** Each package `tsconfig.json` must extend `../../build/tsconfig.json`.
- `rollup.config.mjs` and `tsconfig.json` **are user-facing** (they shape published output). Changes to these files require a changeset — see [`agents/changelogs.md`](changelogs.md).
- **Do not emit build artifacts outside `dist/`.** Source must stay in `src/`.

## Shared build setup (`build/rollup/`)

All packages consume the factory function from `build/rollup/config.mjs`:

```js
import { makeRollupConfig } from '../../build/rollup/config.mjs';
import packageMeta from './package.json' with { type: 'json' };

export default makeRollupConfig({
  bannerTitle: 'Lacus Solutions :: <pkg-name>',
  creationYear: <year>,
  umdGlobalName: '<camelOrPascalName>',
  umdDistFileName: '<pkg-name>',
  packageMeta,
});
```

### `makeRollupConfig` parameters

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `bannerTitle` | yes | — | Text after `Lacus Solutions ::` in the bundle header comment |
| `creationYear` | yes | — | First year of the package copyright |
| `umdGlobalName` | yes | — | Global variable name in UMD bundle (e.g. `cpfFmt`, `CpfCheckDigits`) |
| `umdDistFileName` | yes | — | Filename stem for UMD outputs (e.g. `cpf-fmt` → `dist/cpf-fmt.js`) |
| `packageMeta` | yes | — | Full `package.json` import (`{ type: 'json' }` import assertion) |
| `cjsEntryPoint` | no | `src/index.cjs.ts` | Override only if file is named differently |
| `cjsExports` | no | `'default'` | `'default'` or `'named'` |
| `esmEntryPoint` | no | `src/index.esm.ts` | Override only if file is named differently |
| `esmExports` | no | `'auto'` | `'default'`, `'named'`, or `'auto'` |
| `umdEntryPoint` | no | `src/index.umd.ts` | Override only if file is named differently |

No existing package overrides the default entry points — do not override them without a clear reason.

### `umdGlobalName` conventions

| Archetype | Pattern | Example |
|-----------|---------|---------|
| fmt / val / gen | camelCase facade fn name | `cpfFmt`, `cnpjVal` |
| dv | PascalCase class name | `CpfCheckDigits`, `CnpjCheckDigits` |
| utils / aggregator | camelCase namespace | `lacusUtils`, `cpfUtils`, `brUtils` |

## TypeScript setup

Each package `tsconfig.json`:

```json
{
  "extends": "../../build/tsconfig.json",
  "include": ["src/"]
}
```

Override only when genuinely necessary (e.g. `"include"` to add `tests/` for type-checking). Do not copy base config options into a package `tsconfig.json` unless overriding them.

## Output artifacts (`dist/`)

Every package produces these artifacts:

| File | Format |
|------|--------|
| `dist/index.mjs` | ES Module |
| `dist/index.d.ts` | ESM type declarations |
| `dist/index.cjs` | CommonJS |
| `dist/index.d.cts` | CJS type declarations |
| `dist/<pkg>.js` | UMD (unminified) |
| `dist/<pkg>.min.js` | UMD (minified) |

`dist/` is in `.gitignore` and excluded from `package.json` `"files"` only via explicit inclusion (`"files": ["dist/**/*", …]`).

## When to extend the shared build

**Add or change `build/rollup/` helpers** only when the change applies to **all** packages (e.g. new output format, updated banner logic).

**Parameterize via `rollup.config.mjs`** when the change is package-specific (e.g. different `umdGlobalName`, different `creationYear`).

## Running builds

```bash
# All packages (dependency order)
bun run build

# Single package group
bun run build:cpf
bun run build:cnpj

# Single package
bun run build:cpf-fmt
```

After building, `output.spec.ts` tests validate artifacts in `dist/`. Run `bun run test:<pkg>` after every build to confirm.

## Checklist

- [ ] `rollup.config.mjs` uses `makeRollupConfig` — no custom Rollup config
- [ ] `bannerTitle`, `creationYear`, `umdGlobalName`, `umdDistFileName` set correctly
- [ ] `packageMeta` imported with `{ type: 'json' }` assertion
- [ ] `tsconfig.json` extends `../../build/tsconfig.json`
- [ ] `dist/` artifacts built and validated via `bun run test:<pkg>`
- [ ] Changeset added if `rollup.config.mjs` or `tsconfig.json` changed

## Package-level overrides

Before applying this harness, check whether the target package defines `packages/<pkg>/AGENTS.md` or `packages/<pkg>/agents/`. If either exists and contradicts this file on the same topic, **follow the package-level instruction** (see [`agents/README.md`](README.md#instruction-precedence)).

## Reference

| Concern | Path |
|---------|------|
| Shared config factory | `build/rollup/config.mjs` |
| CJS build helper | `build/rollup/build-cjs.mjs` |
| ESM build helper | `build/rollup/build-esm.mjs` |
| UMD build helper | `build/rollup/build-umd.mjs` |
| Base TypeScript config | `build/tsconfig.json` |
| Package Rollup config | `packages/*/rollup.config.mjs` |
| Package TypeScript config | `packages/*/tsconfig.json` |
| Canonical example | `packages/cpf-fmt/rollup.config.mjs` |
