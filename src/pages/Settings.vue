<template>
  <AppLayout>
    <div class="max-w-5xl mx-auto space-y-4">
      <!-- Page Header -->
      <div class="mb-3">
        <h2 class="text-lg font-semibold text-gray-900">
          {{ t('settings.title') }}
        </h2>
      </div>

      <!-- Loading State -->
      <BaseLoading v-if="loading" full-page size="lg" variant="primary" />

      <!-- Content (hidden until loading completes) -->
      <template v-else>
        <!-- User Profile Section -->
        <UserProfileSection />

        <!-- Basic Information Card -->
        <BasicInfoCard />

        <!-- Google News Configuration Card -->
        <GoogleNewsConfigCard />

        <!-- GitHub Configuration Card -->
        <GithubConfigCard />

        <!-- Social OSS Configuration Card -->
        <SocialOssConfigCard
          :modelValue="socialOssConfig"
          @update:modelValue="handleSocialOssConfigUpdate"
        />

        <!-- Publish OSS Configuration Card -->
        <PublishOssConfigCard
          :modelValue="publishOssConfig"
          @update:modelValue="handlePublishOssConfigUpdate"
        />

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
import { reactive, ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/store/user'
import { settingsApi } from '@/api/settings'
import AppLayout from '@/components/layout/AppLayout.vue'
import BaseLoading from '@/components/ui/BaseLoading.vue'
import UserProfileSection from '@/components/settings/UserProfileSection.vue'
import BasicInfoCard from '@/components/settings/BasicInfoCard.vue'
import GoogleNewsConfigCard from '@/components/settings/GoogleNewsConfigCard.vue'
import GithubConfigCard from '@/components/settings/GithubConfigCard.vue'
import SocialOssConfigCard from '@/components/settings/SocialOssConfigCard.vue'
import PublishOssConfigCard from '@/components/settings/PublishOssConfigCard.vue'
import WebhookConfigCard from '@/components/settings/WebhookConfigCard.vue'

const { t } = useI18n()
const userStore = useUserStore()
const loading = ref(true)

const isAdmin = computed(() => {
  return userStore.userInfo?.is_staff === true
})

const socialOssConfig = reactive({
  enable: false,
  access_key_id: '',
  access_key_secret: '',
  bucket_name: '',
  endpoint: '',
  region: '',
  use_virtual_style: false
})

const publishOssConfig = reactive({
  use_same_as_storage: true,
  access_key_id: '',
  access_key_secret: '',
  bucket_name: '',
  endpoint: '',
  region: '',
  use_virtual_style: false
})

const webhookConfig = reactive({
  enable: false,
  url: '',
  provider: 'wechat',
  language: 'zh-hans'
})

const handleSocialOssConfigUpdate = (newValue) => {
  Object.assign(socialOssConfig, newValue)
}

const handlePublishOssConfigUpdate = (newValue) => {
  Object.assign(publishOssConfig, newValue)
}

const handleWebhookConfigUpdate = (newValue) => {
  Object.assign(webhookConfig, newValue)
}

const loadAllConfigs = async () => {
  loading.value = true
  try {
    // Ensure user data is loaded first
    if (!userStore.user) {
      await userStore.checkAuthStatus()
    }

    // Load all configurations in parallel
    // Note: GoogleNewsConfigCard loads its own data independently
    const [socialOssData, publishOssData, webhookData] = await Promise.allSettled([
      settingsApi.getSocialOssConfig().catch(() => null),
      settingsApi.getPublishOssConfig().catch(() => null),
      settingsApi.getWebhookConfig().catch(() => null)
    ])

    // Update social OSS config
    // Mark as loaded by ensuring all fields are set (even if empty)
    if (socialOssData.status === 'fulfilled' && socialOssData.value !== null) {
      Object.assign(socialOssConfig, {
        enable: socialOssData.value.enable ?? false,
        access_key_id: socialOssData.value.access_key_id || '',
        access_key_secret: socialOssData.value.access_key_secret || '',
        bucket_name: socialOssData.value.bucket_name || '',
        endpoint: socialOssData.value.endpoint || '',
        region: socialOssData.value.region || '',
        use_virtual_style: socialOssData.value.use_virtual_style || false,
        _loaded: true // Mark as loaded
      })
    }

    // Update publish OSS config
    if (publishOssData.status === 'fulfilled' && publishOssData.value !== null) {
      Object.assign(publishOssConfig, {
        use_same_as_storage: publishOssData.value.use_same_as_storage ?? true,
        access_key_id: publishOssData.value.access_key_id || '',
        access_key_secret: publishOssData.value.access_key_secret || '',
        bucket_name: publishOssData.value.bucket_name || '',
        endpoint: publishOssData.value.endpoint || '',
        region: publishOssData.value.region || '',
        use_virtual_style: publishOssData.value.use_virtual_style || false,
        _loaded: true // Mark as loaded
      })
    }

    // Update webhook config
    if (webhookData.status === 'fulfilled' && webhookData.value !== null) {
      Object.assign(webhookConfig, {
        enable: webhookData.value.enable ?? false,
        url: webhookData.value.url || '',
        provider: webhookData.value.provider || 'wechat',
        language: webhookData.value.language || 'zh-hans',
        _loaded: true // Mark as loaded
      })
    }
  } catch (error) {
    console.error('Failed to load settings:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadAllConfigs()
})
</script>
