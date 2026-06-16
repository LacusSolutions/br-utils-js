---
id: aggregator-package
title: Aggregator package implementation
scope: packages/cpf-utils/src/, packages/cnpj-utils/src/, packages/br-utils/src/
triggers:
  - implementing or changing an aggregator package
  - adding a new sub-package re-export to cpf-utils, cnpj-utils, or br-utils
  - changing the CpfUtils, CnpjUtils, or BrUtils class API
  - reviewing aggregator src/ structure
---

# aggregator-package

Implement and maintain the three aggregator packages (`cpf-utils`, `cnpj-utils`, `br-utils`) that bundle sub-packages into a unified API. All paths are relative to the **js/** project root.

## Repository constraints

- Aggregator packages are **thin wrappers** — they re-export from sub-packages and add no new business logic.
- Aggregator packages depend on sub-packages via `workspace:*`; sub-packages must not depend on aggregators.
- Tests in aggregator packages import via **workspace package names** (e.g. `@lacussoft/cpf-fmt`), not relative paths — or via the Rollup alias configured in the test setup.
- The ESM default export is a **pre-built singleton** (`new CpfUtils()`), not the class itself.

## `src/` layout

```
src/
  {domain}-formatter.ts    # Re-export module for sub-package
  {domain}-generator.ts
  {domain}-utils.ts        # Main aggregator class
  {domain}-validator.ts
  types.ts                 # Settings input type
  index.esm.ts
  index.cjs.ts
  index.umd.ts
```

`br-utils` wraps both `cpf-utils` and `cnpj-utils` and follows the same pattern with two sets of re-export modules.

## Re-export modules (`{domain}-formatter.ts`)

Each re-export module thin-exports everything from the corresponding sub-package:

```ts
// cpf-utils/src/cpf-formatter.ts
export {
  cpfFmt,
  CpfFormatter,
  CpfFormatterException,
  CpfFormatterInputLengthException,
  CpfFormatterInputTypeError,
  CpfFormatterOptions,
  CpfFormatterTypeError,
  // …all other exports
} from '@lacussoft/cpf-fmt';
export type {
  CpfInput as CpfFormatterInput,
  OnFailCallback as CpfFormatterOnFailCallback,
  CpfFormatterOptionsInput,
  // …
} from '@lacussoft/cpf-fmt';
```

Re-export modules may alias types for clarity (e.g. `CpfInput as CpfFormatterInput`) but must not change values.

## Aggregator class (`{Domain}Utils`)

The main class accepts sub-package instances **or** options objects in its constructor, and delegates all methods to inner instances:

```ts
export class CpfUtils {
  private _formatter: CpfFormatter;
  private _generator: CpfGenerator;
  private _validator: CpfValidator;

  public constructor(defaultSettings?: CpfUtilsSettingsInput) {
    this._formatter =
      defaultSettings?.formatter instanceof CpfFormatter
        ? defaultSettings.formatter
        : new CpfFormatter(defaultSettings?.formatter);
    // …same for generator and validator
  }
}
```

The constructor accepts `undefined`, a plain options object, or an existing instance. This lets users inject pre-configured sub-instances or provide options that propagate down.

## `@typedef` imports in the class file

Cross-package error types must be pulled in via `@typedef` so IDEs can resolve them in constructor `@throws` docs:

```ts
/**
 * @typedef {import('./cpf-formatter').CpfFormatterInputTypeError} CpfFormatterInputTypeError
 *
 *
 * @typedef {import('./cpf-formatter').CpfFormatterOptionsTypeError} CpfFormatterOptionsTypeError
 *
 *
 * @typedef {import('./cpf-generator').CpfGeneratorOptionsTypeError} CpfGeneratorOptionsTypeError
 */
```

Place the block at the top of the file, after imports. Separate each `@typedef` with a blank line (two newlines within the comment block), matching the existing pattern. See [`.context/jsdoc.md`](jsdoc.md) for the full `@typedef` convention.

## Index entry points

### ESM (`index.esm.ts`)

Default export is a **pre-built singleton**; named exports re-export everything:

```ts
import { CpfUtils } from './cpf-utils';

const cpfUtils = new CpfUtils();

export default cpfUtils;

export * from './cpf-formatter';
export * from './cpf-generator';
export * from './cpf-utils';
export * from './cpf-validator';
export * from './types';
```

### CJS (`index.cjs.ts`)

The singleton default is assigned the named exports as properties:

```ts
import * as all from './index.esm';

const { default: baseCpfUtils, ...rest } = all;

const cpfUtils = Object.assign(baseCpfUtils, rest);

export default cpfUtils;
```

### UMD

Same structure as CJS. The `umdGlobalName` in `rollup.config.mjs` exposes the singleton as a global (e.g. `cpfUtils`, `cnpjUtils`, `brUtils`).

## `types.ts` — settings input type

```ts
export type CpfUtilsSettingsInput = {
  formatter?: CpfFormatterOptionsInput | CpfFormatter;
  generator?: CpfGeneratorOptionsInput | CpfGenerator;
  validator?: CpfValidatorOptionsInput | CpfValidator;
};
```

Each field accepts either an options object or an already-constructed instance.

## Tests

Aggregator tests import via workspace package name:

```ts
import cpfUtils from '@lacussoft/cpf-utils';
import { CpfFormatter } from '@lacussoft/cpf-fmt';
```

Or via the Rollup alias (check `rollup.config.mjs` for the alias map if tests fail to resolve). Follow [`.context/unit-tests.md`](unit-tests.md) for test structure.

## Checklist

- [ ] `src/` contains one re-export module per sub-package + `{domain}-utils.ts` + `types.ts` + three index files
- [ ] Re-export modules use workspace npm package names (`@lacussoft/<pkg>`), not relative paths
- [ ] Aggregator class constructor accepts instances **or** options objects for each sub-package
- [ ] `@typedef` imports cover all cross-package error types
- [ ] ESM default is a singleton; CJS/UMD attaches named exports to it
- [ ] `types.ts` defines the settings input type
- [ ] JSDoc per [`.context/jsdoc.md`](jsdoc.md)
- [ ] Tests import via workspace name; behavior and output tests per [`.context/unit-tests.md`](unit-tests.md)

## Package-level overrides

Before applying this harness, check whether the target package defines `packages/<pkg>/AGENTS.md` or `packages/<pkg>/agents/`. If either exists and contradicts this file on the same topic, **follow the package-level instruction** (see [`.context/README.md`](README.md#instruction-precedence)).

## Reference

| Concern | Canonical file |
|---------|---------------|
| Aggregator class | `packages/cpf-utils/src/cpf-utils.ts` |
| Re-export module | `packages/cpf-utils/src/cpf-formatter.ts` |
| ESM singleton default | `packages/cpf-utils/src/index.esm.ts` |
| CJS singleton pattern | `packages/cpf-utils/src/index.cjs.ts` |
| Settings type | `packages/cpf-utils/src/types.ts` |
| Two-domain aggregator | `packages/br-utils/src/br-utils.ts` |
