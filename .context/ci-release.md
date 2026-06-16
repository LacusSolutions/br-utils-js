---
id: ci-release
title: CI and release awareness
scope: .github/workflows/
triggers:
  - editing CI or release workflow files
  - understanding the build and test pipeline
  - verifying local changes before claiming done
  - investigating a CI failure
---

# ci-release

This harness documents CI and release workflows for awareness. Agents do **not** run releases. All paths are relative to the **js/** project root.

## Repository constraints

- **Do not run** `bun run release`, `bun run changeset version`, `bun run changeset publish`, or `npm publish`. Only the developer (via the release workflow) does that.
- CI workflow edits must stay within `.github/workflows/`.
- Do not add secrets, tokens, or credentials to workflow files.
- Before claiming any implementation task is done, validate locally with the commands in the "Local validation" section below.

## CI workflow (`.github/workflows/ci.yml`)

Triggered on every push to any branch and on `workflow_dispatch`.

| Step | Command |
|------|---------|
| Install | `bun install --frozen-lockfile` |
| Build | `bun run build` |
| Type check | `bun run type-check` |
| Lint | `bun run lint:ci` |
| Tests | `bun run test:ci` |

All jobs run in parallel after the build step. A PR must pass all jobs to be mergeable.

## Release workflow (`.github/workflows/release.yml`)

Triggered on push to `main` only. Runs the same build/check/test sequence, then uses the [Changesets action](https://github.com/changesets/action) to:

1. Open a "New Packages Release" PR if pending changesets exist (`bun run version`).
2. Publish packages to npm when that PR is merged (`bun run release`).

Agents never trigger or simulate this workflow.

## Local validation commands

Run these from the project root before declaring any implementation task complete:

```bash
# Full pipeline (mirrors CI exactly)
bun run build && bun run type-check && bun run lint:ci && bun run test:ci

# Faster targeted check for a single package
bun run build:<pkg> && bun run type-check:<pkg> && bun run lint:<pkg> && bun run test:<pkg>
```

If any command fails, fix the issue before marking the task done.

## When to edit workflow files

Edit `.github/workflows/ci.yml` or `release.yml` only when:
- Adding a new job or check required by a new tooling decision.
- Bumping a pinned action version after developer approval.
- Fixing a broken workflow step.

Workflow file changes are dev-only and do **not** require a changeset.

## Reference

| Concern | Path |
|---------|------|
| CI workflow | `.github/workflows/ci.yml` |
| Release workflow | `.github/workflows/release.yml` |
| Changesets config | `.changeset/config.json` |
| Changelog harness | [`.context/changelogs.md`](changelogs.md) |
