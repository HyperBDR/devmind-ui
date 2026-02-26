<template>
  <BaseModal
    :show="show"
    :title="t('cloudBilling.settings.alertRule.title')"
    @close="$emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <p class="text-xs text-gray-600 mb-4">
        {{ t('cloudBilling.settings.alertRule.subtitle', { provider: providerName }) }}
      </p>

      <!-- Enable Alert Rule -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
        <div class="md:col-span-1">
          <label
            for="isActive"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            {{ t('cloudBilling.settings.alertRule.enable') }}
          </label>
          <p class="text-xs text-gray-500 mb-2 md:mb-0">
            {{ t('cloudBilling.settings.alertRule.enableDesc') }}
          </p>
        </div>
        <div class="md:col-span-2">
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              id="isActive"
              v-model="formData.is_active"
              type="checkbox"
              class="sr-only peer"
            />
            <div
              class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"
            ></div>
            <span class="ml-3 text-sm text-gray-700">
              {{ formData.is_active ? t('common.enabled') : t('common.disabled') }}
            </span>
          </label>
        </div>
      </div>

      <!-- Alert Notification Channel (only when alert is enabled) -->
      <div
        v-if="formData.is_active"
        class="space-y-3 border-b border-gray-200 pb-4"
      >
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
          <div class="md:col-span-1">
            <label
              for="alertChannelUuid"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              {{ t('cloudBilling.providers.alertChannelLabel') }}
            </label>
            <p class="text-xs text-gray-500 mb-2 md:mb-0">
              {{ t('cloudBilling.providers.alertChannelDesc') }}
            </p>
          </div>
          <div class="md:col-span-2">
            <select
              id="alertChannelUuid"
              v-model="selectedChannelValue"
              required
              class="block w-full px-3 py-2 text-sm border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="" disabled>
                {{ t('cloudBilling.providers.alertChannelPlaceholder') }}
              </option>
              <option
                v-for="ch in allChannels"
                :key="`${ch.channel_type}:${ch.uuid}`"
                :value="`${ch.channel_type}:${ch.uuid}`"
              >
                {{ getChannelOptionLabel(ch) }}
              </option>
            </select>
            <p
              v-if="allChannels.length === 0"
              class="text-xs text-gray-500 mt-1"
            >
              {{ t('cloudBilling.providers.alertChannelEmptyHint') }}
            </p>
          </div>
        </div>
        <div
          v-if="isEmailChannelSelected"
          class="grid grid-cols-1 md:grid-cols-3 gap-3 items-start"
        >
          <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ t('cloudBilling.providers.alertEmailRecipients') }}
            </label>
            <p class="text-xs text-gray-500 mb-2 md:mb-0">
              {{ t('cloudBilling.providers.alertEmailRecipientsDesc3') }}
            </p>
          </div>
          <div class="md:col-span-2 space-y-2">
            <BaseInput
              v-for="i in 3"
              :key="i"
              v-model="emailToRecipients[i - 1]"
              type="email"
              :placeholder="t('cloudBilling.providers.alertEmailRecipientsPlaceholder')"
              class="w-full"
            />
          </div>
        </div>
      </div>

      <template v-if="formData.is_active">
        <!-- Cost Threshold -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
          <div class="md:col-span-1">
            <label
              for="costThreshold"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              {{ t('cloudBilling.settings.alertRule.costThreshold') }}
            </label>
            <p class="text-xs text-gray-500 mb-2 md:mb-0">
              {{ t('cloudBilling.settings.alertRule.costThresholdDesc') }}
            </p>
          </div>
          <div class="md:col-span-2">
            <BaseInput
              id="costThreshold"
              v-model="formData.cost_threshold"
              type="number"
              step="0.01"
              min="0"
              :placeholder="t('cloudBilling.settings.alertRule.costThresholdPlaceholder')"
              class="w-full"
            />
          </div>
        </div>

        <!-- Growth Threshold -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
          <div class="md:col-span-1">
            <label
              for="growthThreshold"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              {{ t('cloudBilling.settings.alertRule.growthThreshold') }}
            </label>
            <p class="text-xs text-gray-500 mb-2 md:mb-0">
              {{ t('cloudBilling.settings.alertRule.growthThresholdDesc') }}
            </p>
          </div>
          <div class="md:col-span-2">
            <BaseInput
              id="growthThreshold"
              v-model="formData.growth_threshold"
              type="number"
              step="0.01"
              min="0"
              max="100"
              :placeholder="t('cloudBilling.settings.alertRule.growthThresholdPlaceholder')"
              class="w-full"
            />
            <p class="text-xs text-gray-500 mt-1">
              {{ t('cloudBilling.settings.alertRule.growthThresholdNote') }}
            </p>
          </div>
        </div>

        <!-- Growth Amount Threshold -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
          <div class="md:col-span-1">
            <label
              for="growthAmountThreshold"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              {{ t('cloudBilling.settings.alertRule.growthAmountThreshold') }}
            </label>
            <p class="text-xs text-gray-500 mb-2 md:mb-0">
              {{ t('cloudBilling.settings.alertRule.growthAmountThresholdDesc') }}
            </p>
          </div>
          <div class="md:col-span-2">
            <BaseInput
              id="growthAmountThreshold"
              v-model="formData.growth_amount_threshold"
              type="number"
              step="0.01"
              min="0"
              :placeholder="t('cloudBilling.settings.alertRule.growthAmountThresholdPlaceholder')"
              class="w-full"
            />
          </div>
        </div>

        <div class="rounded-md bg-blue-50 p-3 border border-blue-200">
          <p class="text-xs text-blue-800">
            {{ t('cloudBilling.settings.alertRule.note') }}
          </p>
        </div>
      </template>
    </form>

    <template #footer>
      <div class="flex flex-col-reverse sm:flex-row justify-end gap-3">
        <BaseButton
          variant="outline"
          @click="$emit('close')"
          class="w-full sm:w-auto"
        >
          {{ t('common.cancel') }}
        </BaseButton>
        <BaseButton
          :loading="saving"
          @click="handleSubmit"
          :disabled="!canSave"
          class="w-full sm:w-auto"
        >
          {{ saving ? t('common.saving') : t('common.save') }}
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from '@/composables/useToast'
import { extractResponseData } from '@/utils/api'
import { cloudBillingApi } from '@/api/cloudBilling'
import { notificationsAdminApi } from '@/api/notificationsAdmin'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  provider: {
    type: Object,
    default: null
  },
  alertRule: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'saved'])

