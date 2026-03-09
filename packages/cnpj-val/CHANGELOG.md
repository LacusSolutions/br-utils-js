# @lacussoft/cnpj-val

## 3.0.0

### 🎉 v3 at a glance 🎊

- 🆕 **Alphanumeric CNPJ** — Full support for the new [14-character alphanumeric CNPJ](https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2023/julho/cnpj-alfa-numerico); validates both numeric and alphanumeric formats, with optional `type` (`'numeric'` | `'alphanumeric'`, default `'alphanumeric'`).
- 🏗️ **Class-based API** — `CnpjValidator` lets you set default options once and reuse them; `isValid(cnpjInput, options?)` accepts optional per-call overrides. The `cnpjVal()` helper remains for one-off usage.
- ✨ **`type` and `caseSensitive` options** — Control validation mode: `type` restricts to digits only or allows letters; `caseSensitive` (default `true`) determines whether lowercase letters are accepted for alphanumeric CNPJ.
- 🛡️ **Structured errors** — Typed exceptions (`CnpjValidatorInputTypeError`, `CnpjValidatorOptionsTypeError`, `CnpjValidatorOptionTypeInvalidException`) for invalid input type or options; invalid CNPJ data still returns `false` without throwing.
- 📥 **Flexible input** — Accepts `string` or `string[]` (formatted or raw); non-alphanumeric characters are stripped according to `type`.

### BREAKING CHANGES

- **Invalid input type now throws**: `cnpjVal(cnpjInput)` and `CnpjValidator#isValid(cnpjInput)` now throw `CnpjValidatorInputTypeError` when `cnpjInput` is not a string or array of strings (e.g. passing a number). In v2, such calls likely returned `false` or had unspecified behavior; they now fail fast with a typed error.
- **New optional second parameter**: `cnpjVal(cnpjInput, options?)` accepts an optional second argument. Existing one-argument calls remain valid; code that relied on a second argument being ignored or on `cnpjVal` having a single parameter in its type signature may need to be updated.
- **Class-based API and new exports**: The package now exports `CnpjValidator`, `CnpjValidatorOptions`, exception classes, and types alongside the default `cnpjVal`. If you depended on the package exposing only a single default function or on a specific export surface, update your imports or bundler config.
- **Default validation is alphanumeric and case-sensitive**: Without options, validation accepts 14-character alphanumeric CNPJ and is case-sensitive (lowercase letters in an otherwise valid alphanumeric CNPJ yield `false`). Use `type: 'numeric'` for numeric-only validation and `caseSensitive: false` to accept lowercase letters. Numeric-only CNPJ strings behave the same as in v2 when passed as a string.
- **Stricter validation rules**:
  - Base ID composed only by zeros (first 8 characters "00000000") is considered invalid and will cause validation to return `false`.
  - CNPJs whose first 12 characters are composed by numbers and the same number ("111111111111", "222222222222", "333333333333", etc.) are invalid. Note that this rule only applies to numbers, not letters. Alphanumeric CNPJs with repeated letters are acceptable according to the official government agencies.

### New features

- **Alphanumeric CNPJ validation**: Validates the new alphanumeric format; `type: 'numeric'` restricts to digits-only (legacy behavior).
- **`CnpjValidator` class**: Reusable validator with default options; `isValid(cnpjInput, options?)` supports per-call option overrides. Constructor accepts a plain options object or a `CnpjValidatorOptions` instance (used by reference when passed).
- **`CnpjValidatorOptions` class**: Options with getters/setters (`caseSensitive`, `type`), `set()` for bulk updates, and constructor merge (`defaultOptions?, ...overrides`). Read-only `all` getter returns a frozen snapshot. Static defaults: `DEFAULT_CASE_SENSITIVE`, `DEFAULT_TYPE`.
- **Exception hierarchy**: `CnpjValidatorTypeError` (base for type errors), `CnpjValidatorInputTypeError`, `CnpjValidatorOptionsTypeError`, `CnpjValidatorException` (base for option value exceptions), `CnpjValidatorOptionTypeInvalidException`. Invalid option values (e.g. `type: 'invalid'`) throw; invalid CNPJ data (wrong length, bad check digits, ineligible base/branch) still returns `false`.
- **Array input**: `CnpjInput` is `string | string[]`; array of strings is joined and validated like a single string.

### Improvements

- **New PT-BR documentation**: New [README in Brazilian Portuguese](./README.pt.md).
- **Check digits**: Validation uses `@lacussoft/cnpj-dv` for check-digit verification; ineligible base/branch or repeated digits result in `false` (no throw).
- **Exports**: ESM entry exports `cnpjVal`, `CnpjValidator`, `CnpjValidatorOptions`, `CNPJ_LENGTH`, exception classes, and types; CJS/UMD default export is `cnpjVal` with the same members on its namespace.

## 2.0.2

### Patch Changes

- ddd33b9: Update overall dependencies.
- Updated dependencies [ddd33b9]
  - @lacussoft/cnpj-gen@2.0.2

## 2.0.1

### Patch Changes

- 2889911: Update documentation.
- 5d9bf1d: Create a contribution guide.
- Updated dependencies [2889911]
- Updated dependencies [5d9bf1d]
  - @lacussoft/cnpj-gen@2.0.1

## 2.0.0

### Major Changes

- 5cfb84d: Increase version to align with `br-utils`.

### Patch Changes

- Updated dependencies [5cfb84d]
  - @lacussoft/cnpj-gen@2.0.0

## 1.3.3

### Patch Changes

- e3f479a: Update package description.
- 12cc5b1: Fix types declaration export.
- Updated dependencies [e3f479a]
- Updated dependencies [12cc5b1]
  - @lacussoft/cnpj-gen@1.3.3

## 1.3.2

### Patch Changes

- 5eb38e3: Adjust repo references from `juliolmuller` to `LacusSolutions`
- Updated dependencies [5eb38e3]
  - @lacussoft/cnpj-gen@1.3.2

## 1.3.1

### Patch Changes

- Updated dependencies [7e21d87]
  - @lacussoft/cnpj-gen@1.3.1

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
- Updated dependencies [6f8b868]
  - @lacussoft/cnpj-gen@1.3.0
