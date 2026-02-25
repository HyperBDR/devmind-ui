<template>
  <AppLayout>
    <div class="w-full max-w-full">
      <div class="mb-4">
        <h1 class="text-lg font-semibold text-gray-900">
          {{ t('settings.notifications.title') }}
        </h1>
        <p class="mt-1 text-sm text-gray-500">
          {{ t('settings.notifications.subtitle') }}
        </p>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div class="p-6">
          <BaseLoading v-if="loading" />
          <template v-else>
            <div class="space-y-6">
              <GlobalLanguageTimezoneCard />
            </div>
          </template>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/store/user'
import AppLayout from '@/components/layout/AppLayout.vue'
import BaseLoading from '@/components/ui/BaseLoading.vue'
import GlobalLanguageTimezoneCard from '@/components/settings/GlobalLanguageTimezoneCard.vue'

const { t } = useI18n()
const userStore = useUserStore()
const loading = ref(true)

onMounted(async () => {
  loading.value = true
  try {
    if (!userStore.user) {
      await userStore.checkAuthStatus()
    }
  } finally {
    loading.value = false
  }
})
</script>
