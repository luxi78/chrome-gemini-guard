# Step 3 Handoff Guide (Implementation Phase)

This file is for the next coding agent that will implement business logic.

Current repository status:

- Step 1 skeleton: done
- Step 2 tests: done (contains RED tests by design)
- Step 3 implementation: not started

## Guardrails

- Do not rewrite architecture unless a test requires it.
- Implement smallest slice needed to move RED tests toward GREEN.
- Keep existing TODO tags and update them only after implementation lands.

## Test to TODO mapping

- `src-tauri/tests/policy_contract.rs`
  - `TODO(step3:policy-analyze)` in `src-tauri/src/domain/policy.rs`
  - `TODO(step3:policy-patch)` in `src-tauri/src/domain/policy.rs`
- `src-tauri/tests/path_resolver_windows.rs`
  - `TODO(step3:path-resolution)` in `src-tauri/src/services/path_resolver.rs`
- `src-tauri/tests/repair_retry_policy.rs`
  - `TODO(step3:repair-write)` in `src-tauri/src/services/repair_service.rs`
- `src-tauri/tests/startup_reconcile_flow.rs`
  - `TODO(step3:command-reconcile-now)` in `src-tauri/src/commands/guardian.rs`
  - `TODO(step3:watch-start)` in `src-tauri/src/services/watch_service.rs`
- `src-tauri/tests/tray_state_contract.rs`
  - `TODO(step3:tray-close-behavior)` in `src-tauri/src/services/tray_service.rs`
  - `TODO(step3:autostart-toggle)` in `src-tauri/src/services/autostart_service.rs`
- `src/test/api-contract.test.ts`
  - `TODO(step3:frontend-fetch-snapshot)` in `src/lib/api.ts`
  - `TODO(step3:frontend-toggle-guardian)` in `src/lib/api.ts`
  - `TODO(step3:frontend-reconcile-now)` in `src/lib/api.ts`
  - `TODO(step3:command-get-snapshot)` in `src-tauri/src/commands/guardian.rs`
  - `TODO(step3:command-update-config)` in `src-tauri/src/commands/config.rs`
- `src/test/ui-contract.test.tsx`
  - `TODO(step3:dashboard-wireup)` in `src/app/dashboard.tsx`
  - `TODO(step3:command-get-snapshot)` in `src-tauri/src/commands/guardian.rs`

## Suggested implementation order (cheap model friendly)

1. `path-resolution` -> pass windows path resolver test.
2. `policy-analyze` + `policy-patch` -> pass policy contract tests.
3. `repair-write` with deterministic backoff helper -> pass retry test.
4. `command-reconcile-now` minimal orchestrator -> pass startup flow contract.
5. frontend api wrappers + dashboard wiring -> pass API/UI contract tests.
6. tray/autostart behavior alignment -> pass tray state contract.

## Exit criteria for Step 3

- All currently RED tests either pass or are explicitly replaced with stricter passing tests.
- No placeholder `unimplemented!()` remains in runtime code paths.
- Startup reconcile path logs events for detect/notify/repair terminal states.
