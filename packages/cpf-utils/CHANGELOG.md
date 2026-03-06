# cpf-utils

## 3.0.0

### Major Changes

- beb126e: ### 🎉 v3 at a glance 🎊
  - 🏗️ **Class-based customization** — `CpfUtils` class with optional default formatter, generator, and validator (options or instances); default export remains a pre-built instance for one-off use.
  - ✨ **Flat format options** — Format options no longer use nested objects: `delimiters.dot` → `dotKey`, `delimiters.dash` → `dashKey`, `hiddenRange.start`/`end` → `hiddenStart`/`hiddenEnd`. New `encode` option for URL-encoding.
  - 📦 **Full re-exports** — All formatter, generator, and validator classes, options, errors, and types from `@lacussoft/cpf-fmt`, `@lacussoft/cpf-gen`, and `@lacussoft/cpf-val` are re-exported; you can use `CpfFormatter`, `CpfGenerator`, `CpfValidator` and the helpers `cpfFmt`, `cpfGen`, `cpfVal` directly from `cpf-utils`.
  - 🛡️ **Structured errors** — Format, generate, and isValid can throw the same typed exceptions as the underlying packages (input type, options type, invalid prefix, etc.).

  ### BREAKING CHANGES
  - **Named exports `format`, `generate`, `isValid` removed**: The package no longer exports standalone `format`, `generate`, and `isValid` functions. Use the default instance (`cpfUtils.format()`, `cpfUtils.generate()`, `cpfUtils.isValid()`) or import the helpers `cpfFmt`, `cpfGen`, `cpfVal` for one-off calls. Code that did `import { format, generate, isValid } from 'cpf-utils'` must switch to `import cpfUtils from 'cpf-utils'` and call `cpfUtils.format()` etc., or use `import { cpfFmt, cpfGen, cpfVal } from 'cpf-utils'`.
  - **Format options are now flat** (aligned with `@lacussoft/cpf-fmt` v3). Nested option shapes are no longer supported:
    - `delimiters.dot` is now **`dotKey`**
    - `delimiters.dash` is now **`dashKey`**
    - `hiddenRange.start` is now **`hiddenStart`**
    - `hiddenRange.end` is now **`hiddenEnd`**
    - `onFail` callback signature may differ (e.g. receives `(value, exception)`); return value is still used as the result when input length ≠ 11.
  - **isValid() throws on invalid input type**: Passing a non-string, non–array-of-strings (e.g. a number) to `cpfUtils.isValid()` now throws `CpfValidatorInputTypeError` instead of returning `false` or unspecified behavior. Valid CPF data (wrong length, ineligible base, bad check digits) still returns `false` without throwing.
  - **Generator prefix validation**: Invalid prefixes (e.g. base all zeros, 9 repeated digits) now throw `CpfGeneratorOptionPrefixInvalidException`. Option type errors (e.g. non-string `prefix`) throw `CpfGeneratorOptionsTypeError`.
  - **New exports and default shape**: The package now exports the `CpfUtils` class and re-exports `cpfFmt`, `cpfGen`, `cpfVal` and all their classes, options, errors, and types. Code that assumed only a minimal default (only `format`, `generate`, `isValid` methods) or a specific tree-shaking surface may need updates.

  ### New features
  - **`CpfUtils` class**: Construct with optional `CpfUtilsSettingsInput` (`formatter`, `generator`, `validator` as options objects or instances of `CpfFormatter` / `CpfGenerator` / `CpfValidator`). Instance has `format()`, `generate()`, `isValid()` and getters/setters for `formatter`, `generator`, `validator`.
  - **Direct use of underlying APIs**: Import and use `cpfFmt`, `CpfFormatter`, `cpfGen`, `CpfGenerator`, `cpfVal`, `CpfValidator`, options classes, and exception classes from `cpf-utils` without depending on the three packages directly.
  - **Format `encode` option**: When `true`, the formatted CPF is URL-encoded (e.g. for query params or paths).

  ### Improvements
  - **New PT-BR documentation**: New [README in Brazilian Portuguese](./README.pt.md).
  - **Documentation**: README updated to match current API (flat options, CpfUtils class, re-exports, default instance) and aligned structure with `cnpj-utils`, `cpf-fmt`, `cpf-gen`, and `cpf-val`.
  - **Wrapper consistency**: `cpf-utils` behavior and options now fully reflect the v3 APIs of `@lacussoft/cpf-fmt`, `@lacussoft/cpf-gen`, and `@lacussoft/cpf-val`.

