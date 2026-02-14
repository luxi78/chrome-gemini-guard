# TDD Boundary (Step 1 + Step 2 only)

This repository is currently in a strict TDD pre-implementation stage.

## Allowed in this stage

- Project skeleton and module boundaries.
- Interface and contract definitions.
- High-density TODO comments for future implementation agents.
- Test fixtures and RED tests.
- Mock and stub placeholders.

## Forbidden in this stage

- Real file watching logic.
- Real Local State patch and write logic.
- Real tray side-effect logic.
- Real network probing logic.
- Any production behavior that would claim feature completion.

## Handoff intent

The next agent (Step 3) should implement behavior by following:

1. TODO annotations in code.
2. Failing tests and test names.
3. Contract types and error semantics.

No file in this stage should be interpreted as a completed feature implementation.
