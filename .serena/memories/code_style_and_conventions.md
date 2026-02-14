# Code style and conventions
- Language: TypeScript on frontend (ES modules), Rust backend.
- Naming: camelCase for TS values/functions, PascalCase for React components/types.
- UI contract tests depend on `data-testid` values in components; preserve them during UI refactors.
- Existing code keeps concise, task-scoped comments (TODO blocks in dashboard) and typed props/interfaces.
- Keep changes focused; avoid broad refactors unless requested.