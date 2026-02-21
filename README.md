# DevMind UI

> **DevMind** - DevMind 项目的前端应用

## 功能特性

- 🌍 **多语言支持** - 支持中文和英文，可轻松扩展更多语言
- 🔐 **用户认证** - JWT 基础的安全认证系统
- 📱 **响应式设计** - 完美适配桌面端和移动端
- ♿ **无障碍访问** - 符合 WCAG AA 标准

## 技术栈

- **前端框架**: Vue 3 (Composition API)
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **状态管理**: Pinia
- **路由**: Vue Router
- **国际化**: vue-i18n
- **UI组件**: Headless UI
- **日期处理**: date-fns + date-fns-tz
- **HTTP客户端**: Axios

## 项目结构

```
src/
├── api/                    # API层
│   ├── index.js           # Axios配置和拦截器
│   └── auth.js            # 认证API
├── components/            # 可复用组件
│   ├── ui/               # 基础UI组件
│   └── layout/           # 布局组件
├── pages/                # 页面组件
│   ├── Auth.vue         # 登录页
│   ├── NotFound.vue     # 404页面
│   └── ...              # 其他页面
├── store/                # Pinia stores
│   ├── user.js          # 用户状态
│   └── preferences.js   # 用户偏好（语言、时区）
├── router/               # Vue Router配置
│   └── index.js
├── i18n/                 # 国际化配置
│   └── index.js
├── locales/              # 语言资源文件
│   ├── en.json          # 英语
│   └── zh-CN.json       # 简体中文
├── utils/                # 工具函数
├── assets/               # 静态资源
│   └── css/             # 全局样式
├── App.vue              # 根组件
└── main.js              # 应用入口
```

## 开始使用

### 环境要求

- Node.js 22.x (LTS) 或更高版本
- npm 或 yarn
- 后端 API 运行在 `http://localhost:8000`

### 安装

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问应用
# 打开浏览器访问 http://localhost:5173
```

### 构建生产版本

```bash
# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

### 代码检查

```bash
# 运行 ESLint
npm run lint
```

### E2E 测试（对容器内服务）

在宿主机对容器暴露的页面跑 Playwright，无需在镜像内安装 Playwright。

1. 宿主机首次安装浏览器：`npx playwright install chromium`
2. 启动 devmind 容器（保证前端服务可从宿主机访问，如 `http://localhost:10080`）
3. 在 devmind-ui 目录执行：`npm run test:e2e:container`（内部使用 `BASE_URL=http://localhost:10080`）

也可自定义地址：`BASE_URL=http://localhost:10080 npm run test:e2e`。

## 核心功能

### 1. 认证系统

- **登录**: JWT 基础的安全登录
- **记住我**: 可选的会话持久化
- **语言切换**: 登录页面可以切换界面语言

## 后端 API 集成

### 认证端点

- `POST /api/v1/auth/login` - 登录
- `GET /api/v1/auth/user` - 获取用户信息
- `POST /api/v1/auth/logout` - 登出

## 国际化

应用支持中英文双语，可以轻松扩展到更多语言。

### 添加新语言

1. 在 `src/locales/` 目录下创建新的语言文件，例如 `ja.json`
2. 复制 `en.json` 的内容并翻译
3. 在 `src/i18n/index.js` 中导入新语言文件

### 使用翻译

```vue
<template>
  <div>{{ t('common.appName') }}</div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
```

## 环境变量

创建 `.env` 文件：

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_TITLE=DevMind
VITE_API_TIMEOUT=30000
```

### 环境变量说明

- `VITE_API_BASE_URL`: API 基础 URL（必需）
- `VITE_APP_TITLE`: 应用标题（可选）
- `VITE_API_TIMEOUT`: API 请求超时时间（毫秒），默认 30000（30秒）。在生产环境中如果遇到超时问题，可以适当增加此值

## 开发指南

### 代码风格

- 使用 ESLint 和 Prettier 进行代码格式化
- 遵循 Vue 3 Composition API 模式
- 使用 `<script setup>` 语法
- 编写描述性的组件名称

### 组件结构

```vue
<template>
  <!-- 模板内容 -->
</template>

<script setup>
// 脚本内容
</script>

<style scoped>
/* 组件样式 */
</style>
```

### 状态管理

- 使用 Pinia 管理全局状态
- 尽可能保持组件状态本地化
- 使用 computed 属性处理派生状态

## 浏览器支持

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License
