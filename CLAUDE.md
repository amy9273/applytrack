# ApplyTrack Context & Rules

Read the context files in order before making changes:
1. `context/project-overview.md` — Product definition & user requirements.
2. `context/architecture.md` — System architecture and strict invariants.
3. `context/security-best-practices.md` — Security and credential rules.
4. `context/progress-tracker.md` — Current progress.

### Operating Rules
- Never commit secrets or `.env` files into source control.
- Never write or delete from Gmail; use only read-only permissions.
- Keep the UI responsive and information-focused.
- Support multi-account Gmail connections and zero-setup demo mode.
