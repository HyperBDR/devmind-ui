<template>
  <BaseModal
    :show="show"
    :title="t('cloudBilling.providers.editNotes')"
    @close="$emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="space-y-2">
        <p class="text-sm text-gray-600">
          {{ t('cloudBilling.providers.editNotesDesc', { name: provider?.display_name || '' }) }}
        </p>
        <label
          for="providerNotes"
          class="block text-sm font-medium text-gray-700"
        >
          {{ t('cloudBilling.providers.notes') }}
        </label>
        <textarea
          id="providerNotes"
          v-model="formData.notes"
          rows="4"
          :placeholder="t('cloudBilling.providers.notesPlaceholder')"
          class="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
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
          class="w-full sm:w-auto"
        >
          {{ saving ? t('common.saving') : t('common.save') }}
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from '@/composables/useToast'
import { extractResponseData } from '@/utils/api'
import { cloudBillingApi } from '@/api/cloudBilling'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  provider: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close', 'saved'])

const { t } = useI18n()
const { showSuccess, showError } = useToast()

const saving = ref(false)
const formData = reactive({
  notes: '',
})

watch(
  () => props.provider,
  (provider) => {
    formData.notes = provider?.notes || ''
  },
  { immediate: true },
)

const handleSubmit = async () => {
  if (!props.provider || saving.value) return

  saving.value = true
  try {
    await cloudBillingApi.patchProvider(props.provider.id, {
      notes: formData.notes,
    })
    showSuccess(t('cloudBilling.providers.notesUpdateSuccess'))
    emit('saved')
  } catch (error) {
    console.error('Failed to update provider notes:', error)
    const responseData = extractResponseData(error?.response || error)
    showError(responseData?.detail || t('cloudBilling.providers.notesUpdateError'))
  } finally {
    saving.value = false
  }
}
</script>
