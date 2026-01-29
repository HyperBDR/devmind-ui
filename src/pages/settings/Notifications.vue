<template>
  <AppLayout>
    <div class="max-w-5xl mx-auto space-y-4">
      <!-- Page Header -->
      <div class="mb-3">
        <h2 class="text-lg font-semibold text-gray-900">
          {{ t('settings.notifications.title') }}
        </h2>
      </div>

      <!-- Loading State -->
      <BaseLoading v-if="loading" full-page size="lg" variant="primary" />

      <!-- Content -->
      <template v-else>
        <!-- Global Language & Timezone Card -->
        <GlobalLanguageTimezoneCard />

        <!-- Webhook Configuration Card -->
        <WebhookConfigCard
          :modelValue="webhookConfig"
          @update:modelValue="handleWebhookConfigUpdate"
        />
      </template>
    </div>
  </AppLayout>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/store/user'
import { settingsApi } from '@/api/settings'
import AppLayout from '@/components/layout/AppLayout.vue'
import BaseLoading from '@/components/ui/BaseLoading.vue'
import GlobalLanguageTimezoneCard from '@/components/settings/GlobalLanguageTimezoneCard.vue'
import WebhookConfigCard from '@/components/settings/WebhookConfigCard.vue'

const { t } = useI18n()
const userStore = useUserStore()
const loading = ref(true)

const webhookConfig = reactive({
  enable: false,
  url: '',
  provider: 'wechat',
  language: 'zh-hans',
  timeout: 10,
  retries: 3,
  headers: {},
  events: []
})

const handleWebhookConfigUpdate = (newValue) => {
  Object.assign(webhookConfig, newValue)
}

const loadConfigs = async () => {
  loading.value = true
  try {
    const webhookData = await settingsApi.getWebhookConfig().catch(() => null)

    if (webhookData !== null) {
      Object.assign(webhookConfig, {
        enable: webhookData.enable ?? false,
        url: webhookData.url || '',
        provider: webhookData.provider || 'wechat',
        language: webhookData.language || 'zh-hans',
        timeout: webhookData.timeout || 10,
        retries: webhookData.retries || 3,
        headers: webhookData.headers || {},
        events: webhookData.events || [],
        _loaded: true
      })
    }
  } catch (error) {
    console.error('Failed to load notification configs:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (!userStore.user) {
    await userStore.checkAuthStatus()
  }
  await loadConfigs()
})
</script>
