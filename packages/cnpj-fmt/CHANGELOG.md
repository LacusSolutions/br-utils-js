# @lacussoft/cnpj-fmt

## 3.0.0

### 🎉 v3 at a glance 🎊

- 🆕 **Alphanumeric CNPJ** — Full support for the new [14-character alphanumeric CNPJ](https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2023/julho/cnpj-alfa-numerico) (digits and letters); input is sanitized and uppercased before formatting.
- 🏗️ **Class-based API** — `CnpjFormatter` lets you set default options once and reuse them; `format()` accepts string or array of strings.
- ✨ **Flat options** — Delimiters and masking use top-level options (`dotKey`, `slashKey`, `dashKey`, `hiddenKey`, `hiddenStart`, `hiddenEnd`) plus `escape`, `encode`, and `onFail`.
- 🛡️ **Structured errors** — Typed exceptions (`CnpjFormatterInputTypeError`, `CnpjFormatterInputLengthException`, options errors) for clearer error handling.

### BREAKING CHANGES

- **Object-oriented API**: The package still exports the `cnpjFmt()` helper, but the main programmable API is the `CnpjFormatter` class. You can create an instance with default options and call `format()` without passing options every time.
- **Options are now flat** (no nested objects):
  - `delimiters.dot` is now **`dotKey`**
  - `delimiters.slash` is now **`slashKey`**
  - `delimiters.dash` is now **`dashKey`**
  - `hiddenRange.start` is now **`hiddenStart`**
  - `hiddenRange.end` is now **`hiddenEnd`**
  - `hiddenKey` and `escape` keep the same names.
  - **New:** `encode` (URL-encode output).
  - **onFail callback:** The signature has changed; it now receives `(value, error?)` and the return value is used as the formatted result.
- **Nullish options**: Setting an option to `null` or `undefined` now falls back to the existing value (constructor or default) instead of causing runtime issues.

### New features

- **Alphanumeric CNPJ**: Both numeric and alphanumeric 14-character CNPJs are supported; non-alphanumeric characters are stripped and the result is uppercased before formatting.
- **`encode` option**: When `true`, the formatted CNPJ is URL-encoded (e.g. for query parameters or paths).
- **Exception hierarchy**: Dedicated error classes for type errors (`CnpjFormatterTypeError`, `CnpjFormatterInputTypeError`, `CnpjFormatterOptionsTypeError`) and validation/range errors (`CnpjFormatterException`, `CnpjFormatterInputLengthException`, `CnpjFormatterOptionsHiddenRangeInvalidException`, `CnpjFormatterOptionsForbiddenKeyCharacterException`). Failures can still be handled via the `onFail` callback without throwing.

### Improvements

- **New PT-BR documentation**: New [README in Brazilian Portuguese](./README.pt.md).
- **Minimal dependencies**: Removed `html-escaper`, `deepmerge`, and `num-only`; in-house HTML escaping and option handling. It only depends on internal package `@lacussoft/utils` now.

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

## 1.3.3

### Patch Changes

- e3f479a: Update package description.
- 12cc5b1: Fix types declaration export.

## 1.3.2

### Patch Changes

- 5eb38e3: Adjust repo references from `juliolmuller` to `LacusSolutions`

## 1.3.1

### Patch Changes

- 7e21d87: Updated overall development dependencies

## 1.3.0

### Minor Changes

- f3a5942: Renamed main files for Node-based projects.
- 7cacc02: Defined explicit return type for functions.

### Patch Changes

- f3a5942: Added `build` script to monorepo manager.
- 7851229: Create file to set codebase owner.
- d547820: Disabled TypeScript lib check for all packages.
- 21c7ce9: Added `type-check` script to all projects and to monorepo.
- c1ef348: Added tests for built files.
- 11491f7: Dropped Travis CI configuration file (`.travis.yml`).
- 5737b71: Configured [Changesets](https://github.com/changesets/changesets) in the project.
- 9e19833: Configured provenance for published packages.
- c8a5ab8: Omitted build logs when running tests.
- ecb41e6: Fixed docs broken badges.
- a726176: Created GitHub Actions workflow to create changelogs, increase versions and publish to NPM registry.
- 6f8b868: Created GitHub Actions workflow to run linting, type checking and tests in any pushed branch and PR's.
