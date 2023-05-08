# 1. Conventional Commits

[A specification for adding human and machine readable meaning to commit messages](https://www.conventionalcommits.org/en/v1.0.0/)

## 1.1 Commit Message

The commit message should be structured as follows:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## 1.2 Common Commit Types

The commit contains the following structural elements, to communicate intent to the consumers of your library:

- **fix**: Fix patches a bug in the codebase (this correlates with PATCH in Semantic Versioning).
- **feat**: Introduces a new feature to the codebase (this correlates with MINOR in Semantic Versioning).
- **chore**: Updating grunt tasks etc; no production code change.

## 1.3 Other Commit Types

- **build**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
- **ci**: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
- **docs**: Documentation only changes
- **perf**: A code change that improves performance
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **test**: Adding missing tests or correcting existing tests