const { t } = useI18n()
const { showSuccess, showError } = useToast()
const saving = ref(false)

const providerName = computed(() => props.provider?.display_name || '')

const formData = ref({
  is_active: true,
  cost_threshold: null,
  growth_threshold: null,
  growth_amount_threshold: null,
})

const allChannels = ref([])
const selectedChannelValue = ref('')
const emailToRecipients = ref(['', '', ''])

const canSave = computed(() => {
  return true
})

const isEmailChannelSelected = computed(() =>
  (selectedChannelValue.value || '').startsWith('email:')
)

function getChannelOptionLabel(ch) {
  const name = (ch.name || '').trim() || t('cloudBilling.providers.channelUnnamed')
  const typeLabel = ch.channel_type === 'email'
    ? t('cloudBilling.providers.channelTypeEmail')
    : t('cloudBilling.providers.channelTypeWebhook')
  const cfg = ch.config || {}
  if (ch.channel_type === 'email') {
    const host = (cfg.smtp_host || '').trim()
    const hint = host ? ` · ${host}` : ''
    return `${name} (${typeLabel})${hint}`
  }
  const provider = (cfg.provider || cfg.provider_type || 'webhook').toLowerCase()
  const url = (cfg.url || '').trim()
  const urlHint = url ? (url.length > 40 ? url.slice(0, 37) + '...' : url) : ''
  if (urlHint) {
    return `${name} (${typeLabel} · ${provider}) · ${urlHint}`
  }
  return `${name} (${typeLabel} · ${provider})`
}

async function loadChannels() {
  try {
    const [webhookRes, emailRes] = await Promise.all([
      notificationsAdminApi.getChannels({ channel_type: 'webhook' }),
      notificationsAdminApi.getChannels({ channel_type: 'email' }),
    ])
    const webhookList = (webhookRes?.results ?? []).filter((ch) => ch.is_active !== false)
    const emailList = (emailRes?.results ?? []).filter((ch) => ch.is_active !== false)
    allChannels.value = [...webhookList, ...emailList]
  } catch (err) {
    console.error('Failed to load channels:', err)
    allChannels.value = []
  }
}

watch(() => props.show, async (visible) => {
  if (visible) {
    loadChannels()
    if (props.provider?.id) {
      try {
        const res = await cloudBillingApi.getProvider(props.provider.id)
        const full = extractResponseData(res)
        const notification = full?.config?.notification
        if (notification?.type && notification?.channel_uuid) {
          selectedChannelValue.value = `${notification.type}:${notification.channel_uuid}`
          const to = notification.email_to
          if (Array.isArray(to) && to.length) {
            emailToRecipients.value = [
              (to[0] || '').trim(),
              (to[1] || '').trim(),
              (to[2] || '').trim(),
            ]
          } else {
            emailToRecipients.value = ['', '', '']
          }
        } else {
          selectedChannelValue.value = ''
          emailToRecipients.value = ['', '', '']
        }
      } catch (e) {
        selectedChannelValue.value = ''
        emailToRecipients.value = ['', '', '']
      }
    } else {
      selectedChannelValue.value = ''
      emailToRecipients.value = ['', '', '']
    }
  }
})
onMounted(() => {
  if (props.show) {
    loadChannels()
  }
})

