# Contributing to `br-utils`

Thank you for your interest in contributing to this initiative! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Contributing Guidelines](#contributing-guidelines)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Code Style](#code-style)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Feature Requests](#feature-requests)

## Code of Conduct

This project adheres to a code of conduct that we expect all contributors to follow. Please be respectful, inclusive, and constructive in all interactions.

## Getting Started

Before contributing, please:

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Set up the development environment** (see [Development Setup](#development-setup))
4. **Create a feature branch** for your changes
5. **Make your changes** following our guidelines
6. **Test your changes** thoroughly
7. **Submit a pull request**

## Development Setup

### Prerequisites

- **Node.js** (v18 or higher)
- **Bun** (v1.0 or higher) - for testing and package management
- **Git** - for version control

### Installation

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/br-utils-js.git
cd br-utils-js

# Install dependencies
bun install

# Verify setup
bun test
bun run build
```

### Available Scripts

```bash
# Development
bun run build          # Build the project
bun run type-check     # Run TypeScript type checking
bun run lint           # Run ESLint with auto-fix
bun test               # Run all tests
bun test --coverage    # Run tests with coverage report

# Production
bun run build          # Build for production
```

## Project Structure

```
br-utils-js/
├── src/                    # Source code
│   ├── core/              # Core functionality
│   │   ├── FieldProcessor.ts
│   │   └── OptionsSchema.ts
│   ├── errors/            # Error classes
│   │   ├── CustomTestError.ts
│   │   ├── FieldError.ts
│   │   └── ValidationError.ts
│   ├── processors/        # Field type processors
│   │   └── IntFieldProcessor.ts
│   ├── types/             # TypeScript type definitions
│   │   ├── FieldDefinition.ts
│   │   ├── FieldType.ts
│   │   └── ValidationResult.ts
│   └── index.ts           # Main entry point
├── test/                  # Test files
│   ├── core/             # Core tests
│   ├── errors/           # Error tests
│   ├── processors/       # Processor tests
│   └── types/            # Type tests
├── build/                # Built files (generated)
├── dist/                 # Distribution files (generated)
├── docs/                 # Documentation
├── .eslintrc.js         # ESLint configuration
├── rollup.config.mjs    # Rollup configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Package configuration
```

## Contributing Guidelines

### What We're Looking For

We welcome contributions in the following areas:

- **🐛 Bug Fixes**: Fix issues and improve stability
- **✨ New Features**: Add new field types, processors, or functionality
- **📚 Documentation**: Improve docs, examples, and guides
- **🧪 Tests**: Add test coverage for new or existing features
- **⚡ Performance**: Optimize validation performance
- **🔧 Tooling**: Improve build, linting, or development tools

### What We're NOT Looking For

- Breaking changes to the public API without discussion
- Changes that reduce test coverage
- Code that doesn't follow our style guidelines
- Features that don't align with the project's goals

## Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-description
```

### 2. Make Your Changes

- Write clean, readable code
- Follow our coding standards
- Add tests for new functionality
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run all tests
bun test

# Run with coverage
bun test --coverage

# Type check
bun run type-check

# Lint
bun run lint

# Build
bun run build
```

### 4. Commit Your Changes

Use conventional commit messages:

```bash
git commit -m "feat: add string field processor"
git commit -m "fix: resolve validation error in int processor"
git commit -m "docs: update README with new examples"
git commit -m "test: add tests for bail option"
```

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a pull request on GitHub.

## Testing

### Test Structure

- Tests are located in the `test/` directory
- Test files use the `.spec.js` extension
- Tests mirror the `src/` directory structure
- Use Bun's built-in test runner

### Writing Tests

```javascript
import { describe, expect, it, beforeEach } from 'bun:test';
import { OptionsSchema } from '../src/index.js';

describe('Feature Name', () => {
  let schema;

  beforeEach(() => {
    schema = OptionsSchema.create({
      // test schema
    });
  });

  it('should do something specific', () => {
    const result = schema.validate({});
    expect(result.isValid).toBe(true);
  });
});
```

### Test Requirements

- **Coverage**: Maintain 100% line coverage
- **Edge Cases**: Test boundary conditions and error cases
- **Performance**: Consider performance implications
- **Documentation**: Tests should be self-documenting

## Code Style

### TypeScript Guidelines

- Use **strict TypeScript** settings
- Prefer **interfaces** over types for object shapes
- Use **explicit return types** for public methods
- Avoid **`any`** types; use `unknown` or specific types
- Use **generic types** for reusability

### Code Formatting

- Use **2 spaces** for indentation
- Use **semicolons** consistently
- Use **single quotes** for strings
- Use **trailing commas** in objects and arrays
- Use **arrow functions** for short functions

### Naming Conventions

- **Classes**: PascalCase (`OptionsSchema`)
- **Methods**: camelCase (`validate`)
- **Variables**: camelCase (`fieldName`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRIES`)
- **Files**: PascalCase for classes (`FieldProcessor.ts`)

### Example Code Style

```typescript
export class ExampleProcessor extends FieldProcessor {
  private readonly _customProperty: string;

  public constructor(definition: FieldDefinition) {
    super(definition);
    this._customProperty = 'example';
  }

  public validate(value: unknown): ValidationResult {
    // Implementation
  }

  private _helperMethod(): void {
    // Private implementation
  }
}
```

## Pull Request Process

### Before Submitting

- [ ] Code follows our style guidelines
- [ ] All tests pass (`bun test`)
- [ ] TypeScript compiles without errors (`bun run type-check`)
- [ ] ESLint passes (`bun run lint`)
- [ ] Build succeeds (`bun run build`)
- [ ] Documentation is updated
- [ ] Commit messages follow conventional format

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass
- [ ] New tests added
- [ ] Coverage maintained

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

### Review Process

1. **Automated Checks**: CI will run tests, linting, and type checking
2. **Code Review**: Maintainers will review your code
3. **Feedback**: Address any requested changes
4. **Approval**: Once approved, your PR will be merged

## Issue Reporting

### Bug Reports

When reporting bugs, please include:

- **Description**: Clear description of the issue
- **Steps to Reproduce**: Minimal steps to reproduce
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**: Node.js version, OS, etc.
- **Code Example**: Minimal code that demonstrates the issue

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Create schema with...
2. Call validate with...
3. See error

**Expected behavior**
What you expected to happen.

**Environment:**
- Node.js version: [e.g. 18.17.0]
- OS: [e.g. macOS 13.0]
- `br-utils` version: [e.g. 1.0.0]

**Code example**
```javascript
// Minimal code that reproduces the issue
```

**Additional context**
Any other context about the problem.
```

## Feature Requests

### Suggesting Features

When suggesting features, please include:

- **Use Case**: Why is this feature needed?
- **Proposed Solution**: How should it work?
- **Alternatives**: Other ways to solve the problem
- **Additional Context**: Any other relevant information

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
A clear description of any alternative solutions.

**Additional context**
Add any other context or screenshots about the feature request.
```

## Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Documentation**: Check the README and inline code comments

## Recognition

Contributors will be recognized in:
- **README.md**: Contributors section
- **CHANGELOG.md**: Release notes
- **GitHub**: Contributor statistics

## License

By contributing to `br-utils`, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to `br-utils`! 🎉
