# @lacussoft/cnpj-gen

## 3.0.0

### Major Changes

- 1f9a608: ### 🎉 v3 at a glance 🎊

  - 🆕 **Alphanumeric CNPJ** — Full support for the new [14-character alphanumeric CNPJ](https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2023/julho/cnpj-alfa-numerico); default output is alphanumeric (`0-9A-Z`), with optional `numeric` or `alphabetic` via the `type` option.
  - 🏗️ **Class-based API** — `CnpjGenerator` lets you set default options once and reuse them; `generate()` accepts optional per-call options. The `cnpjGen()` helper remains for one-off usage.
  - ✨ **`type` option** — Control character set: `numeric`, `alphabetic`, or `alphanumeric` (default). Prefix is sanitized (alphanumeric only, uppercased); only the randomly generated part follows `type`.
  - 🛡️ **Structured errors** — Typed exceptions (`CnpjGeneratorOptionsTypeError`, `CnpjGeneratorOptionPrefixInvalidException`, `CnpjGeneratorOptionTypeInvalidException`) for options and prefix validation.
  - 📐 **Stricter prefix validation** — Prefix rejects invalid base ID (first 8 chars all zeros), invalid branch ID (positions 9–12 all zeros), and 12 repeated digits.

  ### BREAKING CHANGES

  - **Object-oriented API**: The package still exports the `cnpjGen()` helper, but the main programmable API is the `CnpjGenerator` class. You can create an instance with default options and call `generate()` without passing options every time. When a `CnpjGeneratorOptions` instance is passed to the constructor, it is used by reference; mutating it affects future `generate()` calls.
  - **Default output is alphanumeric**: Without options, generated CNPJs are now 14-character alphanumeric (e.g. `AB123CDE000155`) instead of numeric-only. Use `type: 'numeric'` to keep numeric-only behavior.
  - **New `type` option**: Options now include `type` (`'numeric'` | `'alphabetic'` | `'alphanumeric'`, default `'alphanumeric'`). Invalid values throw `CnpjGeneratorOptionTypeInvalidException`.
  - **Prefix validation**: Invalid prefixes now throw `CnpjGeneratorOptionPrefixInvalidException` (e.g. base ID or branch ID all zeros, or 12 repeated digits). Option type errors throw `CnpjGeneratorOptionsTypeError`.
  - **Nullish options**: Setting an option to `null` or `undefined` when using `CnpjGeneratorOptions` falls back to the existing value (constructor or default) instead of causing runtime issues.

  ### New features

  - **Alphanumeric CNPJ**: Generated CNPJs can be numeric, alphabetic, or alphanumeric; prefix is always sanitized to alphanumeric and uppercased.
  - **`CnpjGeneratorOptions` class**: Reusable options with getters/setters and `set()` for bulk updates; supports constructor merge and overrides. Static defaults: `DEFAULT_FORMAT`, `DEFAULT_PREFIX`, `DEFAULT_TYPE`. Read-only `all` getter returns a frozen snapshot.
  - **Exception hierarchy**: `CnpjGeneratorTypeError` (base for option type errors), `CnpjGeneratorOptionsTypeError`, `CnpjGeneratorException` (base for rule errors), `CnpjGeneratorOptionPrefixInvalidException`, `CnpjGeneratorOptionTypeInvalidException`.

  ### Improvements

  - **New PT-BR documentation**: New [README in Brazilian Portuguese](./README.pt.md).
  - **Check digits**: Generation uses `@lacussoft/cnpj-dv` for correct check-digit calculation. Invalid sequences (e.g. after prefix) trigger retry until a valid CNPJ is produced.
  - **Exports**: ESM entry exports `cnpjGen`, `CnpjGenerator`, `CnpjGeneratorOptions`, constants (`CNPJ_LENGTH`, `CNPJ_PREFIX_MAX_LENGTH`), exception classes, and types; CJS/UMD default export is `cnpjGen` with the same members on its namespace.

### Patch Changes

- Updated dependencies [f795b64]
- Updated dependencies [a152328]
  - @lacussoft/cnpj-dv@1.0.0
  - @lacussoft/utils@1.0.0

## 2.0.2

### Patch Changes

- ddd33b9: Update overall dependencies.
- Updated dependencies [ddd33b9]
  - @lacussoft/cnpj-fmt@2.0.2

## 2.0.1

### Patch Changes

- 2889911: Update documentation.
- 5d9bf1d: Create a contribution guide.
- Updated dependencies [2889911]
- Updated dependencies [5d9bf1d]
  - @lacussoft/cnpj-fmt@2.0.1

## 2.0.0

### Major Changes

- 5cfb84d: Increase version to align with `br-utils`.

### Patch Changes

- Updated dependencies [5cfb84d]
  - @lacussoft/cnpj-fmt@2.0.0

## 1.3.3

### Patch Changes

- e3f479a: Update package description.
- 12cc5b1: Fix types declaration export.
- Updated dependencies [e3f479a]
- Updated dependencies [12cc5b1]
  - @lacussoft/cnpj-fmt@1.3.3

## 1.3.2

### Patch Changes

- 5eb38e3: Adjust repo references from `juliolmuller` to `LacusSolutions`
- Updated dependencies [5eb38e3]
  - @lacussoft/cnpj-fmt@1.3.2

## 1.3.1

### Patch Changes

- 7e21d87: Updated overall development dependencies
- Updated dependencies [7e21d87]
  - @lacussoft/cnpj-fmt@1.3.1

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
  - @lacussoft/cnpj-fmt@1.3.0
