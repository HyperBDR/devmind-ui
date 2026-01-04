<template>
  <AppLayout>
    <div class="max-w-5xl mx-auto space-y-4">
      <!-- Page Header -->
      <div class="mb-3">
        <h2 class="text-lg font-semibold text-gray-900">
          {{ t('settings.notifications.title') }}
        </h2>
        <p class="text-sm text-gray-600 mt-1">
          {{ t('settings.notifications.subtitle') }}
        </p>
      </div>

      <!-- Loading State -->
      <BaseLoading v-if="loading" full-page size="lg" variant="primary" />

      <!-- Content -->
      <template v-else>
        <!-- Webhook Configuration Card -->
        <WebhookConfigCard
          :modelValue="webhookConfig"
          @update:modelValue="handleWebhookConfigUpdate"
        />

        <!-- SMTP Configuration Card -->
        <SMTPConfigCard
          :modelValue="smtpConfig"
          @update:modelValue="handleSMTPConfigUpdate"
        />
      </template>
    </div>
  </AppLayout>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { settingsApi } from '@/api/settings'
import AppLayout from '@/components/layout/AppLayout.vue'
import BaseLoading from '@/components/ui/BaseLoading.vue'
import WebhookConfigCard from '@/components/settings/WebhookConfigCard.vue'
import SMTPConfigCard from '@/components/settings/SMTPConfigCard.vue'

const { t } = useI18n()
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

const smtpConfig = reactive({
  enable: false,
  host: '',
  port: 587,
  username: '',
  password: '',
  use_tls: true,
  use_ssl: false,
  from_email: '',
  from_name: ''
})

const handleWebhookConfigUpdate = (newValue) => {
  Object.assign(webhookConfig, newValue)
}

const handleSMTPConfigUpdate = (newValue) => {
  Object.assign(smtpConfig, newValue)
}

const loadConfigs = async () => {
  loading.value = true
  try {
    const [webhookData, smtpData] = await Promise.allSettled([
      settingsApi.getWebhookConfig().catch(() => null),
      settingsApi.getSMTPConfig().catch(() => null)
    ])

    if (webhookData.status === 'fulfilled' && webhookData.value !== null) {
      Object.assign(webhookConfig, {
        enable: webhookData.value.enable ?? false,
        url: webhookData.value.url || '',
        provider: webhookData.value.provider || 'wechat',
        language: webhookData.value.language || 'zh-hans',
        timeout: webhookData.value.timeout || 10,
        retries: webhookData.value.retries || 3,
        headers: webhookData.value.headers || {},
        events: webhookData.value.events || [],
        _loaded: true
      })
    }

    if (smtpData.status === 'fulfilled' && smtpData.value !== null) {
      Object.assign(smtpConfig, {
        enable: smtpData.value.enable ?? false,
        host: smtpData.value.host || '',
        port: smtpData.value.port || 587,
        username: smtpData.value.username || '',
        password: smtpData.value.password || '',
        use_tls: smtpData.value.use_tls ?? true,
        use_ssl: smtpData.value.use_ssl ?? false,
        from_email: smtpData.value.from_email || '',
        from_name: smtpData.value.from_name || '',
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
  await loadConfigs()
})
</script>
