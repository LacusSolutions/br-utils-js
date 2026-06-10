---
id: package-arch
title: Package implementation architecture
scope: packages/*/src/**/*.ts
triggers:
  - implementing or changing package source code
  - adding a new class, facade function, or option
  - designing or reviewing src/ layout
  - adding error handling (throwing vs onFail)
  - changing index entry points
---

# package-arch

Follow the repeatable implementation architecture when adding or changing source code in any `packages/*` package. All paths are relative to the **js/** project root.

## Package archetypes

| Archetype | Examples | Default export |
|-----------|---------|----------------|
| **DV** (check digits) | `cpf-dv`, `cnpj-dv` | Main class (e.g. `CpfCheckDigits`) |
| **Val** (validator) | `cpf-val`, `cnpj-val` | Facade function (e.g. `cpfVal`) |
| **Fmt** (formatter) | `cpf-fmt`, `cnpj-fmt` | Facade function (e.g. `cpfFmt`) |
| **Gen** (generator) | `cpf-gen`, `cnpj-gen` | Facade function (e.g. `cpfGen`) |
| **Foundation** | `utils` | None — named exports only |
| **Aggregator** | `cpf-utils`, `cnpj-utils`, `br-utils` | Pre-built singleton (e.g. `new CpfUtils()`) |

## Canonical `src/` layouts

### DV

```
src/
  {domain}-check-digits.ts   # Main class
  exceptions.ts
  types.ts
  index.esm.ts
  index.cjs.ts
  index.umd.ts
```

### Val / Fmt / Gen

```
src/
  {domain}-{val|fmt|gen}.ts  # Facade function
  {domain}-{validator|formatter|generator}.ts  # Main class
  {domain}-{validator|formatter|generator}-options.ts  # Options class
  exceptions.ts
  types.ts
  index.esm.ts
  index.cjs.ts
  index.umd.ts
```

### Foundation (`utils`)

```
src/
  util-a.ts
  util-b.ts
  types.ts
  index.esm.ts   # named re-exports of all utilities
```

## Facade function pattern (Val / Fmt / Gen)

The facade function is a thin wrapper that instantiates the main class and calls the primary method:

```ts
// cpf-fmt.ts
export function cpfFmt(input: CpfInput, options?: CpfFormatterOptionsInput): string {
  return new CpfFormatter(options).format(input);
}
```

Rationale: the facade provides a stateless one-liner API; the class provides a stateful configurable API.

## Error handling: throw vs `onFail`

| Error category | Handling |
|----------------|---------|
| **Type errors** (wrong JS type passed) | Always `throw` — extends `TypeError` |
| **Length / business-rule failures** (right type, wrong value) | Call `onFail` callback — extends `Error` |

The `onFail` callback is configured in the options object and defaults to returning an empty string (for Fmt/Gen) or `false` (for Val). It must never throw by default.

## `exceptions.ts` structure

Every package that can fail exposes two abstract base classes plus concrete subclasses:

```ts
// Abstract type error base
export abstract class {Domain}{Op}TypeError extends TypeError {
  public constructor(…) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = this.constructor.name;
  }
}

// Abstract domain exception base
export abstract class {Domain}{Op}Exception extends Error {
  public constructor(…) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = this.constructor.name;
  }
}
```

`Object.setPrototypeOf(this, new.target.prototype)` is **required** in every constructor — it fixes the prototype chain when the class is transpiled/bundled. Do not omit it.

## Index entry points

### ESM (`index.esm.ts`)

Named default export (facade fn or singleton) + full named re-exports:

```ts
export { cpfFmt as default } from './cpf-fmt';

export * from './cpf-fmt';
export * from './cpf-formatter';
export * from './cpf-formatter-options';
export * from './exceptions';
export * from './types';
```

For DV packages, the default is the class itself (not a facade fn).

### CJS (`index.cjs.ts`)

DV packages — subclass trick to make the class callable as default:

```ts
import * as all from './index.esm';

const { default: _, ...rest } = all;

class CpfCheckDigits extends rest.CpfCheckDigits {}

export default Object.assign(CpfCheckDigits, rest);
```

Fmt/Val/Gen packages — callable function default with named exports attached:

```ts
import * as all from './index.esm';

const { default: _, cpfFmt: baseCpfFmt, ...rest } = all;

const cpfFmt: typeof baseCpfFmt = (...args) => baseCpfFmt(...args);

export default Object.assign(cpfFmt, rest);
```

### UMD (`index.umd.ts`)

Same pattern as CJS but re-exported for the UMD bundle entry (Rollup picks it up via `umdEntryPoint`). In practice, `index.umd.ts` and `index.cjs.ts` are often identical or differ only in the export style. Check existing packages before deviating.

## Options class pattern (Fmt / Gen / Val)

```ts
export class CpfFormatterOptions {
  static readonly DEFAULT_HIDDEN = false;

  public hidden: boolean;

  public constructor(options?: CpfFormatterOptionsInput) {
    // type-check options object → throw CpfFormatterOptionsTypeError
    // validate ranges/values → throw CpfFormatterOptions…Exception
    this.hidden = options?.hidden ?? CpfFormatterOptions.DEFAULT_HIDDEN;
  }
}
```

Defaults live as `static readonly` class properties. The constructor validates options and throws on invalid types; for invalid values (out-of-range, etc.) it throws the domain Exception subclass.

## Dependency direction

```
utils  →  {cpf,cnpj}-dv
       →  {cpf,cnpj}-{fmt,gen,val}
       →  {cpf,cnpj}-utils
       →  br-utils
```

Upstream packages must not import downstream ones. `utils` is a leaf with no internal deps.

## Checklist

- [ ] `src/` layout matches the archetype (DV / Val / Fmt / Gen / Foundation / Aggregator)
- [ ] Facade function present for Val/Fmt/Gen; class is the default export for DV
- [ ] Type errors throw; length/business-rule failures call `onFail`
- [ ] `exceptions.ts` defines abstract base + concrete subclasses, each with `Object.setPrototypeOf`
- [ ] `index.esm.ts`, `index.cjs.ts`, `index.umd.ts` follow the pattern for this archetype
- [ ] Options class uses `static readonly` defaults; constructor validates and throws
- [ ] JSDoc on all exported symbols per [`agents/jsdoc.md`](jsdoc.md)
- [ ] Tests per [`agents/unit-tests.md`](unit-tests.md)

## Package-level overrides

Before applying this harness, check whether the target package defines `packages/<pkg>/AGENTS.md` or `packages/<pkg>/agents/`. If either exists and contradicts this file on the same topic, **follow the package-level instruction** (see [`agents/README.md`](README.md#instruction-precedence)).

## Reference packages

| Archetype | Canonical package | Key files |
|-----------|------------------|-----------|
| DV | `cpf-dv` | `src/cpf-check-digits.ts`, `src/index.cjs.ts` |
| Fmt | `cpf-fmt` | `src/cpf-formatter.ts`, `src/cpf-fmt.ts`, `src/index.cjs.ts` |
| Val | `cpf-val` | `src/cpf-validator.ts`, `src/cpf-val.ts` |
| Gen | `cpf-gen` | `src/cpf-generator.ts`, `src/cpf-gen.ts` |
| Foundation | `utils` | `src/describe-type.ts`, `src/escape-html.ts` |
| Aggregator | `cpf-utils` | `src/cpf-utils.ts`, `src/index.esm.ts` |
