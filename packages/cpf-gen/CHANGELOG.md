# @lacussoft/cpf-gen

## 3.0.0

### 🎉 v3 at a glance 🎊

- 🏗️ **Class-based API** — `CpfGenerator` lets you set default options once and reuse them; `generate()` accepts optional per-call options. The `cpfGen()` helper remains for one-off usage.
- ✨ **Reusable options** — `CpfGeneratorOptions` with getters/setters, `set()` for bulk updates, and constructor merge; read-only `all` getter for a frozen snapshot.
- 🛡️ **Structured errors** — Typed exceptions (`CpfGeneratorOptionsTypeError`, `CpfGeneratorOptionPrefixInvalidException`) for invalid option types and prefix validation.
- 📐 **Stricter prefix validation** — Prefix rejects zeroed base (first 9 digits all zeros) and 9 repeated digits (e.g. `999999999`).

### BREAKING CHANGES

- **Object-oriented API**: The package still exports the `cpfGen()` helper, but the main programmable API is the `CpfGenerator` class. You can create an instance with default options and call `generate()` without passing options every time. When a `CpfGeneratorOptions` instance is passed to the constructor, it is used by reference; mutating it affects future `generate()` calls.
- **Prefix validation**: Invalid prefixes now throw `CpfGeneratorOptionPrefixInvalidException` (e.g. base all zeros, or 9 repeated digits). Option type errors (e.g. non-string `prefix`) throw `CpfGeneratorOptionsTypeError`. Code that relied on the previous behavior or on generic errors may need to catch these exceptions.
- **Nullish options**: Setting an option to `null` or `undefined` when using `CpfGeneratorOptions` falls back to the existing value (constructor or default) instead of causing runtime issues.

### New features

- **`CpfGenerator` class**: Constructor accepts optional default options (plain object or `CpfGeneratorOptions`). `generate(options?)` returns a valid CPF; per-call options override instance defaults for that call only. `options` getter returns the default options instance (mutations affect future `generate()` calls).
- **`CpfGeneratorOptions` class**: Reusable options with getters/setters for `format` and `prefix`, and `set()` for bulk updates; supports constructor merge and overrides. Static defaults: `DEFAULT_FORMAT`, `DEFAULT_PREFIX`. Read-only `all` getter returns a frozen snapshot.
- **Exception hierarchy**: `CpfGeneratorTypeError` (base for option type errors), `CpfGeneratorOptionsTypeError`, `CpfGeneratorException` (base for rule errors), `CpfGeneratorOptionPrefixInvalidException`.
- **New exports**: Constants `CPF_LENGTH` (11) and `CPF_PREFIX_MAX_LENGTH` (9); types `CpfGeneratorOptionsInput`, `CpfGeneratorOptionsType`, `Nullable<T>`.

### Improvements

- **New PT-BR documentation**: New [README in Brazilian Portuguese](./README.pt.md).
- **Check digits**: Generation uses `@lacussoft/cpf-dv` for check-digit calculation. Invalid sequences (e.g. after prefix) trigger retry until a valid CPF is produced.
- **Exports**: ESM entry exports `cpfGen`, `CpfGenerator`, `CpfGeneratorOptions`, constants (`CPF_LENGTH`, `CPF_PREFIX_MAX_LENGTH`), exception classes, and types; CJS/UMD default export is `cpfGen` with the same members on its namespace.

## 2.0.2

### Patch Changes

- ddd33b9: Update overall dependencies.
- Updated dependencies [ddd33b9]
  - @lacussoft/cpf-fmt@2.0.2

## 2.0.1

### Patch Changes

- 2889911: Update documentation.
- 5d9bf1d: Create a contribution guide.
- Updated dependencies [2889911]
- Updated dependencies [5d9bf1d]
  - @lacussoft/cpf-fmt@2.0.1

## 2.0.0

### Major Changes

- 5cfb84d: Increase version to align with `br-utils`.

### Patch Changes

- Updated dependencies [5cfb84d]
  - @lacussoft/cpf-fmt@2.0.0

## 1.5.4

### Patch Changes

- e3f479a: Update package description.
- 12cc5b1: Fix types declaration export.
- Updated dependencies [e3f479a]
- Updated dependencies [12cc5b1]
  - @lacussoft/cpf-fmt@1.4.4

## 1.5.3

### Patch Changes

- 5eb38e3: Adjust repo references from `juliolmuller` to `LacusSolutions`
- Updated dependencies [5eb38e3]
  - @lacussoft/cpf-fmt@1.4.3

## 1.5.2

### Patch Changes

- 7e21d87: Updated overall development dependencies
- Updated dependencies [7e21d87]
  - @lacussoft/cpf-fmt@1.4.2

## 1.5.1

### Patch Changes

- 23ca50d: Fixed documentation examples.
- Updated dependencies [23ca50d]
  - @lacussoft/cpf-fmt@1.4.1

## 1.5.0

### Minor Changes

- 7a9b0af: Configured packages entrypoints with `"exports"` option in `package.json`.

### Patch Changes

- Updated dependencies [7a9b0af]
  - @lacussoft/cpf-fmt@1.4.0

## 1.4.1

### Minor Changes

- 57aeab441315f39e6763f963d4144a2ad8558be6: Changed output files for built code targeting Node-based projects. Main file is now `index.cjs` instead of `index.cjs.js`. It should not break any code importing the lib by its name only.

### Patch Changes

- ebe737908a4b31c2733888c9b337dfbaed14589e: Defined explicit return type for functions.
- 4266e00609df3c003dfc4c306976856db9eac219: Added `build` script to monorepo manager.
- f2ee094a37660e27264ddb81b7c44f3407ae2bb2: Omitted build logs when running tests.
- 6cc51d7f4750fa45f3c89f818ba7550683c2d52a: Fixed docs broken badges.
- 1a5b10306bb112965541d5a937631dc8eea0ce0a: Dropped Travis CI configuration file (`.travis.yml`).
- 4ed63f32f79d42ea25cb8881c8b0f9d4694f5438: Update monorepo scripts to use Bun's `--filter` flag to run batch routines.
- 8247d389e2e6003712fc52cbc4c4a8f78c4244db: Disabled TypeScript lib check for all packages.
- 167424f136c6935fe9f9f1cf9e628ec83333d244: Added tests for built files.
- 4b94608f9586acff343838df1d251452a2f84a9f: Added `type-check` script to all projects and to monorepo.
- 040852c22206b47b72444a66304bbeea4e47df3c..0914b7c70f3852ddcfe88d81c359c1b73e3e41c9: Created GitHub Actions workflow to run linting, type checking and tests in any pushed branch and PR's.
- bf00d1a0858ede64449f8d7202f9ef2969bb690e: Configured [Changesets](https://github.com/changesets/changesets) in the project.
- 8c763276b616df00a6732adc896d5497b52cef15: Set `"publishConfig"` in `package.json` for all packages.
- 583327c71f84bdd8d496bfb1f287fbf7802d729b..84cec9dee81d0af2f52b3153fa410306e2fd13c6: Created GitHub Actions workflow to create changelogs, increase versions and publish to NPM registry.
- 7ba1718: Create file to set codebase owner.
- Updated dependencies:
  - @lacussoft/cpf-fmt@1.3.1
  - eslint@9.24.0
  - eslint-config-any@1.0.6
  - lint-staged@15.5.1
  - num-only@1.2.5
  - typescript@5.8.3
