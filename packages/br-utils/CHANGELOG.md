# br-utils

## 3.0.0

### Major Changes

- ac9d792: ### 🎉 v3 at a glance 🎊
  - 🏗️ **Class-based API** — Default export is a `BrUtils` class instance with `cpf` and `cnpj` sub-modules; `BrUtils` class allows optional default settings for each (options or `CpfUtils` / `CnpjUtils` instances) and getters/setters for `cpf` and `cnpj`.
  - 📦 **Single entry point, full re-exports** — One package for CPF and CNPJ; all exports from `cpf-utils` and `cnpj-utils` are re-exported (e.g. `cpfUtils`, `cnpjUtils`, `cpfFmt`, `cpfGen`, `cpfVal`, `cnpjFmt`, `cnpjGen`, `cnpjVal`, and their classes, options, errors, types).
  - 🔗 **Wraps v3 sub-packages** — Behavior and options follow the v3 APIs of `cpf-utils` and `cnpj-utils` (flat format options, structured errors, class-based customization in each sub-module).

  ### BREAKING CHANGES
  - **Named exports `cpf` and `cnpj` removed**: The package no longer exports standalone `cpf` and `cnpj` names. Use the default instance (`brUtils.cpf`, `brUtils.cnpj`) or import the re-exported instances `cpfUtils` and `cnpjUtils`. Code that did `import { cpf as cpfUtils, cnpj as cnpjUtils } from 'br-utils'` must switch to `import brUtils from 'br-utils'` and use `brUtils.cpf` / `brUtils.cnpj`, or use `import { cpfUtils, cnpjUtils } from 'br-utils'`.
  - **Default export is a `BrUtils` instance**: The default export is now an instance of the `BrUtils` class, not a plain object. It still exposes `cpf` and `cnpj` for the same usage pattern (`brUtils.cpf.format()`, etc.), but code that relied on the default being a plain object (e.g. spreading, or checking for specific own properties) may need updates.
  - **CommonJS/UMD default carries re-exports**: In CommonJS and UMD, the default export object also includes all re-exported names from `cpf-utils` and `cnpj-utils` (e.g. `BrUtils`, `cpfUtils`, `cnpjUtils`, `cpfFmt`, `cnpjFmt`, classes, errors). Code that assumed the default had only `cpf` and `cnpj` or a minimal surface may need updates.

  ### New features
  - **`BrUtils` class**: Construct with optional `BrUtilsSettingsInput` (`cpf` and `cnpj` as options objects or `CpfUtils` / `CnpjUtils` instances). Instance has getters/setters for `cpf` and `cnpj`; setters accept an instance, an options object, or `null`/`undefined` to reset to defaults.
  - **Direct use of sub-package APIs**: Import and use `cpfUtils`, `cnpjUtils`, `cpfFmt`, `cpfGen`, `cpfVal`, `cnpjFmt`, `cnpjGen`, `cnpjVal`, and all their classes, options, errors, and types from `br-utils` without depending on `cpf-utils` or `cnpj-utils` directly.

  ### Improvements
  - **New PT-BR documentation**: New [README in Brazilian Portuguese](./README.pt.md).
  - **Documentation**: README and README.pt.md updated to match current API (BrUtils class, default instance, re-exports, constructor/setter options) and aligned structure with `cpf-utils` and `cnpj-utils`.

### Patch Changes

- Updated dependencies [a152328]
- Updated dependencies [9004cf7]
- Updated dependencies [beb126e]
  - @lacussoft/utils@1.0.0
  - cnpj-utils@3.0.0
  - cpf-utils@3.0.0

## 2.0.5

### Patch Changes

- ddd33b9: Update overall dependencies.
- Updated dependencies [ddd33b9]
  - cnpj-utils@2.0.2
  - cpf-utils@2.0.2

## 2.0.4

### Patch Changes

- 2889911: Update documentation.
- 5d9bf1d: Create a contribution guide.
- Updated dependencies [2889911]
- Updated dependencies [5d9bf1d]
  - cnpj-utils@2.0.1
  - cpf-utils@2.0.1

## 2.0.3

### Patch Changes

- ff7ef2a: Remove `default` property from `cpf` and `cnpj` submodules.
- 5cfb84d: Increase version to align with `br-utils`.
- Updated dependencies [5cfb84d]
  - cnpj-utils@2.0.0
  - cpf-utils@2.0.0

## 2.0.2

### Patch Changes

- e3f479a: Update package description.
- Updated dependencies [e3f479a]
- Updated dependencies [12cc5b1]
  - cnpj-utils@1.3.3
  - cpf-utils@1.4.5

## 2.0.1

### Patch Changes

- 54339e7: Fix types export.

## 2.0.0

### Release

- Utility function to deal with CNPJ:
  - Function to format CNPJ;
  - Function to generate valid CNPJ;
  - Function to validate CNPJ;
- Utility function for dealing with CPF:
  - Function to format CPF;
  - Function to generate valid CPF;
  - Function to validate CPF;
