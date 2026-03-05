---
"br-utils": major
---

### 🎉 v3 at a glance 🎊

- 🏗️ **Class-based API** — Default export is a `BrUtils` class instance with `cpf` and `cnpj` sub-modules; `BrUtils` class allows optional default settings for each (options or `CpfUtils` / `CnpjUtils` instances) and getters/setters for `cpf` and `cnpj`.
- 📦 **Single entry point, full re-exports** — One package for CPF and CNPJ; all exports from `cpf-utils` and `cnpj-utils` are re-exported (e.g. `cpfUtils`, `cnpjUtils`, `cpfFmt`, `cpfGen`, `cpfVal`, `cnpjFmt`, `cnpjGen`, `cnpjVal`, and their classes, options, errors, types).
- 🔗 **Wraps v3 sub-packages** — Behavior and options follow the v3 APIs of `cpf-utils` and `cnpj-utils` (flat format options, structured errors, class-based customization in each sub-module).

### BREAKING CHANGES

- **Named exports `cpf` and `cnpj` removed**: The package no longer exports standalone `cpf` and `cnpj` names. Use the default instance (`brUtils.cpf`, `brUtils.cnpj`) or import the re-exported instances `cpfUtils` and `cnpjUtils`. Code that did `import { cpf as cpfUtils, cnpj as cnpjUtils } from 'br-utils'` must switch to `import brUtils from 'br-utils'` and use `brUtils.cpf` / `brUtils.cnpj`, or use `import { cpfUtils, cnpjUtils } from 'br-utils'`.
- **Default export is a `BrUtils` instance**: The default export is now an instance of the `BrUtils` class (frozen), not a plain object. It still exposes `cpf` and `cnpj` for the same usage pattern (`brUtils.cpf.format()`, etc.), but code that relied on the default being a plain object (e.g. spreading, or checking for specific own properties) may need updates.
- **CommonJS/UMD default carries re-exports**: In CommonJS and UMD, the default export object also includes all re-exported names from `cpf-utils` and `cnpj-utils` (e.g. `BrUtils`, `cpfUtils`, `cnpjUtils`, `cpfFmt`, `cnpjFmt`, classes, errors). Code that assumed the default had only `cpf` and `cnpj` or a minimal surface may need updates.

### New features

- **`BrUtils` class**: Construct with optional `BrUtilsSettingsInput` (`cpf` and `cnpj` as options objects or `CpfUtils` / `CnpjUtils` instances). Instance has getters/setters for `cpf` and `cnpj`; setters accept an instance, an options object, or `null`/`undefined` to reset to defaults.
- **Direct use of sub-package APIs**: Import and use `cpfUtils`, `cnpjUtils`, `cpfFmt`, `cpfGen`, `cpfVal`, `cnpjFmt`, `cnpjGen`, `cnpjVal`, and all their classes, options, errors, and types from `br-utils` without depending on `cpf-utils` or `cnpj-utils` directly.

### Improvements

- **New PT-BR documentation**: New [README in Brazilian Portuguese](./README.pt.md).
- **Documentation**: README and README.pt.md updated to match current API (BrUtils class, default instance, re-exports, constructor/setter options) and aligned structure with `cpf-utils` and `cnpj-utils`.
