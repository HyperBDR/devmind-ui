import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/user'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/Auth.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/pages/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    redirect: '/settings/profile'
  },
  {
    path: '/settings/profile',
    name: 'SettingsProfile',
    component: () => import('@/pages/settings/Profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/settings/jira',
    name: 'SettingsJira',
    component: () => import('@/pages/settings/Jira.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/settings/gitlab',
    name: 'SettingsGitLab',
    component: () => import('@/pages/settings/GitLab.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/settings/llm',
    name: 'SettingsLLM',
    component: () => import('@/pages/settings/LLM.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/settings/feishu',
    name: 'SettingsFeishu',
    component: () => import('@/pages/settings/Feishu.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/settings/notifications',
    name: 'SettingsNotifications',
    component: () => import('@/pages/settings/Notifications.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/cloud-billing',
    redirect: '/cloud-billing/billing'
  },
  {
    path: '/cloud-billing/billing',
    name: 'CloudBillingBilling',
    component: () => import('@/pages/CloudBilling/Billing.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/cloud-billing/tasks',
    name: 'CloudBillingTasks',
    component: () => import('@/pages/CloudBilling/Tasks.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/cloud-billing/alerts',
    name: 'CloudBillingAlerts',
    component: () => import('@/pages/CloudBilling/Alerts/Records.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/cloud-billing/settings',
    name: 'CloudBillingSettings',
    component: () => import('@/pages/CloudBilling/Settings.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/llm',
    redirect: '/llm/stats'
  },
  {
    path: '/llm/stats',
    name: 'LLMStats',
    component: () => import('@/pages/LLM/Stats.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/llm/usage',
    name: 'LLMUsage',
    component: () => import('@/pages/LLM/Usage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/llm/config',
    name: 'LLMConfig',
    component: () => import('@/pages/LLM/Config.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/task-management',
    redirect: '/task-management/list'
  },
  {
    path: '/task-management/list',
    name: 'TaskManagementList',
    component: () => import('@/pages/TaskManagement/List.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/task-management/stats',
    name: 'TaskManagementStats',
    component: () => import('@/pages/TaskManagement/Stats.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/task-management/settings',
    name: 'TaskManagementSettings',
    component: () => import('@/pages/TaskManagement/Settings.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/notifier',
    redirect: '/notifier/stats'
  },
  {
    path: '/notifier/stats',
    name: 'AdminNotificationsStats',
    component: () => import('@/pages/AdminNotifications/Stats.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/notifier/records',
    name: 'AdminNotificationsRecords',
    component: () => import('@/pages/AdminNotifications/Records.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/notifier/channels',
    name: 'AdminNotificationsChannels',
    component: () => import('@/pages/AdminNotifications/Channels.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/notifier/settings',
    name: 'AdminNotificationsSettings',
    component: () => import('@/pages/AdminNotifications/Config.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/notifier/config',
    redirect: '/notifier/settings'
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/pages/NotFound.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'CatchAll',
    component: () => import('@/pages/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Always scroll to top on route change for better UX
    return { top: 0 }
  }
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  // If route requires authentication
  if (to.meta.requiresAuth) {
    // Fast check: if we have a token, allow navigation immediately
    const hasToken = !!localStorage.getItem('access_token')

    if (!hasToken) {
      next('/login')
      return
    }

    // Check if route requires admin access
    if (to.meta.requiresAdmin) {
      if (userStore.user) {
        if (!userStore.userInfo?.is_staff) {
          next('/dashboard')
          return
        }
      } else {
        try {
          const authSuccess = await userStore.checkAuth()
          if (!authSuccess) {
            next('/login')
            return
          }
          if (!userStore.userInfo?.is_staff) {
            next('/dashboard')
            return
          }
        } catch {
          next('/login')
          return
        }
      }
    }

    // If already authenticated (both token and user exist), proceed immediately
    if (userStore.isAuthenticated) {
      next()
      return
    }

    // We have a token but user state is not loaded yet
    // Allow navigation to proceed immediately, update user info in background
    next()

    // Update user info asynchronously without blocking navigation
    // Only check if user data is not already loaded to avoid duplicate calls
    if (!userStore.user) {
      userStore.checkAuth().catch(() => {
        // If check fails, clearAuthState is already called in checkAuth
        // API interceptor will handle 401 errors and redirect to login if needed
        // This allows current navigation to complete first
      })
    }
  } else if (to.meta.requiresGuest && userStore.isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