watch(() => props.alertRule, (newRule) => {
  if (newRule) {
    formData.value = {
      is_active: newRule.is_active ?? true,
      cost_threshold: newRule.cost_threshold ? String(newRule.cost_threshold) : null,
      growth_threshold: newRule.growth_threshold ? String(newRule.growth_threshold) : null,
      growth_amount_threshold: newRule.growth_amount_threshold ? String(newRule.growth_amount_threshold) : null,
    }
  } else {
    formData.value = {
      is_active: true,
      cost_threshold: null,
      growth_threshold: null,
      growth_amount_threshold: null,
    }
  }
}, { immediate: true })

const handleSubmit = async () => {
  // Check if any threshold has a value (handle both null and empty string)
  const costThreshold = formData.value.cost_threshold && String(formData.value.cost_threshold).trim()
  const growthThreshold = formData.value.growth_threshold && String(formData.value.growth_threshold).trim()
  const growthAmountThreshold = formData.value.growth_amount_threshold && String(formData.value.growth_amount_threshold).trim()
  const hasAnyThreshold = !!(costThreshold || growthThreshold || growthAmountThreshold)

  saving.value = true
  try {
    // If all thresholds are empty and rule exists, delete it
    if (!hasAnyThreshold && props.alertRule) {
      await cloudBillingApi.deleteAlertRule(props.alertRule.id)
      showSuccess(t('cloudBilling.settings.alertRule.deleteSuccess'))
      emit('saved')
      return
    }

    // If all thresholds are empty and no rule exists, cannot create
    if (!hasAnyThreshold && !props.alertRule) {
      showError(t('cloudBilling.settings.alertRule.atLeastOneThreshold'))
      saving.value = false
      return
    }

    if (formData.value.is_active && !(selectedChannelValue.value || '').trim()) {
      showError(t('cloudBilling.providers.alertChannelRequired'))
      saving.value = false
      return
    }

    if (isEmailChannelSelected.value) {
      const list = (emailToRecipients.value || [])
        .map((s) => (s || '').trim())
        .filter(Boolean)
      if (list.length === 0) {
        showError(t('cloudBilling.providers.alertEmailRecipientsRequired'))
        saving.value = false
        return
      }
      const invalid = list.find((e) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))
      if (invalid) {
        showError(t('cloudBilling.providers.alertEmailRecipientsInvalid', { email: invalid }))
        saving.value = false
        return
      }
    }

    const data = {
      provider: props.provider.id,
      is_active: formData.value.is_active,
      cost_threshold: costThreshold ? parseFloat(costThreshold) : null,
      growth_threshold: growthThreshold ? parseFloat(growthThreshold) : null,
      growth_amount_threshold: growthAmountThreshold ? parseFloat(growthAmountThreshold) : null,
    }

    const successMessage = props.alertRule
      ? t('cloudBilling.settings.alertRule.updateSuccess')
      : t('cloudBilling.settings.alertRule.createSuccess')
    if (props.alertRule) {
      await cloudBillingApi.updateAlertRule(props.alertRule.id, data)
    } else {
      await cloudBillingApi.createAlertRule(data)
    }

    const providerRes = await cloudBillingApi.getProvider(props.provider.id)
    const fullProvider = extractResponseData(providerRes)
    const providerConfig = { ...(fullProvider?.config || {}) }
    const raw = (selectedChannelValue.value || '').trim()
    if (raw) {
      const colonIndex = raw.indexOf(':')
      const notifType = colonIndex >= 0 ? raw.slice(0, colonIndex) : 'webhook'
      const notifUuid = colonIndex >= 0 ? raw.slice(colonIndex + 1) : raw
      providerConfig.notification = {
        type: notifType,
        channel_uuid: notifUuid,
      }
      if (notifType === 'email') {
        const list = (emailToRecipients.value || [])
          .map((s) => (s || '').trim())
          .filter(Boolean)
        if (list.length) {
          providerConfig.notification.email_to = list
        }
      }
    } else {
      delete providerConfig.notification
    }
    await cloudBillingApi.patchProvider(props.provider.id, { config: providerConfig })

    showSuccess(successMessage)
    emit('saved')
  } catch (error) {
    console.error('Failed to save alert rule:', error)
    showError(t('cloudBilling.settings.alertRule.saveError'))
  } finally {
    saving.value = false
  }
}
</script>
