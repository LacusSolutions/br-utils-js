# @lacussoft/cpf-fmt

## 3.0.0

### Major Changes

- 2023f36: ### 🎉 v3 at a glance 🎊

  - 🏗️ **Class-based API** — `CpfFormatter` lets you set default options once and reuse them; `format()` accepts string or array of strings.
  - ✨ **Flat options** — Delimiters and masking use top-level options (`dotKey`, `dashKey`, `hiddenKey`, `hiddenStart`, `hiddenEnd`) plus `escape`, `encode`, and `onFail`.
  - 🛡️ **Structured errors** — Typed exceptions (`CpfFormatterInputTypeError`, `CpfFormatterInputLengthException`, options errors) for clearer error handling.

  ### BREAKING CHANGES

  - **Object-oriented API**: The package still exports the `cpfFmt()` helper, but the main programmable API is the `CpfFormatter` class. You can create an instance with default options and call `format()` without passing options every time.
  - **Options are now flat** (no nested objects):
    - `delimiters.dot` is now **`dotKey`**
    - `delimiters.dash` is now **`dashKey`**
    - `hiddenRange.start` is now **`hiddenStart`**
    - `hiddenRange.end` is now **`hiddenEnd`**
    - `hiddenKey` and `escape` keep the same names.
    - **New:** `encode` (URL-encode output).
    - **onFail callback:** The signature has changed; it now receives `(value, error?)` and the return value is used as the formatted result.
  - **Nullish options**: Setting an option to `null` or `undefined` now falls back to the existing value (constructor or default) instead of causing runtime issues.

  ### New features

  - **`encode` option**: When `true`, the formatted CPF is URL-encoded (e.g. for query parameters or paths).
  - **Exception hierarchy**: Dedicated error classes for type errors (`CpfFormatterTypeError`, `CpfFormatterInputTypeError`, `CpfFormatterOptionsTypeError`) and validation/range errors (`CpfFormatterException`, `CpfFormatterInputLengthException`, `CpfFormatterOptionsHiddenRangeInvalidException`, `CpfFormatterOptionsForbiddenKeyCharacterException`). Failures can still be handled via the `onFail` callback without throwing.

  ### Improvements

  - **New PT-BR documentation**: New [README in Brazilian Portuguese](./README.pt.md).
  - **Minimal dependencies**: Removed `html-escaper`, `deepmerge`, and `num-only`; in-house HTML escaping and option handling. It only depends on internal package `@lacussoft/utils` now.

### Patch Changes

- Updated dependencies [a152328]
  - @lacussoft/utils@1.0.0

## 2.0.2

### Patch Changes

- ddd33b9: Update overall dependencies.

## 2.0.1

### Patch Changes

- 2889911: Update documentation.
- 5d9bf1d: Create a contribution guide.

## 2.0.0

### Major Changes

- 5cfb84d: Increase version to align with `br-utils`.

## 1.4.4

### Patch Changes

- e3f479a: Update package description.
- 12cc5b1: Fix types declaration export.

## 1.4.3

### Patch Changes

- 5eb38e3: Adjust repo references from `juliolmuller` to `LacusSolutions`

## 1.4.2

### Patch Changes

- 7e21d87: Updated overall development dependencies

## 1.4.1

### Patch Changes

- 23ca50d: Fixed documentation examples.

## 1.4.0

### Minor Changes

- 7a9b0af: Configured packages entrypoints with `"exports"` option in `package.json`.

## 1.3.1

### Minor Changes

- e8c30bcec40401718fc3472999cab97872bd8ac9: Improved codebase types.
- 57aeab441315f39e6763f963d4144a2ad8558be6: Changed output files for built code targeting Node-based projects. Main file is now `index.cjs` instead of `index.cjs.js`. It should not break any code importing the lib by its name only.

### Patch Changes

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
- 7ba1718: Created file to set codebase owner.
- Updated dependencies:
  - eslint@9.24.0
  - eslint-config-any@1.0.6
  - lint-staged@15.5.1
  - num-only@1.2.5
  - typescript@5.8.3
