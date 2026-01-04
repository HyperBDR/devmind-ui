<template>
  <!-- Mobile overlay -->
  <Transition
    enter-active-class="transition-opacity duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-150"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="showMobileMenu && isMobile"
      @click="$emit('close')"
      class="fixed inset-0 bg-gray-900 bg-opacity-50 z-40 lg:hidden"
    />
  </Transition>

  <!-- Sidebar -->
  <aside
    :class="[
      'bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out w-64 flex-shrink-0 h-full',
      isMobile
        ? 'fixed inset-y-0 left-0 z-50'
        : 'static',
      isMobile && !showMobileMenu ? '-translate-x-full' : 'translate-x-0'
    ]"
  >
    <!-- Logo and close button -->
    <div class="flex items-center justify-between h-16 px-4 border-b border-gray-200">
      <router-link
        to="/dashboard"
        class="flex items-center space-x-2 flex-1"
        @click="isMobile && $emit('close')"
      >
        <img
          src="/android-chrome-192x192.png"
          alt="DevMind Logo"
          class="w-8 h-8"
        />
        <span class="text-xl font-semibold text-gray-900">{{
          t('common.appName')
        }}</span>
      </router-link>
      <button
        v-if="isMobile"
        @click="$emit('close')"
        class="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      <router-link
        to="/dashboard"
        class="nav-item"
        :class="isActive('/dashboard') ? 'nav-item-active' : ''"
        @click="isMobile && $emit('close')"
        @mouseenter="preloadRoute('/dashboard')"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
        <span>{{ t('dashboard.title') }}</span>
      </router-link>

      <!-- Settings Menu with Submenu -->
      <div class="space-y-1">
        <button
          @click="toggleSettingsMenu"
          class="nav-item w-full"
          :class="isActive('/settings') ? 'nav-item-active' : ''"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span class="flex-1 text-left">{{ t('common.settings') }}</span>
          <svg
            class="w-4 h-4 transition-transform"
            :class="settingsMenuOpen ? 'rotate-90' : ''"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        <Transition
          enter-active-class="transition-all duration-200"
          enter-from-class="opacity-0 max-h-0"
          enter-to-class="opacity-100 max-h-96"
          leave-active-class="transition-all duration-200"
          leave-from-class="opacity-100 max-h-96"
          leave-to-class="opacity-0 max-h-0"
        >
          <div v-if="settingsMenuOpen" class="ml-4 space-y-1 border-l-2 border-gray-200 pl-3">
            <router-link
              to="/settings/profile"
              class="nav-sub-item"
              :class="isActive('/settings/profile') ? 'nav-sub-item-active' : ''"
              @click="isMobile && $emit('close')"
              @mouseenter="preloadRoute('/settings/profile')"
            >
              <span>{{ t('settings.profile.title') }}</span>
            </router-link>
            <router-link
              to="/settings/jira"
              class="nav-sub-item"
              :class="isActive('/settings/jira') ? 'nav-sub-item-active' : ''"
              @click="isMobile && $emit('close')"
              @mouseenter="preloadRoute('/settings/jira')"
            >
              <span>{{ t('settings.jira.title') }}</span>
            </router-link>
            <router-link
              to="/settings/gitlab"
              class="nav-sub-item"
              :class="isActive('/settings/gitlab') ? 'nav-sub-item-active' : ''"
              @click="isMobile && $emit('close')"
              @mouseenter="preloadRoute('/settings/gitlab')"
            >
              <span>{{ t('settings.gitlab.title') }}</span>
            </router-link>
            <router-link
              to="/settings/llm"
              class="nav-sub-item"
              :class="isActive('/settings/llm') ? 'nav-sub-item-active' : ''"
              @click="isMobile && $emit('close')"
              @mouseenter="preloadRoute('/settings/llm')"
            >
              <span>{{ t('settings.llm.title') }}</span>
            </router-link>
            <router-link
              to="/settings/feishu"
              class="nav-sub-item"
              :class="isActive('/settings/feishu') ? 'nav-sub-item-active' : ''"
              @click="isMobile && $emit('close')"
              @mouseenter="preloadRoute('/settings/feishu')"
            >
              <span>{{ t('settings.feishu.title') }}</span>
            </router-link>
            <router-link
              to="/settings/notifications"
              class="nav-sub-item"
              :class="isActive('/settings/notifications') ? 'nav-sub-item-active' : ''"
              @click="isMobile && $emit('close')"
              @mouseenter="preloadRoute('/settings/notifications')"
            >
              <span>{{ t('settings.notifications.title') }}</span>
            </router-link>
          </div>
        </Transition>
      </div>
    </nav>
  </aside>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/store/user'

const props = defineProps({
  showMobileMenu: {
    type: Boolean,
    default: false
  }
})

defineEmits(['close'])

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const settingsMenuOpen = ref(false)

const isAdmin = computed(() => {
  return userStore.userInfo?.is_staff === true
})

const isMobile = computed(() => {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 1024
})

const isActive = (path) => {
  if (path === '/dashboard') {
    return route.path === '/dashboard' || route.path === '/'
  }
  return route.path.startsWith(path)
}

const toggleSettingsMenu = () => {
  settingsMenuOpen.value = !settingsMenuOpen.value
}

// Auto-expand settings menu if current route is a settings page
watch(() => route.path, (newPath) => {
  if (newPath.startsWith('/settings')) {
    settingsMenuOpen.value = true
  }
}, { immediate: true })

const handleResize = () => {
  // Force reactivity update on resize
}

// Preload route component on link hover for faster navigation
// Use a cache to avoid duplicate preloads
const preloadCache = new Set()

const preloadRoute = (path) => {
  // Skip if already preloaded
  if (preloadCache.has(path)) {
    return
  }

  try {
    const route = router.resolve(path)
    if (route.matched.length > 0) {
      const matched = route.matched[0]
      // Preload the component if it's lazy-loaded
      if (matched.components) {
        Object.values(matched.components).forEach(component => {
          if (typeof component === 'function') {
            // Mark as preloading
            preloadCache.add(path)
            component().catch(() => {
              // Remove from cache on error so we can retry
              preloadCache.delete(path)
            })
          }
        })
      }
    }
  } catch (error) {
    // Ignore preload errors
    console.debug('Preload error for', path, error)
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.nav-item {
  @apply flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors;
}

.nav-item-active {
  @apply bg-primary-50 text-primary-600;
}

.nav-sub-item {
  @apply flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors;
}

.nav-sub-item-active {
  @apply bg-primary-50 text-primary-600;
}
</style>
