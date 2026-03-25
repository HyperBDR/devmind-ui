# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint

# Sync provider icons from LobeHub (for cloud provider logos)
npm run sync:provider-icons

# Generate favicons
npm run generate-favicons
```

### E2E Testing
```bash
# Run E2E tests (default base URL: http://localhost:10080)
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run E2E tests against container (default: http://localhost:10080)
npm run test:e2e:container

# Alternative: Use the devmind-browser-e2e skill
# This skill uses Browser MCP to test deployed containers with admin login
# Skill located at: .agents/skills/devmind-browser-e2e/
# Test reports output to: docs/e2e/
```

### Docker Commands
```bash
# Build production image
docker build -t devmind-ui:latest .

# Build with API URL
docker build --build-arg VITE_API_BASE_URL=https://api.example.com -t devmind-ui:prod .
```

## Architecture Overview

### Tech Stack
- **Vue 3** with Composition API and `<script setup>` syntax
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Pinia** for state management
- **Vue Router** with dynamic imports
- **vue-i18n** for internationalization
- **Axios** with token refresh interceptors
- **Chart.js** for data visualization

### Project Structure
```
src/
├── admin/                    # Admin management interface (admin-only routes)
│   ├── api/                 # Admin-specific API calls
│   ├── layout/              # Admin layout components
│   ├── pages/               # Admin page components (LLM, Notifications, TaskManagement)
│   └── routes.js            # Admin routes (mounted in main router)
├── api/                     # API layer with interceptors
│   ├── index.js            # Axios instance with token refresh
│   └── *.js                # Domain-specific API modules
├── components/             # Reusable components
│   ├── ui/                 # Base UI components
│   ├── layout/             # Main app layout components
│   ├── articles/           # Article-related components
│   ├── cloud-billing/      # Cloud billing components
│   ├── data-collector/     # Data collector components
│   ├── github/             # GitHub integration components
│   ├── scheduledTasks/     # Scheduled tasks components
│   ├── settings/           # Settings components
│   ├── task-management/    # Task management components
│   └── tasks/              # Generic task components
├── pages/                  # Main application pages
│   ├── settings/           # Settings subpages
│   ├── CloudBilling/       # Cloud billing pages
│   ├── DataCollector/      # Data collector pages
│   └── *.vue               # Top-level pages
├── store/                  # Pinia stores
│   ├── user.js            # User authentication and profile
│   ├── preferences.js     # User preferences (language, timezone)
│   └── config.js          # App configuration
├── router/                 # Vue Router configuration
│   └── index.js           # Main router with navigation guards
├── config/                 # Configuration files
│   └── api.js             # API base URL and timeout configuration
├── assets/                 # Static assets
│   ├── css/               # Global styles
│   └── provider-icons/    # Cloud provider icons from LobeHub
├── i18n/                  # Vue i18n configuration
│   └── index.js          # i18n instance with language loading from localStorage
└── locales/              # Internationalization message files
    ├── en.json          # English translations
    ├── zh-CN.json       # Chinese translations
    └── admin/           # Admin-specific translations (merged with main translations)
```

### Key Architectural Patterns

#### Authentication & Authorization
- JWT-based authentication with refresh token mechanism
- Token stored in localStorage, managed by Pinia user store
- Navigation guards check `requiresAuth` and `requiresAdmin` meta fields
- Axios interceptors handle token refresh automatically on 401 responses
- Admin routes (`/management/*`) require `userInfo?.is_staff` to be true

#### API Layer
- Centralized Axios instance in `src/api/index.js`
- Automatic token refresh with request queuing to prevent concurrent refreshes
- Response interceptor handles unified response format: `{code, message, data}`
- CSRF token and language headers automatically added
- API base URL configurable via `VITE_API_BASE_URL` environment variable

#### State Management
- **User Store**: Authentication state, tokens, profile data
- **Preferences Store**: UI language (localStorage), timezone
- **Config Store**: Application configuration loaded from backend
- Stores use Composition API style with reactive refs and computed properties

#### Routing Structure
- Main app routes: `/dashboard`, `/settings/*`, `/cloud-billing/*`, `/data-collector/*`
- Admin routes: `/management/*` (users, groups, LLM, notifications, task management)
- Redirect aliases: `/llm/*` → `/management/llm/*`, `/notifier/*` → `/management/notifier/*`
- Lazy loading of page components via dynamic imports

#### Internationalization
- UI language stored in localStorage as `userLanguage`
- Language header automatically added to all API requests
- Language switching updates localStorage and triggers page reload
- Backend language (for AI/processing) separate from UI language
- Supported languages: English (`en`) and Simplified Chinese (`zh-CN`)
- Admin translations merged with main translations in `src/i18n/index.js`
- Spanish (`es`) was previously supported but now falls back to English

#### Component Organization
- **Base UI Components**: Reusable low-level components in `components/ui/`
- **Domain Components**: Feature-specific components organized by domain
- **Layout Components**: App-wide layout structure
- **Admin Components**: Admin-specific components separated from main app

### E2E Testing Strategy
- Playwright for E2E tests in `e2e/` directory
- Tests designed to run against deployed containers (`npm run test:e2e:container`)
- **Recommended**: Use the `devmind-browser-e2e` skill for comprehensive testing
- Skill performs admin login and tests all admin panel pages with assertions
- Test reports saved to `docs/e2e/` directory

### Docker Deployment
- Multi-stage build: Node.js builder + Nginx production server
- Static files served by Nginx with SPA routing support (`nginx.conf`)
- Build-time environment variable `VITE_API_BASE_URL` configures API endpoint
- Default exposed port: 80

### Environment Variables
- `VITE_API_BASE_URL`: API base URL (required for production)
- `VITE_API_TIMEOUT`: API request timeout in milliseconds (default: 30000)
- `VITE_APP_TITLE`: Application title (optional)

### Main Feature Modules
- **Cloud Billing**: Multi-provider cost tracking, alerts, and visualization
- **Data Collector**: Configurable data collection tasks and execution records
- **GitHub Integration**: Project tracking and trending analysis
- **LLM Management**: Model usage statistics and configuration (admin-only)
- **Task Management**: Scheduled and manual task execution
- **Notifications**: Multi-channel notification system (admin-only)
- **Articles**: Content management with translation capabilities

### Development Guidelines
1. Use `<script setup>` syntax for Vue components
2. Follow Composition API patterns with reactive refs and computed properties
3. Keep components focused and composable
4. Use Tailwind utility classes for styling
5. Implement proper error boundaries and loading states
6. Follow existing patterns for API calls and state management
7. Leverage existing domain components (`components/*/`) when adding new features
8. Admin functionality should be placed in `admin/` directory with proper `requiresAdmin` guards