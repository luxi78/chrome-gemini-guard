# What to run after changes
- For frontend/UI changes: run `bun run test` at repo root.
- For Rust/backend changes: run `cargo test` in `src-tauri`.
- If command/state integration changed, run both frontend and Rust tests.
- Confirm app still starts via `bun run tauri:dev` for manual smoke check when needed.