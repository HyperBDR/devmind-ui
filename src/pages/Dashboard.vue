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
              class="w-16 h-16 mx-auto text-primary-500"
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
              :to="{ name: 'SettingsNotifications' }"
              class="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              {{ t('common.settings') }}
            </router-link>
          </div>
        </div>
      </div>

    </div>
  </AppLayout>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import AppLayout from '@/components/layout/AppLayout.vue'

const { t } = useI18n()
</script>
