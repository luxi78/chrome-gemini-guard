# chrome-gemini-guard overview
- Purpose: Tauri desktop app to guard/repair key Chrome Local State fields (country and GLIC eligibility) and expose controls/status in a React UI.
- Stack: Tauri 2.x, Rust backend (`src-tauri`), React + TypeScript + Vite frontend (`src`), Bun package manager, Vitest + Testing Library.
- Repo shape:
  - `src/`: frontend app/components/lib/tests
  - `src-tauri/`: Rust app state, commands, services, integration/unit tests
  - `docs/`: handoff and boundary docs
  - Root scripts in `package.json` for dev/build/test.