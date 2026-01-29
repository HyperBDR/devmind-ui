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
import { ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from '@/composables/useToast'
import { extractResponseData } from '@/utils/api'
import { cloudBillingApi } from '@/api/cloudBilling'
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

const canSave = computed(() => {
  return true
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

    const data = {
      provider: props.provider.id,
      is_active: formData.value.is_active,
      cost_threshold: costThreshold ? parseFloat(costThreshold) : null,
      growth_threshold: growthThreshold ? parseFloat(growthThreshold) : null,
      growth_amount_threshold: growthAmountThreshold ? parseFloat(growthAmountThreshold) : null,
    }

    if (props.alertRule) {
      await cloudBillingApi.updateAlertRule(props.alertRule.id, data)
      showSuccess(t('cloudBilling.settings.alertRule.updateSuccess'))
    } else {
      await cloudBillingApi.createAlertRule(data)
      showSuccess(t('cloudBilling.settings.alertRule.createSuccess'))
    }

    emit('saved')
  } catch (error) {
    console.error('Failed to save alert rule:', error)
    showError(t('cloudBilling.settings.alertRule.saveError'))
  } finally {
    saving.value = false
  }
}
</script>
