---
id: unit-tests
title: Package unit tests
scope: packages/*/tests/
triggers:
  - writing or updating unit tests
  - adding test coverage for new behavior
  - fixing failing tests
  - reviewing test changes
  - running package tests
---

# unit-tests

Write and maintain unit tests under `packages/<pkg>/tests/` using the established br-utils-js conventions.

## Repository constraints

### Runtime and runner

Tests use **Bun's built-in test runner** (`bun:test`). Do not add Jest, Vitest, or other test frameworks.

### Location and naming

- Tests live in `tests/` at the package root (never under `src/`).
- Use the `.spec.ts` suffix.
- Name the file after the unit under test when testing a single source file (e.g. `src/cpf-formatter.ts` → `tests/cpf-formatter.spec.ts`). Use a different name only when the test covers a different scope (see [Test file roles](#test-file-roles)).

### Imports

- **Unit tests** import from `../src/<file>` (relative paths into source).
- **Default-export smoke tests** may use `await import('../src/index.esm')`.
- **Aggregator packages** (`cpf-utils`, `cnpj-utils`, `br-utils`) may import workspace dependencies by npm name (`@lacussoft/cpf-fmt`) or by the Rollup alias used in that package (`cpf-utils`, `cnpj-utils`).

### Lint

Tests are linted with the package's other sources: `eslint src/ tests/ rollup.config.mjs`. Follow existing ESLint patterns in sibling test files (e.g. `eslint-disable` only when already used for the same reason).

### Changesets

Test-only changes are **dev-only** — do not add a changeset for test edits, coverage tooling, or test refactors with no user-facing API change.

### Package-level overrides

Before applying this harness, check whether the target package defines `packages/<pkg>/AGENTS.md` or `packages/<pkg>/agents/`. If either exists and contradicts this file on the same topic, **follow the package-level instruction** (see [`agents/README.md`](README.md#instruction-precedence)).

---

## Before writing tests

1. Check for `packages/<pkg>/AGENTS.md` and `packages/<pkg>/agents/`; apply package-level overrides when present.
2. Read the source file(s) under test and list public behaviors, options, and error paths.
3. Skim existing specs in `packages/<pkg>/tests/` — match structure, naming, and assertion style.
4. Identify the **package archetype** (below); only create or extend the test files that archetype uses.
5. If the change adds or removes a **public export**, plan updates to `output.spec.ts`.

---

## Package archetypes

| Archetype | Examples | Typical test files |
|-----------|----------|-------------------|
| **Foundation** | `utils` | One `*.spec.ts` per `src/` module + `output.spec.ts` |
| **Single-purpose** | `cpf-fmt`, `cpf-val`, `cpf-gen`, `cpf-dv`, `cnpj-*` | Helper fn, main class, options class, exceptions, `output.spec.ts` |
| **Aggregator** | `cpf-utils`, `cnpj-utils`, `br-utils` | Aggregator class spec + `output.spec.ts` (delegation to sub-packages) |

---

## Test file roles

Use these roles consistently. Not every package has every file — follow siblings in the same archetype.

| File pattern | Tests |
|--------------|-------|
| `<module>.spec.ts` | Primary class or function from `src/<module>.ts` — constructor, methods, edge cases |
| `<pkg-short-name>.spec.ts` | Convenience helper (e.g. `cpfFmt`, `cnpjVal`) — usually delegates to the main class; often uses `spyOn` |
| `<resource>-options.spec.ts` | Options class — defaults, validation, setters, invalid inputs |
| `exceptions.spec.ts` | Error and exception classes — inheritance, properties, message text |
| `output.spec.ts` | Built artifacts in `dist/` — UMD globals, CJS/ESM exports, declaration files |

**`output.spec.ts` specifics:**

- Runs `bun run build --silent` in `beforeAll` (20s timeout).
- Asserts UMD bundle globals, named/default ESM exports, CJS `module.exports` shape, and `.d.ts` / `.d.cts` declarations.
- Update this file whenever the **public API surface** changes (new export, rename, or removed symbol).

---

## Structure and style (Better Specs)

Follow [Better Specs](https://www.betterspecs.org/) conventions used across the repo:

```ts
import { beforeEach, describe, expect, it } from 'bun:test';

import { MyClass } from '../src/my-class';

describe('MyClass', () => {
  describe('constructor', () => {
    describe('when called with no arguments', () => {
      it('creates an instance with default options', () => {
        const instance = new MyClass();

        expect(instance.options).toEqual(/* ... */);
      });
    });
  });

  describe('`myMethod` method', () => {
    // ...
  });
});
```

### Rules

- **`describe`** — component or context (class name, method name in backticks, or `when <condition>`).
- **`it`** — one behavior per example; use clear present-tense phrasing (`returns …`, `throws …`, `sets the … property`).
- **Nesting** — group by method, input type, or option; avoid flat lists of unrelated examples.
- **Arrange–act–assert** — set up, call the unit under test, assert; keep each `it` focused.
- **Parameterized cases** — use `it.each` / `describe.each` for tables of inputs (invalid types, lengths, option values).
- **Setup** — `beforeEach` / `afterEach` for per-example state; `beforeAll` only for expensive shared setup (e.g. build in `output.spec.ts`).
- **Spies** — `spyOn` from `bun:test` to verify delegation (helper → class method); always `mockRestore()` in `afterEach`.

### Error and exception testing

Two patterns appear in the codebase — use the one that matches the API:

1. **Thrown errors** — wrap in `try/catch`, assert `toBeInstanceOf`, properties, and message; end with `expect.unreachable()` if no throw occurred.

```ts
try {
  fn(badInput as unknown as string);
  expect.unreachable();
} catch (error) {
  expect(error).toBeInstanceOf(MyInputTypeError);
  expect((error as MyInputTypeError).expectedType).toBe('string');
}
```

2. **`onFail` callback** — pass a spy/callback in options and assert the exception inside the callback (common for length/validation failures that do not throw by default).

### Assertions

- Prefer `expect(result).toBe(…)` for primitives and `toEqual` / `expect.objectContaining` for objects.
- Use `expect.anything()`, `expect.any(Number)`, `toBeInstanceOf`, `toBeFunction`, `toBeTypeOf` as in existing specs.
- For async file checks: `await expect(file.exists()).resolves.toBe(true)`.

---

## Running tests

From the **js/** repository root:

| Goal | Command |
|------|---------|
| All packages (CI) | `bun run test:ci` |
| All packages with coverage | `bun run test` |
| Single package | `bun run test:<pkg>` (e.g. `test:cpf-fmt`, `test:utils`, `test:br-utils`) |
| Domain group | `bun run test:cpf`, `bun run test:cnpj`, `bun run test:dv`, etc. |

From a package directory (`packages/<pkg>/`):

| Goal | Command |
|------|---------|
| CI-equivalent | `bun run test:ci` |
| With LCOV coverage | `bun run test` |

CI runs `bun run build` then `bun run test:ci`. Run the same sequence locally when validating distribution tests or export changes.

---

## Checklist for agents

When implementing or reviewing test changes:

- [ ] New behavior has at least one focused `it` in the appropriate `*.spec.ts` (not only in unrelated files).
- [ ] Error paths and invalid inputs are covered (types, lengths, option validation).
- [ ] Helper-function specs use `spyOn` when testing delegation to a class.
- [ ] Public API changes are reflected in `output.spec.ts` (exports, globals, declarations).
- [ ] Style matches sibling specs: nested `describe`, Better Specs naming, `bun:test` imports.
- [ ] `bun run test:<pkg>` (or `test:ci` from root) passes after `bun run build` when `output.spec.ts` is involved.
- [ ] No new test dependencies or frameworks without developer approval.
