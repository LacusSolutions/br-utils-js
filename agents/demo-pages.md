---
id: demo-pages
title: Demo pages
scope: packages/cpf-utils/demo/, packages/cnpj-utils/demo/
triggers:
  - updating a demo page
  - adding a new UI section to a demo
  - keeping CPF and CNPJ demos in sync
  - updating demo after a public option or default changes
---

# demo-pages

Maintain the static HTML demo pages for `cpf-utils` and `cnpj-utils`. All paths are relative to the **js/** project root.

## Repository constraints

- Demo pages are **not published to npm** — `demo/` is excluded from the `"files"` field in each package's `package.json`.
- Demo pages use **static HTML + vanilla JS** — no build step, no framework, no npm dependencies imported at runtime.
- External dependencies loaded via CDN (e.g. Materialize CSS, Google Fonts, icon libraries) — do not add new CDN dependencies without developer approval.
- CPF and CNPJ demo pages should stay in **visual and structural sync** for shared UX patterns (navigation, tab layout, copy button, hotkeys).

## Demo directory layout

```
packages/{cpf,cnpj}-utils/demo/
  index.html        # Single-page static HTML
  favicon.ico
  logo.png
  styles/
    index.css
  scripts/
    index.js        # Vanilla JS that wires all UI sections
```

## When to update a demo page

Update the demo when:
- A public option is added, removed, renamed, or its default value changes.
- A new class or facade function is exposed (add a new demo section).
- An existing behavior changes in a way visible to end users.

Do **not** update the demo for:
- Internal refactors invisible to users.
- Test or CI changes.
- Changes that affect only the API type signatures but not runtime behavior.

## `scripts/index.js` structure

The main script calls a series of setup functions at the top level, one per UI section:

```js
'use strict';

setupSkipLinks();
setupInstallationTabs();
setupInstallationCopyButton();
setupGenFeatures();
setupValFeatures();
setupFmtFeatures();
setupHotkeys();
```

Each `setup*` function is defined further down in the file and is responsible for wiring a single UI section (event listeners, DOM manipulation, calling the library). Keep functions isolated — one concern per function.

## Adding a new UI section

1. Add the HTML for the new section in `index.html`, following the existing section structure.
2. Add a `setup<Section>()` function in `scripts/index.js`.
3. Call it at the top of the file alongside the other setup calls.
4. Mirror the same section in the CNPJ demo if the feature exists there too.

## CPF ↔ CNPJ sync

When adding or changing a shared UX pattern (e.g. a new formatter option UI, a copy button):

1. Apply the change in the `cpf-utils` demo.
2. Check whether the same pattern applies to `cnpj-utils` (most structural changes do).
3. If yes, apply the symmetric change to `packages/cnpj-utils/demo/`.
4. Note any intentional divergences (e.g. CNPJ-only options like `type`, `caseSensitive`) — these do not need to be mirrored, but the HTML structure should remain consistent.

## Changesets

Demo-only changes do **not** require a changeset — the `demo/` directory is not published to npm. If the same task also changes `src/`, include a changeset for those `src/` changes per [`agents/changelogs.md`](changelogs.md).

## Reference

| Concern | Path |
|---------|------|
| CPF demo HTML | `packages/cpf-utils/demo/index.html` |
| CPF demo scripts | `packages/cpf-utils/demo/scripts/index.js` |
| CNPJ demo HTML | `packages/cnpj-utils/demo/index.html` |
| CNPJ demo scripts | `packages/cnpj-utils/demo/scripts/index.js` |
