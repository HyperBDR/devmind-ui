---
name: devmind-browser-e2e
description: Runs basic E2E checks on the DevMind frontend using Browser MCP. Logs in with admin, then verifies cloud billing settings and all admin panel pages—full checks (GET + layout) on settings pages, optional southbound (南向) write checks (save settings without changing values), lightweight checks on list/stats pages. Use when the user asks for "研发环境基础功能测试", "浏览器 MCP 测云平台账单设置、管理员面板", "admin 账号冒烟测 GET 与设置页", "南向操作用例", or similar.
---

# DevMind browser E2E (devmind-browser-e2e)

Run basic functionality tests on the DevMind app using **cursor-ide-browser MCP**. Tests focus on GET-driven and settings pages; no dependency on real business data.

**This skill does not start any service.** It assumes the **container environment is already running** (e.g. Docker Compose or deployed container); use it only when the app is up and reachable.

## Prerequisites

- **cursor-ide-browser MCP** must be enabled in the environment.
- **Container environment already up**: Do not start any separate service; the skill runs against an existing deployment. Default **BASE_URL** is the container URL (e.g. `http://localhost:9091`). Override only if the user or environment specifies another URL.
- **Credentials**: default `admin` / `adminpassword`. If the user provides credentials or env vars `TEST_USERNAME` and `TEST_PASSWORD`, use those instead.
- **Viewport (minimum width)**: Tests must run in a **PC-style viewport** to avoid mobile layout, overflow, or responsive breakpoint issues. Immediately after locking the browser, call **browser_resize** with at least **width 1280** (recommended 1280×900 or 1366×900). Do not run the test in a narrow window; this also clearly distinguishes PC vs mobile behavior.

## Browser MCP usage order

Follow this order (per MCP docs):

1. **browser_navigate** to `BASE_URL` (or `/login`).
2. **browser_lock** (must lock after a tab exists).
3. **browser_resize** to a PC viewport: **width ≥ 1280**, height ≥ 900 (e.g. 1280×900). Ensures desktop layout and avoids narrow-window/mobile issues.
4. **Login**: if the page is the login screen, **browser_fill** username and password inputs, then **browser_click** the login button. Wait for navigation (short polling with **browser_snapshot** until URL or content indicates success).
5. **Per-route checks**: for each route in the list below, **browser_navigate** to `BASE_URL + path`, then **browser_snapshot** (and optionally **browser_network_requests** for settings pages).
6. **Southbound (optional)**: on the three management settings pages, click **Save Changes** / **Save changes** without changing form values; confirm success toast/message and optionally that the corresponding PATCH/PUT returns 200. Skip if the environment disallows writes.
7. **browser_unlock** when all checks are done.

## Routes and check level

### Full check (settings pages)

For these pages, perform: navigate → wait for load → snapshot → optionally verify that the relevant GET request returns 200 (e.g. via **browser_network_requests**). Do **not** submit forms or perform write operations.

| Path | Description | Backend GET (example) |
|------|-------------|------------------------|
| `/cloud-billing/settings` | Cloud billing: providers, alert rules | e.g. GET providers list |
| `/management/task-management/settings` | Task timeout, retention, cleanup/mark-timeout crontab | `GET /v1/tasks/config/` |
| `/management/notifier/settings` | Notification retention, cleanup crontab | `GET /v1/admin/notifications/global/` |
| `/management/llm/data-settings` | LLM data retention, cleanup/aggregation crontab | `GET /v1/admin/metering-config/` |

### Southbound / write operations (optional)

**南向操作**：触发前端下发到后端的写操作（PATCH/PUT/POST），并验证请求成功与 UI 反馈。与仅 GET 的「北向」区分开。

- **Task settings** (`/management/task-management/settings`): 不修改表单值，点击 **Save Changes**，确认有成功提示且无报错；可选检查 **browser_network_requests** 中 `PATCH /v1/tasks/config/` 返回 200。
- **Notifier settings** (`/management/notifier/settings`): 同上，点击 **Save changes**，确认成功提示，可选检查 `PUT /v1/admin/notifications/global/` 200。
- **LLM data settings** (`/management/llm/data-settings`): 同上，点击 **Save Changes**，确认成功提示，可选检查 `PATCH /v1/admin/metering-config/` 200。

执行时保持表单值为当前值（或先 GET 再原样 PATCH），避免改动真实配置。若环境不允许写操作，可跳过本段并在报告中注明「南向未执行」。

### Lightweight check (list/stats pages)

For these pages, only verify: navigate → snapshot; page is accessible and has no obvious layout errors (no full-screen error text, key regions present). Do **not** assert list contents or statistics.

- `/dashboard`
- `/management/users`
- `/management/groups`
- `/management/llm/stats`
- `/management/llm/usage`
- `/management/llm/config`
- `/management/task-management/list`
- `/management/task-management/stats`
- `/management/notifier/stats`
- `/management/notifier/records`
- `/management/notifier/channels`

## Per-page checks

- **Settings pages (full)**: At least one **browser_snapshot** per page. From the snapshot, confirm: form fields or key UI blocks are present, no large blank area, no visible error message. Optionally use **browser_network_requests** to ensure the config GET returns 200.
- **List/stats pages (lightweight)**: One **browser_snapshot**; confirm the page loaded (e.g. table or stats area exists) and there is no obvious error copy. Do not assert data values.
- **Failure signals**: Error text in the snapshot, missing main content area, or (for settings) config GET 4xx/5xx.

## Report format

Produce a structured report (e.g. Markdown table or JSON) with one row per route:

- **Route** (path)
- **Access** (ok / fail): page could be opened
- **Layout** (ok / warning / fail): no obvious layout/error issues
- **GET/config** (ok / skip / fail): for settings pages, whether config GET succeeded; use "skip" for lightweight pages
- **Southbound** (ok / skip / fail): if the optional write step was run on that page, whether save succeeded and PATCH/PUT 200; use "skip" if not run
- **Note**: short remark if needed

Example:

| Route | Access | Layout | GET/config | Southbound | Note |
|-------|--------|--------|------------|------------|------|
| /cloud-billing/settings | ok | ok | ok | skip | 无保存按钮或未测南向 |
| /management/task-management/settings | ok | ok | ok | ok | Save 成功 |
| /management/users | ok | ok | skip | skip | |

## Report output location and naming

- **Project**: This skill belongs to the **devmind-ui** project. All report paths are relative to the **devmind-ui** project root.
- **Directory**: Write the report file under **`docs/e2e/`** inside the **devmind-ui** project (i.e. **`devmind-ui/docs/e2e/`** from workspace root). Create the directory if it does not exist.
- **Filename**: **`e2e-report_<commit_id>.md`** where `<commit_id>` is the first 6 characters of the current Git commit (e.g. `e2e-report_abc123.md`). Obtain it with `git rev-parse --short=6 HEAD` run in the **devmind-ui** directory. If not in a Git repo or the command fails, use **`e2e-report_unknown.md`** or a timestamp-based fallback (e.g. `e2e-report_YYYYMMDD-HHMM.md`).
- **Full path example**: `devmind-ui/docs/e2e/e2e-report_abc123.md` (from workspace root). Tell the user the path where the report was saved.

## References

- Full route list and notes: [references/routes-to-test.md](references/routes-to-test.md).
- How to interpret snapshot/network for pass vs fail: [references/assertions.md](references/assertions.md).
