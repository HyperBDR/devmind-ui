<template>
  <div class="bg-white rounded border border-gray-200 shadow-sm">
    <div class="px-4 py-3 border-b border-gray-200 bg-gray-50">
      <div class="flex items-center gap-2 text-gray-800">
        <svg
          class="w-4 h-4 flex-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
        <h3 class="text-sm font-semibold">
          {{ t('settings.webhookConfig') }}
        </h3>
      </div>
    </div>
    <div class="p-4">
      <p class="text-xs text-gray-600 mb-3">
        {{ t('settings.webhookConfigDesc') }}
      </p>
      <form @submit.prevent="handleSave" class="space-y-3">
        <!-- Enable Toggle -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
          <div class="md:col-span-1">
            <label
              for="webhookEnable"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              {{ t('settings.enableWebhook') }}
            </label>
            <p class="text-xs text-gray-500">
              {{ t('settings.enableWebhookDesc') }}
            </p>
          </div>
          <div class="md:col-span-2">
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="webhookEnable"
                v-model="config.enable"
                class="sr-only peer"
              />
              <div
                class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"
              ></div>
              <span class="ml-3 text-sm text-gray-700">
                {{ config.enable ? t('common.enabled') : t('common.disabled') }}
              </span>
            </label>
          </div>
        </div>

        <template v-if="config.enable">
          <!-- Provider -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
            <div class="md:col-span-1">
              <label
                for="webhookProvider"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                {{ t('settings.webhookProvider') }}
                <span class="text-red-500">*</span>
              </label>
              <p class="text-xs text-gray-500">
                {{ t('settings.webhookProviderDesc') }}
              </p>
            </div>
            <div class="md:col-span-2">
              <select
                id="webhookProvider"
                v-model="config.provider"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
              >
                <option value="wechat">{{ t('settings.webhookProviderWechat') }}</option>
                <option value="wecom">{{ t('settings.webhookProviderWecom') }}</option>
                <option value="feishu">{{ t('settings.webhookProviderFeishu') }}</option>
              </select>
            </div>
          </div>

          <!-- Webhook URL -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
            <div class="md:col-span-1">
              <label
                for="webhookUrl"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                {{ t('settings.webhookUrl') }}
                <span class="text-red-500">*</span>
              </label>
              <p class="text-xs text-gray-500">
                {{ t('settings.webhookUrlDesc') }}
              </p>
            </div>
            <div class="md:col-span-2">
              <BaseInput
                id="webhookUrl"
                v-model="config.url"
                type="text"
                :placeholder="t('settings.webhookUrlPlaceholder')"
                :class="{ 'border-red-300': validationErrors.includes('Webhook URL is required') }"
              />
            </div>
          </div>

          <!-- Language -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
            <div class="md:col-span-1">
              <label
                for="webhookLanguage"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                {{ t('settings.webhookLanguage') }}
              </label>
              <p class="text-xs text-gray-500">
                {{ t('settings.webhookLanguageDesc') }}
              </p>
            </div>
            <div class="md:col-span-2">
              <select
                id="webhookLanguage"
                v-model="config.language"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
              >
                <option value="zh-hans">{{ t('settings.webhookLanguageZhHans') }}</option>
                <option value="en">{{ t('settings.webhookLanguageEn') }}</option>
              </select>
            </div>
          </div>
        </template>

        <div v-if="validationErrors.length > 0" class="rounded-md bg-red-50 border border-red-200 p-3">
          <div class="flex gap-2">
            <div class="flex-shrink-0 pt-0.5">
              <svg
                class="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-sm font-semibold text-red-900 mb-2">
                {{ t('settings.webhookValidationFailed') }}
              </p>
              <div class="text-sm text-red-800 space-y-1.5">
                <div
                  v-for="(error, index) in validationErrors"
                  :key="index"
                  class="leading-relaxed"
                >
                  {{ error }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="successMessage" class="rounded-md bg-green-50 p-2.5">
          <div class="flex gap-2">
            <div class="flex-shrink-0 pt-0.5">
              <svg
                class="h-4 w-4 text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-xs font-medium text-green-800">
                {{ successMessage }}
              </p>
            </div>
          </div>
        </div>

        <div v-if="validationSuccess" class="rounded-md bg-green-50 p-2.5 mb-3">
          <div class="flex gap-2">
            <div class="flex-shrink-0 pt-0.5">
              <svg
                class="h-4 w-4 text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-xs font-medium text-green-800">
                {{ validationSuccess }}
              </p>
            </div>
          </div>
        </div>

        <div class="border-t border-gray-200 my-4"></div>

        <div class="flex justify-end gap-2">
          <BaseButton
            type="button"
            variant="secondary"
            class="w-full sm:w-auto"
            :loading="testing"
            :disabled="testing || saving || !config.url || !config.url.trim()"
            :title="!config.url || !config.url.trim() ? t('settings.pleaseFillRequiredFields') : ''"
            @click="handleTest"
          >
            {{ testing ? t('common.loading') : t('settings.validateConfig') }}
          </BaseButton>
          <BaseButton
            type="submit"
            variant="primary"
            class="w-full sm:w-auto"
            :loading="saving"
            :disabled="saving || testing || (config.enable && !isValidated)"
            :title="config.enable && !isValidated ? t('settings.pleaseValidateConfigFirst') : ''"
          >
            {{ saving ? t('common.saving') : t('common.save') }}
          </BaseButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { settingsApi } from '@/api/settings'

const { t } = useI18n()

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const config = reactive({
  enable: false,
  url: '',
  provider: 'wechat',
  language: 'zh-hans',
  ...props.modelValue
})

const saving = ref(false)
const testing = ref(false)
const validationErrors = ref([])
const successMessage = ref('')
const validationSuccess = ref('')
const isValidated = ref(false)

const loadConfig = async () => {
  // Skip loading if data is already provided via props
  // (parent component has already loaded the data)
  // Check for _loaded flag which indicates parent has loaded the data
  if (props.modelValue && props.modelValue._loaded) {
    return
  }

  try {
    const loadedConfig = await settingsApi.getWebhookConfig()
    Object.assign(config, {
      enable: loadedConfig.enable ?? false,
      url: loadedConfig.url || '',
      provider: loadedConfig.provider || 'wechat',
      language: loadedConfig.language || 'zh-hans'
    })
    isValidated.value = false
  } catch (error) {
    console.error('Failed to load Webhook config:', error)
  }
}

onMounted(() => {
  loadConfig()
})

watch(
  () => props.modelValue,
  (newValue) => {
    Object.assign(config, newValue)
  },
  { deep: true }
)

watch(
  () => [config.enable, config.url, config.provider, config.language],
  () => {
    if (config.enable) {
      isValidated.value = false
      validationSuccess.value = ''
      validationErrors.value = []
    }
  }
)

const handleTest = async () => {
  testing.value = true
  validationErrors.value = []
  validationSuccess.value = ''

  // Validate input before sending
  if (!config.url || !config.url.trim()) {
    validationErrors.value = [t('settings.webhookUrlRequiredForTest')]
    isValidated.value = false
    testing.value = false
    return
  }

  if (!config.provider) {
    validationErrors.value = [t('settings.webhookProviderRequired')]
    isValidated.value = false
    testing.value = false
    return
  }

  try {
    const requestData = {
      url: config.url.trim(),
      provider: config.provider
    }

    const response = await settingsApi.validateWebhookConfig(requestData)
    const validation = response.data || response

    if (!validation.valid) {
      const errors = validation.errors || [
        response.message || t('settings.webhookTestError')
      ]
      validationErrors.value = Array.isArray(errors) ? errors : [errors]
      isValidated.value = false
    } else {
      validationSuccess.value = t('settings.webhookTestSuccess')
      isValidated.value = true
      setTimeout(() => {
        validationSuccess.value = ''
      }, 3000)
    }
  } catch (error) {
    console.error('Failed to test Webhook config:', error)
    const errorData = error.response?.data
    if (errorData?.data?.errors) {
      const errors = errorData.data.errors
      validationErrors.value = Array.isArray(errors) ? errors : [errors]
    } else if (errorData?.message) {
      validationErrors.value = [errorData.message]
    } else if (errorData?.data?.message) {
      validationErrors.value = [errorData.data.message]
    } else {
      validationErrors.value = [
        error.message || t('settings.webhookTestError')
      ]
    }
    isValidated.value = false
  } finally {
    testing.value = false
  }
}

const handleSave = async () => {
  if (config.enable && !isValidated.value) {
    validationErrors.value = [
      t('settings.pleaseValidateConfigFirst')
    ]
    return
  }

  saving.value = true
  validationErrors.value = []
  successMessage.value = ''
  validationSuccess.value = ''

  try {
    // Remove _loaded flag before sending to API
    const { _loaded, ...configForApi } = config
    await settingsApi.updateWebhookConfig(configForApi)
    // Emit with _loaded flag to maintain state
    emit('update:modelValue', { ...configForApi, _loaded: true })
    successMessage.value = t('settings.webhookConfigSaved')
    isValidated.value = false
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (error) {
    console.error('Failed to save Webhook config:', error)
    const errorData = error.response?.data
    if (errorData?.data?.errors) {
      const errors = errorData.data.errors
      validationErrors.value = Array.isArray(errors) ? errors : [errors]
    } else {
      validationErrors.value = [
        errorData?.message || error.message || t('settings.webhookConfigError')
      ]
    }
    isValidated.value = false
  } finally {
    saving.value = false
  }
}
</script>
