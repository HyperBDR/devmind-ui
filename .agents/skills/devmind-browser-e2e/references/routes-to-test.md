# Routes to test (devmind-browser-e2e)

All paths are relative to `BASE_URL`. No service is started by this skill—assume the container environment is already running (default BASE_URL e.g. `http://localhost:9091`). Test with an admin user (e.g. `admin` / `adminpassword`).

## Full check (settings; GET + layout)

| Path | Description |
|------|-------------|
| `/cloud-billing/settings` | Cloud billing: provider auth, alert rules |
| `/management/task-management/settings` | Task timeout, retention_days, cleanup_crontab, mark_timeout_crontab |
| `/management/notifier/settings` | Notification retention, cleanup enabled/crontab |
| `/management/llm/data-settings` | LLM usage retention, cleanup/aggregation crontab |

## Southbound / 南向操作 (optional)

On the three **management** settings pages above (task-management, notifier, llm/data-settings), after snapshot: click **Save Changes** / **Save changes** without changing form values; verify success message and optionally PATCH/PUT 200. Do not change form values to avoid altering real config.

## Lightweight check (accessible + no layout error)

| Path | Description |
|------|-------------|
| `/dashboard` | Post-login landing |
| `/management/users` | User list |
| `/management/groups` | Groups |
| `/management/llm/stats` | LLM stats |
| `/management/llm/usage` | LLM usage |
| `/management/llm/config` | LLM config list |
| `/management/task-management/list` | Task list |
| `/management/task-management/stats` | Task stats |
| `/management/notifier/stats` | Notifier stats |
| `/management/notifier/records` | Notifier records |
| `/management/notifier/channels` | Notifier channels |

## Order suggestion

1. Login at `/login` or `BASE_URL`.
2. Optional: `/dashboard` to confirm login.
3. `/cloud-billing/settings`.
4. Admin settings: task-management/settings, notifier/settings, llm/data-settings.
5. Remaining management routes in any order.
