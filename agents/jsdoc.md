---
id: jsdoc
title: JSDoc conventions
scope: packages/*/src/**/*.ts
triggers:
  - adding or updating JSDoc comments
  - documenting a new class, function, or type
  - reviewing JSDoc on a changed API
  - adding @throws, @param, or @returns annotations
---

# jsdoc

Write and maintain JSDoc for all exported and internal API symbols across br-utils-js packages. All paths are relative to the **js/** project root.

## Repository constraints

- **All public and internal symbols get JSDoc** — exported classes, functions, types, constants, abstract bases, and non-obvious private members.
- Do **not** use JSDoc to narrate implementation steps or restate what the code obviously does. Document intent, constraints, and behavior the code cannot express.
- Tone: concise and user-facing, as if writing npm package documentation.

## Before writing JSDoc

1. Read the symbol's source and any related `types.ts` and `exceptions.ts`.
2. Identify: what does it do, what can go wrong (errors thrown or `onFail` called), what options control behavior.
3. For aggregator classes (`CpfUtils`, `CnpjUtils`, `BrUtils`), collect cross-package error types needed for `@typedef` imports.

## Class documentation

```ts
/**
 * One-sentence description of what the class does and who it is for.
 * A second sentence only when necessary to clarify constraints or default behavior.
 */
export class CpfFormatter {
  /**
   * Creates a new `CpfFormatter` with optional default options.
   *
   * When `defaultOptions` is a `CpfFormatterOptions` instance, that instance is
   * used directly (no copy is created). When a plain object or nothing is
   * passed, a new `CpfFormatterOptions` instance is created from it.
   *
   * @throws {CpfFormatterOptionsTypeError} If any option has an invalid type.
   * @throws {CpfFormatterOptionsHiddenRangeInvalidException} If `hiddenStart`
   *   or `hiddenEnd` are out of valid range.
   */
  public constructor(defaultOptions?: CpfFormatterOptionsInput) { … }
}
```

### Rules

- One-sentence class summary unless a second sentence is necessary for constraints.
- Constructor doc: describe accepted input shapes and the differences in behavior between them. List every `@throws` with its condition.
- Method docs: describe the behavior, not the implementation. Include `@throws` for thrown errors; mention `onFail` callback for length/validation failures that do not throw.

## Error and exception documentation

```ts
/**
 * Base error class for all `cpf-fmt` type-related errors.
 *
 * Extends `TypeError`. Ensures proper prototype chain setup and sets the
 * error name from the constructor automatically.
 */
export abstract class CpfFormatterTypeError extends TypeError { … }

/**
 * Error raised when the input provided to the CPF formatter is not of the
 * expected type {@link CpfInput}. Includes both actual and expected type in
 * the error message.
 */
export class CpfFormatterInputTypeError extends CpfFormatterTypeError { … }
```

Abstract bases need a doc block explaining the inheritance hierarchy and the `Object.setPrototypeOf` behavior. Concrete subclasses document what they capture (input, option name, range bounds, etc.).

## Constants and option defaults

Document inline at the declaration:

```ts
/**
 * The standard length of a CPF identifier (11 digits).
 */
export const CPF_LENGTH = 11;

/**
 * Default value for the `hidden` option.
 */
static readonly DEFAULT_HIDDEN = false;
```

## Cross-file `@typedef` imports (aggregators)

Aggregator classes (`CpfUtils`, `CnpjUtils`, `BrUtils`) re-export symbols from sub-packages. TypeScript cannot always inline cross-package error types in IDE tooltips — use `@typedef` to pull them into the aggregator's JSDoc scope:

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

Place the `@typedef` block at the top of the file, after imports. Each `@typedef` must be separated by a blank line within the comment (two newlines between entries), matching the existing pattern.

## `@throws` annotation style

```ts
 * @throws {ClassName} Short description of the trigger condition.
 * @throws {AnotherClass} If some other condition is met.
```

- Use the concrete error class name (not `Error` or `TypeError` generically).
- Describe the trigger in one short clause; no full sentence needed.
- For errors defined in `exceptions.ts` of a sibling sub-package, use the `@typedef` import pattern above so the type resolves in IDE hover.

## What not to document

- Do not add `@param` for every constructor argument unless the parameter name alone is ambiguous.
- Do not add `@returns` unless the return value is non-obvious.
- Do not add `@see` links unless the reference genuinely helps (avoids circular docs).
- Do not repeat the type signature in words (TypeScript already provides it).

## Checklist

- [ ] Every exported symbol has a JSDoc block
- [ ] Internal non-obvious symbols have JSDoc blocks
- [ ] Abstract base classes describe inheritance + `Object.setPrototypeOf` behavior
- [ ] All `@throws` are listed with concrete class names and trigger conditions
- [ ] Aggregator classes have `@typedef` imports for cross-package errors
- [ ] Constants and static defaults have inline doc lines
- [ ] No narration of obvious code

## Package-level overrides

Before applying this harness, check whether the target package defines `packages/<pkg>/AGENTS.md` or `packages/<pkg>/agents/`. If either exists and contradicts this file on the same topic, **follow the package-level instruction** (see [`agents/README.md`](README.md#instruction-precedence)).

## Reference

| Concern | Canonical example |
|---------|-------------------|
| Class + constructor JSDoc | `packages/cpf-fmt/src/cpf-formatter.ts` |
| Abstract base error JSDoc | `packages/cpf-fmt/src/exceptions.ts` |
| `@typedef` imports | `packages/cpf-utils/src/cpf-utils.ts` |
| Constants JSDoc | `packages/cpf-fmt/src/cpf-formatter-options.ts` |
