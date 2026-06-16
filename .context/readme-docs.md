---
id: readme-js
title: Package README authoring
scope: packages/*/README.md, packages/*/README.pt.md, packages/br-utils/README.md (root sync)
triggers:
  - creating or updating a package README
  - rewriting or reviewing README.md or README.pt.md
  - editing repository-root README.md or README.pt.md (via packages/br-utils/)
  - npm or package documentation
  - translating README to Portuguese (README.pt.md)
---

# readme-js

Author and maintain `README.md` files under `packages/<pkg>/` following the established br-utils-js conventions.

## Repository constraints

### Root READMEs

Do **not** edit repository-root `README.md` or `README.pt.md` directly. Edit `packages/br-utils/README.md` and `packages/br-utils/README.pt.md` instead. Lint-staged keeps the root copies in sync on commit.

### Portuguese parity

English `README.md` is the source of truth for structure and content. Any change to a package's `README.md` must be reflected in that package's `README.pt.md` (faithful translation). The `utils` package has no `README.pt.md`.

### Changelog links

Package `CHANGELOG.md` files are managed by **Changesets** — do not edit them manually. READMEs link to the changelog in the footer only.

### Package-level overrides

Before applying this harness, check whether the target package defines `packages/<pkg>/AGENTS.md` or `packages/<pkg>/agents/`. If either exists and contradicts this file on the same topic, **follow the package-level instruction** (see [`.context/README.md`](../.context/README.md#instruction-precedence)).

## Before writing

1. Check for `packages/<pkg>/AGENTS.md` and `packages/<pkg>/agents/`; apply package-level overrides when present.
2. Read `packages/<pkg>/package.json` for the npm name, description, and exports.
3. Read `src/index.ts` (or equivalent) to list public exports accurately.
4. Skim tests in `tests/` for realistic examples and edge cases.
5. Identify the **package archetype** (see below) — section depth depends on it.
6. Check sibling packages for the same domain (e.g. `cpf-fmt` when documenting `cpf-utils`).

## Package archetypes

| Archetype | Examples | Distinct traits |
|-----------|----------|-----------------|
| **Foundation** | `utils` | H1 title instead of cover image; no `Usage` section; per-function API docs; optional `## TypeScript Support`; may link to `src/` and `tests/` |
| **Single-purpose** | `cpf-fmt`, `cpf-val`, `cpf-gen`, `cpf-dv`, `cnpj-*` | Cover image; `Usage` + `API`; options tables; helper function + class pattern |
| **Aggregator** | `cpf-utils`, `cnpj-utils`, `br-utils` | Cover image; wraps sub-packages; `Usage` inlines sub-package options; `API` lists re-exports; links to sub-package READMEs for full error/option details |

Special sections (only when relevant):

- **`## Calculation algorithm`** — low-level DV packages (`cpf-dv`, `cnpj-dv`).
- **Announcement blockquote** — major features (e.g. alphanumeric CNPJ) on `br-utils`, `cnpj-utils`, and related packages.

---

## Section order (mandatory)

Use these headings in this order. Omit optional sections; never reorder core sections.

```
[Cover image OR H1 title]
[Badges row]
[Optional blockquote callouts]
[One-paragraph description]
## Platform Support
## Features
## Installation
## Quick Start
## Usage              ← omit for foundation packages
## API
[## TypeScript Support]  ← foundation packages only
[## Calculation algorithm]  ← DV packages only
## Contribution & Support
## License
## Changelog
---
Made with ❤️ by Lacus Solutions
```

---

## Header block

### Cover image (single-purpose & aggregator)

```markdown
![<pkg> for JavaScript](https://br-utils.vercel.app/img/cover_<pkg>.jpg)
```

Use the directory/package slug (e.g. `cpf-fmt`, `br-utils`). The `utils` package uses an H1 instead:

```markdown
# Lacus Solutions' Utils
```

### Badges (always six, in this order)

Replace `<npm-name>` with the scoped or unscoped npm name from `package.json`:

```markdown
[![NPM Latest Version](https://img.shields.io/npm/v/<npm-name>)](https://npmjs.com/package/<npm-name>)
[![Bundle Size](https://img.shields.io/bundlephobia/min/<npm-name>?label=bundle%20size)](https://bundlephobia.com/package/<npm-name>)
[![Downloads Count](https://img.shields.io/npm/dm/<npm-name>.svg)](https://npmjs.com/package/<npm-name>)
[![Test Status](https://img.shields.io/github/actions/workflow/status/LacusSolutions/br-utils-js/ci.yml?label=ci/cd)](https://github.com/LacusSolutions/br-utils-js/actions)
[![Last Update Date](https://img.shields.io/github/last-commit/LacusSolutions/br-utils-js)](https://github.com/LacusSolutions/br-utils-js)
[![Project License](https://img.shields.io/github/license/LacusSolutions/br-utils-js)](https://github.com/LacusSolutions/br-utils-js/blob/main/LICENSE)
```

### Optional callouts (blockquotes, before description)

Portuguese doc link (all packages except `utils`):

```markdown
> 🌎 [Acessar documentação em português](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/<pkg>/README.pt.md)
```

Feature announcement (when applicable):

```markdown
> 🚀 **Full support for the [new alphanumeric CNPJ format](https://github.com/user-attachments/files/23937961/calculodvcnpjalfanaumerico.pdf).**
```

### Description (one paragraph)

Pattern:

> A JavaScript/TypeScript **{noun}** to **{primary action}** **{subject}** ({expanded name})**.**

- Aggregators add: "It wraps [`sub-pkg`](npm link), … in a single API."
- Use domain expansions: CPF (Brazilian Individual's Taxpayer ID), CNPJ (Brazilian Business Tax ID / employer ID).

---

## Platform Support

Copy this table verbatim (do not alter icons or version labels):

```markdown
## Platform Support

| ![Node.js](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg) | ![Bun](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bun/bun-original.svg) | ![Deno](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/denojs/denojs-original.svg) | ![Chrome](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chrome/chrome-original.svg) | ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![Firefox](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firefox/firefox-original.svg) | ![Safari](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/safari/safari-original.svg) | ![Opera](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opera/opera-original.svg) | ![IE](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ie10/ie10-original.svg) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| v16+ ✔ | v1.0+ ✔ | ⚠️ untested | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | 11 ✔ |
```

---

## Features

Bulleted list; each item:

```markdown
- ✅ **{Short label}**: {One sentence benefit or capability}
```

Standard features to include when applicable:

- **Flexible input** / **Format agnostic** — string or string[] input, strips non-numeric chars
- **TypeScript support**: Full type definitions and strict-mode compatible
- **Minimal dependencies** / **Zero dependencies** — name internal `@lacussoft/*` deps explicitly
- **Error handling** — summarize throw vs return-false behavior
- Aggregator-only: **Unified API**, **Reusable instance**, **Full re-exports**

Order: domain-specific features first, then TypeScript, dependencies, error handling.

---

## Installation

Always show NPM and Bun:

```markdown
## Installation

```bash
# using NPM
$ npm install --save <npm-name>

# using Bun
$ bun add <npm-name>
```
```

---

## Quick Start

Four sub-parts in order:

1. **Import examples** — ESM first, then CommonJS. Aggregators also show named exports for tree-shaking.
2. **`Basic usage:`** heading — inline comments showing real inputs/outputs.
3. **UMD/CDN** — legacy browser snippet with jsDelivr `@latest` dist path.

### Import pattern (single-purpose)

```ts
// ES Modules
import cpfFmt from '@lacussoft/cpf-fmt'

// Common JS
const cpfFmt = require('@lacussoft/cpf-fmt')
```

### Import pattern (aggregator)

```ts
// ES Modules — default instance
import cpfUtils from 'cpf-utils'

// Or named exports (tree-shaking)
import { CpfUtils, cpfFmt, cpfGen, cpfVal } from 'cpf-utils'

// Common JS
const cpfUtils = require('cpf-utils')
```

### Basic usage conventions

- Use realistic domain values (not `foo`/`bar`).
- Non-deterministic outputs: `// e.g. '478.442.410-55'`
- Deterministic outputs: no prefix comment
- Show 2–4 option variants when options exist

### UMD snippet

```markdown
For legacy frontends, include the UMD build (e.g. minified) in a `<script>` tag; `{globalName}` is exposed globally:

```html
<script src="https://cdn.jsdelivr.net/npm/<npm-name>@latest/dist/<pkg>.min.js"></script>
```
```

Global names: helper name (`cpfFmt`), instance name (`cpfUtils`, `brUtils`), class name (`CpfCheckDigits`), or `lacusUtils` for `@lacussoft/utils`.

---

## Usage

Structure with `###` subsections. Standard patterns:

### Options tables

When a function/class accepts options:

```markdown
### {Domain} options

All options are optional:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `optionKey` | boolean | `false` | When `true`, … |
```

Follow with an "Example with all options" code block when ≥4 options exist.

### Helper function + class (single-purpose)

Document both, in this order:

1. **`### \`helperFn\` (helper function)`** — one paragraph: what it returns, throw vs callback behavior, note it wraps the class internally.
   - Parameter bullets: **`- \`param\``** with type and description.
   - **`Throws:`** line when applicable.
2. **`### \`ClassName\` (class)`** — code example, then bullet list of constructor/methods/properties.

Class bullets format:

```markdown
- **`constructor`**: `new ClassName(options?)` — …
- **`methodName(input, options?)`**: …
```

### Aggregator Usage

1. Inline options tables from wrapped packages (formatter, generator, validator).
2. **`### \`defaultInstance\` (default instance)`** — list methods with backtick signatures.
3. **`### \`UtilsClass\` (class)`** — constructor example + getter/setter bullets.
4. **`### Using the underlying helpers …`** — re-export usage + link to sub-package READMEs.

Cross-link sub-packages:

```markdown
See [@lacussoft/cpf-fmt](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/cpf-fmt/README.md), … for full option and error details.
```

### Input formats (validators, formatters, DV)

When input shapes matter, add `### Input formats` with **String input** and **Array of strings** sub-bullets.

---

## API

Always two subsections minimum:

### Exports

Bulleted list. Each export:

```markdown
- **\`exportName\`**: Signature or role description
- **Types**: `TypeA`, `TypeB`, …
```

Include constants (`CPF_LENGTH`, etc.) and group re-exports by domain for aggregators.

Foundation packages: one `### \`functionName\`` subsection per export with signature, behavior table or bullets, and links to source/tests:

```markdown
See [`src/describe-type.ts`](src/describe-type.ts) and [`tests/describe-type.spec.ts`](tests/describe-type.spec.ts).
```

Optional **`### Exports summary`** table for foundation packages.

### Errors & Exceptions

- Opening sentence: TypeError vs Exception hierarchy, throw vs return-false.
- Bulleted exception classes with em dash descriptions; mark abstract bases with _(_abstract_)_.
- Include a **`try/catch`** example importing specific error classes when ≥2 exceptions exist.

Heading variants used in the repo (pick one per package, stay consistent within a domain):

- `### Errors & Exceptions` — preferred for val/gen/utils aggregators
- `### Exceptions` — acceptable for fmt-only packages

---

## TypeScript Support (foundation only)

```markdown
## TypeScript Support

- Written in TypeScript
- Declarations in `dist/index.d.ts`
- Compatible with `strict: true`
```

---

## Calculation algorithm (DV packages only)

Numbered steps describing the official Brazilian algorithm. Reference digit positions and weight sequences explicitly.

---

## Footer sections (copy verbatim, adjust paths)

### Contribution & Support

```markdown
## Contribution & Support

We welcome contributions! Please see our [Contributing Guidelines](https://github.com/LacusSolutions/br-utils-js/blob/main/CONTRIBUTING.md) for details. If you find this project helpful, please consider:

- ⭐ Starring the repository
- 🤝 Contributing to the codebase
- 💡 [Suggesting new features](https://github.com/LacusSolutions/br-utils-js/issues)
- 🐛 [Reporting bugs](https://github.com/LacusSolutions/br-utils-js/issues)
```

### License

```markdown
## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/LacusSolutions/br-utils-js/blob/main/LICENSE) file for details.
```

### Changelog

```markdown
## Changelog

See [CHANGELOG](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/<pkg>/CHANGELOG.md) for a list of changes and version history.
```

### Sign-off

```markdown
---

Made with ❤️ by [Lacus Solutions](https://github.com/LacusSolutions)
```

---

## Writing style

| Rule | Detail |
|------|--------|
| Language | English in `README.md`; mirror structure in `README.pt.md` |
| Voice | Direct, technical, third-person; present tense |
| Formatting | Backticks for identifiers, options, types; **`bold`** for export/method names in prose |
| Code comments | `// ES Modules`, `// Common JS`, `// e.g.` for generated values |
| Links | GitHub tree paths for repo docs; npmjs.com for package links; jsDelivr for CDN |
| Accuracy | Document actual exports and defaults from source — never invent APIs |
| Aggregators | Summarize sub-package behavior; defer exhaustive error lists to sub-READMEs |
| Length | Complete but scannable; prefer tables and bullets over long paragraphs |

---

## Workflow checklist

When creating or updating a README:

```
- [ ] Archetype identified (foundation / single-purpose / aggregator)
- [ ] npm name and dist filename match package.json
- [ ] All public exports documented under ## API
- [ ] Quick Start covers ESM, CJS, basic usage, and UMD
- [ ] Options table defaults match source code
- [ ] Error behavior (throw vs return) is explicit
- [ ] Sub-package README links present (aggregators)
- [ ] CHANGELOG footer links to packages/<pkg>/CHANGELOG.md (file not edited manually)
- [ ] README.pt.md link present (except utils)
- [ ] README.pt.md updated when README.md changes
- [ ] br-utils README edits go to packages/br-utils/ only (never repository root)
- [ ] Footer boilerplate unchanged
```

When updating an aggregator, check whether sub-package READMEs changed and sync inlined options/errors accordingly.

---

## Reference packages

| Archetype | Canonical example |
|-----------|-------------------|
| Foundation | `packages/utils/README.md` |
| Formatter | `packages/cpf-fmt/README.md` |
| Validator | `packages/cpf-val/README.md` |
| Generator | `packages/cpf-gen/README.md` |
| Check digits | `packages/cpf-dv/README.md` |
| Domain aggregator | `packages/cpf-utils/README.md` |
| Top-level aggregator | `packages/br-utils/README.md` |
