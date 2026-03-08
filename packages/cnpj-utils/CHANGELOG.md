# cnpj-utils

## 3.0.0

### 🎉 v3 at a glance 🎊

- 🆕 **Alphanumeric CNPJ** — Full support for the new [14-character alphanumeric CNPJ](https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2023/julho/cnpj-alfa-numerico); format, generate, and validate numeric or alphanumeric IDs via the unified instance or the underlying `cnpjFmt` / `cnpjGen` / `cnpjVal` helpers.
- 🏗️ **Class-based customization** — `CnpjUtils` class with optional default formatter, generator, and validator (options or instances); default export remains a pre-built instance for one-off use.
- ✨ **Flat format options** — Format options no longer use nested objects: `delimiters.dot` → `dotKey`, `delimiters.slash` → `slashKey`, `delimiters.dash` → `dashKey`, `hiddenRange.start`/`end` → `hiddenStart`/`hiddenEnd`. New `encode` option for URL-encoding.
- 📦 **Full re-exports** — All formatter, generator, and validator classes, options, errors, and types from `@lacussoft/cnpj-fmt`, `@lacussoft/cnpj-gen`, and `@lacussoft/cnpj-val` are re-exported; you can use `CnpjFormatter`, `CnpjGenerator`, `CnpjValidator` and their helpers directly from `cnpj-utils`.
- 🛡️ **Structured errors** — Format, generate, and isValid can throw the same typed exceptions as the underlying packages (input type, options type, invalid prefix/type, etc.).

### BREAKING CHANGES

- **Format options are now flat** (aligned with `@lacussoft/cnpj-fmt` v3). Nested option shapes are no longer supported:
  - `delimiters.dot` is now **`dotKey`**
  - `delimiters.slash` is now **`slashKey`**
  - `delimiters.dash` is now **`dashKey`**
  - `hiddenRange.start` is now **`hiddenStart`**
  - `hiddenRange.end` is now **`hiddenEnd`**
  - `onFail` callback signature may differ (e.g. receives `(value, exception)`); return value is still used as the result when input length ≠ 14.
- **Default generated CNPJ is alphanumeric**: `cnpjUtils.generate()` now returns a 14-character alphanumeric string (e.g. `AB123CDE000155`) instead of numeric-only. Use `generate({ type: 'numeric' })` for the previous numeric-only behavior.
- **Generator prefix rules**: Prefix is now 1–12 **alphanumeric** characters (sanitized/uppercased). Invalid prefix (e.g. base or branch all zeros, 12 repeated digits) throws `CnpjGeneratorOptionPrefixInvalidException`. New `type` option: `'numeric'` | `'alphabetic'` | `'alphanumeric'` (default).
- **isValid() throws on invalid input type**: Passing a non-string, non–array-of-strings (e.g. a number) to `cnpjUtils.isValid()` now throws `CnpjValidatorInputTypeError` instead of returning `false`. Validator now accepts an optional second argument `options?` (`caseSensitive`, `type`); default validation is alphanumeric and case-sensitive.
- **New exports and default shape**: The package now exports the `CnpjUtils` class and re-exports `cnpjFmt`, `cnpjGen`, `cnpjVal` and all their classes/options/errors. The default export is still a `CnpjUtils` instance, but that instance now carries those re-exports on its object (e.g. `cnpjUtils.CnpjFormatter`). Code that assumed a minimal default (only `format`, `generate`, `isValid`) or specific tree-shaking surface may need updates.

### New features

- **Alphanumeric CNPJ**: Format accepts 14-character alphanumeric input; generate can produce numeric, alphabetic, or alphanumeric; validate accepts both with optional `type` and `caseSensitive`.
- **`CnpjUtils` class**: Construct with optional `CnpjUtilsSettingsInput` (`formatter`, `generator`, `validator` as options objects or instances). Instance has `format()`, `generate()`, `isValid()` and getters/setters for `formatter`, `generator`, `validator`.
- **Direct use of underlying APIs**: Import and use `cnpjFmt`, `CnpjFormatter`, `cnpjGen`, `CnpjGenerator`, `cnpjVal`, `CnpjValidator`, options classes, and exception classes from `cnpj-utils` without depending on the three packages directly.
- **Format `encode` option**: When `true`, the formatted CNPJ is URL-encoded (e.g. for query params or paths).

### Improvements

- **New PT-BR documentation**: New [README in Brazilian Portuguese](./README.pt.md).
- **Documentation**: README updated to match current API (flat options, CnpjUtils class, re-exports, generator/validator options) and aligned structure with `cnpj-fmt`, `cnpj-gen`, and `cnpj-val`.
- **Wrapper consistency**: `cnpj-utils` behavior and options now fully reflect the v3 APIs of `@lacussoft/cnpj-fmt`, `@lacussoft/cnpj-gen`, and `@lacussoft/cnpj-val`.

## 2.0.2

### Patch Changes

- ddd33b9: Update overall dependencies.
- Updated dependencies [ddd33b9]
  - @lacussoft/cnpj-fmt@2.0.2
  - @lacussoft/cnpj-gen@2.0.2
  - @lacussoft/cnpj-val@2.0.2

## 2.0.1

### Patch Changes

- 2889911: Update documentation.
- 5d9bf1d: Create a contribution guide.
- Updated dependencies [2889911]
- Updated dependencies [5d9bf1d]
  - @lacussoft/cnpj-fmt@2.0.1
  - @lacussoft/cnpj-gen@2.0.1
  - @lacussoft/cnpj-val@2.0.1

## 2.0.0

### Major Changes

- 5cfb84d: Increase version to align with `br-utils`.

### Patch Changes

- Updated dependencies [5cfb84d]
  - @lacussoft/cnpj-fmt@2.0.0
  - @lacussoft/cnpj-gen@2.0.0
  - @lacussoft/cnpj-val@2.0.0

## 1.3.3

### Patch Changes

- e3f479a: Update package description.
- 12cc5b1: Fix types declaration export.
- Updated dependencies [e3f479a]
- Updated dependencies [12cc5b1]
  - @lacussoft/cnpj-fmt@1.3.3
  - @lacussoft/cnpj-gen@1.3.3
  - @lacussoft/cnpj-val@1.3.3

## 1.3.2

### Patch Changes

- 5eb38e3: Adjust repo references from `juliolmuller` to `LacusSolutions`
- Updated dependencies [5eb38e3]
  - @lacussoft/cnpj-fmt@1.3.2
  - @lacussoft/cnpj-gen@1.3.2
  - @lacussoft/cnpj-val@1.3.2

## 1.3.1

### Patch Changes

- 7e21d87: Updated overall development dependencies
- Updated dependencies [7e21d87]
  - @lacussoft/cnpj-fmt@1.3.1
  - @lacussoft/cnpj-gen@1.3.1
  - @lacussoft/cnpj-val@1.3.1

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
- bb2bc7b: Fixed validation method in documentation.
- 9e19833: Configured provenance for published packages.
- c8a5ab8: Omitted build logs when running tests.
- ecb41e6: Fixed docs broken badges.
- a726176: Created GitHub Actions workflow to create changelogs, increase versions and publish to NPM registry.
- 6f8b868: Created GitHub Actions workflow to run linting, type checking and tests in any pushed branch and PR's.
- Updated dependencies [6f8b868]
  - @lacussoft/cnpj-fmt@1.3.0
  - @lacussoft/cnpj-gen@1.3.0
  - @lacussoft/cnpj-val@1.3.0