### Patch Changes

- Updated dependencies [fbe56e2]
- Updated dependencies [a152328]
- Updated dependencies [2023f36]
- Updated dependencies [e812b8d]
- Updated dependencies [ffb9078]
  - @lacussoft/cpf-dv@1.0.0
  - @lacussoft/utils@1.0.0
  - @lacussoft/cpf-fmt@3.0.0
  - @lacussoft/cpf-gen@3.0.0
  - @lacussoft/cpf-val@3.0.0

## 2.0.2

### Patch Changes

- ddd33b9: Update overall dependencies.
- Updated dependencies [ddd33b9]
  - @lacussoft/cpf-fmt@2.0.2
  - @lacussoft/cpf-gen@2.0.2
  - @lacussoft/cpf-val@2.0.2

## 2.0.1

### Patch Changes

- 2889911: Update documentation.
- 5d9bf1d: Create a contribution guide.
- Updated dependencies [2889911]
- Updated dependencies [5d9bf1d]
  - @lacussoft/cpf-fmt@2.0.1
  - @lacussoft/cpf-gen@2.0.1
  - @lacussoft/cpf-val@2.0.1

## 2.0.0

### Major Changes

- 5cfb84d: Increase version to align with `br-utils`.

### Patch Changes

- Updated dependencies [5cfb84d]
  - @lacussoft/cpf-fmt@2.0.0
  - @lacussoft/cpf-gen@2.0.0
  - @lacussoft/cpf-val@2.0.0

## 1.4.5

### Patch Changes

- e3f479a: Update package description.
- 12cc5b1: Fix types declaration export.
- Updated dependencies [e3f479a]
- Updated dependencies [12cc5b1]
  - @lacussoft/cpf-fmt@1.4.4
  - @lacussoft/cpf-gen@1.5.4
  - @lacussoft/cpf-val@1.4.4

## 1.4.4

### Patch Changes

- 5eb38e3: Adjust repo references from `juliolmuller` to `LacusSolutions`
- Updated dependencies [5eb38e3]
  - @lacussoft/cpf-fmt@1.4.3
  - @lacussoft/cpf-gen@1.5.3
  - @lacussoft/cpf-val@1.4.3

## 1.4.3

### Patch Changes

- 7e21d87: Updated overall development dependencies
- Updated dependencies [7e21d87]
  - @lacussoft/cpf-fmt@1.4.2
  - @lacussoft/cpf-gen@1.5.2
  - @lacussoft/cpf-val@1.4.2

## 1.4.2

### Patch Changes

- 308c5a3: Fixed validation method in documentation.

## 1.4.1

### Patch Changes

- 23ca50d: Fixed documentation examples.
- Updated dependencies [23ca50d]
  - @lacussoft/cpf-fmt@1.4.1
  - @lacussoft/cpf-gen@1.5.1
  - @lacussoft/cpf-val@1.4.1

## 1.4.0

### Minor Changes

- 7a9b0af: Configured packages entrypoints with `"exports"` option in `package.json`.

### Patch Changes

- Updated dependencies [7a9b0af]
  - @lacussoft/cpf-fmt@1.4.0
  - @lacussoft/cpf-gen@1.5.0
  - @lacussoft/cpf-val@1.4.0

## 1.3.1

### Minor Changes

- 57aeab441315f39e6763f963d4144a2ad8558be6: Changed output files for built code targeting Node-based projects. Main file is now `index.cjs` instead of `index.cjs.js`. It should not break any code importing the lib by its name only.

### Patch Changes

- 7f642bf2cd46369cc475e108f0bc2c7b837a33b6: Defined explicit return type for functions.
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
  - @lacussoft/cpf-gen@1.4.1
  - @lacussoft/cpf-val@1.3.1
  - eslint@9.24.0
  - eslint-config-any@1.0.6
  - lint-staged@15.5.1
  - num-only@1.2.5
  - typescript@5.8.3
