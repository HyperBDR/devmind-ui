# devmind-browser-e2e 测试报告

**执行时间**: 2025-03-02  
**Skill**: devmind-browser-e2e  
**BASE_URL**: `http://localhost:9091`  
**视口**: 1280×900（PC）  
**账号**: admin / adminpassword  
**Commit**: unknown  

---

## 环境检查结果

| 检查项 | 结果 | 说明 |
|--------|------|------|
| cursor-ide-browser MCP | 可用 | 工具调用正常 |
| 被测应用 (localhost:9091) | 可达 | 页面加载正常 |
| 视口 | 1280×900 | 已 resize，桌面布局 |
| 登录 | 已登录 | 会话有效，直接进入 dashboard |
| 南向操作 | 已执行 | 三个 management 设置页点击保存，均出现 Saved successfully |

---

## 按路由结果

| Route | Access | Layout | GET/config | Southbound | Note |
|-------|--------|--------|------------|------------|------|
| /dashboard | ok | ok | skip | skip | |
| /cloud-billing/settings | ok | ok | ok | skip | 无保存按钮或未测南向 |
| /management/task-management/settings | ok | ok | ok | ok | Save Changes → Saved successfully |
| /management/notifier/settings | ok | ok | ok | ok | Save changes → Saved successfully |
| /management/llm/data-settings | ok | ok | ok | ok | Save Changes → Saved successfully |
| /management/users | ok | ok | skip | skip | Showing 1 - 1 of 1 |
| /management/groups | ok | ok | skip | skip | |
| /management/llm/stats | ok | ok | skip | skip | |
| /management/llm/usage | ok | ok | skip | skip | |
| /management/llm/config | ok | ok | skip | skip | |
| /management/task-management/list | ok | ok | skip | skip | Showing 1 - 20 of 337 |
| /management/task-management/stats | ok | ok | skip | skip | |
| /management/notifier/stats | ok | ok | skip | skip | |
| /management/notifier/records | ok | ok | skip | skip | |
| /management/notifier/channels | ok | ok | skip | skip | |

---

## 汇总

- **总路由数**: 15  
- **Access ok**: 15  
- **Layout ok**: 15  
- **GET/config ok**: 4（设置页）  
- **Southbound ok**: 3（task-management、notifier、llm/data-settings 保存均成功）  
- **Southbound skip**: 1（cloud-billing/settings 未测保存）  

所有页面可访问，布局无显性异常；设置页配置加载正常；南向「不改值保存」三页均成功。

---

*本报告由 devmind-browser-e2e Skill 执行生成，保存于 devmind-ui 项目内 `docs/e2e/e2e-report_unknown.md`。*
