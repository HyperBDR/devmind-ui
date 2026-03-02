# Assertions (pass/fail) for devmind-browser-e2e

Use these rules when interpreting **browser_snapshot** and (optionally) **browser_network_requests** to decide pass vs fail.

**Viewport**: Layout is evaluated in a **desktop viewport** (browser_resize to at least 1280×900). This avoids mobile/narrow-window issues and keeps tests clearly in the PC scope.

## From snapshot

- **Pass (layout ok)**: Main content area is present (e.g. heading, form, table, or stats block). No full-page or prominent error message. No critical landmark missing (e.g. settings page without any form fields).
- **Warning**: Page loads but something is off (e.g. empty list where a table is expected; still acceptable for lightweight check).
- **Fail**: Blank main area, visible error text (e.g. "Error", "Failed to load", 404), or page clearly not the intended route.

## From network (settings pages only)

- **Pass**: The config GET for that page (e.g. `/v1/tasks/config/`, `/v1/admin/notifications/global/`, `/v1/admin/metering-config/`, or cloud billing providers) returns HTTP 200.
- **Fail**: That GET returns 4xx or 5xx.

## Per route type

- **Settings pages**: Require both snapshot (layout ok) and, when checked, config GET 200.
- **List/stats pages**: Only snapshot; "layout ok" if page structure is present and no error copy. Do not assert list length or numeric values.
- **Southbound (南向)**: When the optional write step is run (click Save without changing values), pass if success toast/message appears and the corresponding PATCH/PUT returns 200; fail if error message or 4xx/5xx. Use "skip" if the step was not run.
