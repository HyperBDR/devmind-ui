<template>
  <AppLayout>
    <div class="w-full max-w-full">
      <!-- Page Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">
          {{ t('dashboard.title') }}
        </h1>
        <p class="mt-2 text-sm text-gray-600">
          {{ t('dashboard.welcome') }}
        </p>
      </div>

      <!-- Welcome Card -->
      <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-8 mb-6">
        <div class="text-center">
          <div class="mb-4">
            <svg
              class="w-16 h-16 mx-auto text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-gray-900 mb-2">
            {{ t('dashboard.welcomeTitle') }}
          </h2>
          <p class="text-gray-600 mb-4">
            {{ t('dashboard.welcomeMessage') }}
          </p>
          <div class="mt-6 flex justify-center gap-4">
            <router-link
              to="/settings"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {{ t('common.settings') }}
            </router-link>
          </div>
        </div>
      </div>

      <!-- User Info Card -->
      <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          {{ t('dashboard.userInfo') }}
        </h3>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">{{ t('dashboard.username') }}:</span>
            <span class="text-sm font-medium text-gray-900">{{ userStore.userInfo?.username || '-' }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">{{ t('dashboard.email') }}:</span>
            <span class="text-sm font-medium text-gray-900">{{ userStore.userInfo?.email || '-' }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">{{ t('dashboard.isStaff') }}:</span>
            <span class="text-sm font-medium text-gray-900">
              {{ userStore.userInfo?.is_staff ? t('common.yes') : t('common.no') }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useUserStore } from '@/store/user'

const { t } = useI18n()
const userStore = useUserStore()
</script>
