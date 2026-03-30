<template>
  <AdminLayout>
    <div class="w-full max-w-full p-6">
      <div class="mb-4 flex items-start justify-between gap-4">
        <div>
          <h1 class="text-lg font-semibold text-gray-900">
            {{ t('modelPricing.config.title') }}
          </h1>
          <p class="mt-1 text-sm text-gray-500">
            {{ t('modelPricing.config.subtitle') }}
          </p>
        </div>
        <BaseButton variant="primary" size="sm" @click="openCreateModal">
          {{ t('modelPricing.config.addPlatform') }}
        </BaseButton>
      </div>

      <div class="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div class="border-b border-gray-200 px-6 py-4">
          <h2 class="text-base font-semibold text-gray-900">
            {{ t('modelPricing.config.platformTableTitle') }}
          </h2>
          <p class="mt-1 text-sm text-gray-500">
            {{ t('modelPricing.config.platformTableDescription') }}
          </p>
        </div>

        <div class="p-6">
          <BaseLoading v-if="loading" />

          <div
            v-else-if="!configs.length"
            class="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 py-16 text-center"
          >
            <h3 class="text-base font-semibold text-gray-900">
              {{ t('modelPricing.config.emptyTitle') }}
            </h3>
            <p class="mt-2 text-sm text-gray-500">
              {{ t('modelPricing.config.emptyDescription') }}
            </p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="min-w-full table-auto divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    {{ t('modelPricing.config.platformSlug') }}
                  </th>
                  <th class="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    {{ t('modelPricing.config.vendorName') }}
                  </th>
                  <th class="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    {{ t('modelPricing.config.region') }}
                  </th>
                  <th class="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    {{ t('modelPricing.config.endpointUrl') }}
                  </th>
                  <th class="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    {{ t('modelPricing.config.pointsPerCurrencyUnit') }}
                  </th>
                  <th class="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    {{ t('modelPricing.config.enabledLabel') }}
                  </th>
                  <th class="whitespace-nowrap px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">
                    {{ t('modelPricing.config.actions') }}
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="item in configs" :key="item.id" class="hover:bg-gray-50">
                  <td class="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-900">
                    {{ item.platform_slug }}
                  </td>
                  <td class="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                    {{ item.vendor_name }}
                  </td>
                  <td class="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                    {{ item.region || t('modelPricing.config.regionEmpty') }}
                  </td>
                  <td class="max-w-[360px] px-4 py-4 text-sm text-gray-700">
                    <div class="truncate" :title="item.endpoint_url">{{ item.endpoint_url }}</div>
                  </td>
                  <td class="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                    {{ item.points_per_currency_unit }}
                  </td>
                  <td class="whitespace-nowrap px-4 py-4 text-sm">
                    <span
                      class="rounded-full px-2.5 py-1 text-xs font-medium"
                      :class="item.is_enabled
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-gray-100 text-gray-500'"
                    >
                      {{ item.is_enabled ? t('modelPricing.config.enabled') : t('modelPricing.config.disabled') }}
                    </span>
                  </td>
                  <td class="whitespace-nowrap px-4 py-4 text-right text-sm">
                    <BaseButton variant="outline" size="sm" @click="openEditModal(item)">
                      {{ t('modelPricing.config.edit') }}
                    </BaseButton>
                    <BaseButton
                      variant="primary"
                      size="sm"
                      class="ml-2"
                      :loading="syncingPlatformSlug === item.platform_slug"
                      @click="syncPlatform(item)"
                    >
                      {{ t('modelPricing.config.syncNow') }}
                    </BaseButton>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <BaseModal
        :show="showModal"
        :title="editingId ? t('modelPricing.config.editTitle') : t('modelPricing.config.createTitle')"
        @close="closeModal"
      >
        <form class="space-y-4" @submit.prevent="saveConfig">
          <p class="text-sm text-gray-500">
            {{ editingId
              ? t('modelPricing.config.editDescription')
              : t('modelPricing.config.createDescription') }}
          </p>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700">
                {{ t('modelPricing.config.platformSlug') }}
              </label>
              <input
                v-model.trim="form.platform_slug"
                type="text"
                :disabled="!!editingId"
                class="block w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500"
                :class="editingId
                  ? 'border-gray-200 bg-gray-50 text-gray-500'
                  : 'border-gray-300 bg-white text-gray-900'"
              />
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700">
                {{ t('modelPricing.config.vendorName') }}
              </label>
              <input
                v-model.trim="form.vendor_name"
                type="text"
                class="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700">
                {{ t('modelPricing.config.region') }}
              </label>
              <input
                v-model.trim="form.region"
                type="text"
                class="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700">
                {{ t('modelPricing.config.currency') }}
              </label>
              <input
                v-model.trim="form.currency"
                type="text"
                class="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700">
                {{ t('modelPricing.config.pointsPerCurrencyUnit') }}
              </label>
              <input
                v-model.number="form.points_per_currency_unit"
                type="number"
                min="0.0001"
                step="0.0001"
                class="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div class="flex items-end">
              <label class="inline-flex items-center gap-3 text-sm text-gray-700">
                <input
                  v-model="form.is_enabled"
                  type="checkbox"
                  class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span>{{ t('modelPricing.config.enabledLabel') }}</span>
              </label>
            </div>

            <div class="md:col-span-2">
              <label class="mb-1 block text-sm font-medium text-gray-700">
                {{ t('modelPricing.config.endpointUrl') }}
              </label>
              <input
                v-model.trim="form.endpoint_url"
                type="url"
                class="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div class="md:col-span-2">
              <label class="mb-1 block text-sm font-medium text-gray-700">
                {{ t('modelPricing.config.notes') }}
              </label>
              <textarea
                v-model="form.notes"
                rows="4"
                class="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          </div>
        </form>

        <template #footer>
          <BaseButton type="button" variant="outline" @click="closeModal">
            {{ t('modelPricing.config.cancel') }}
          </BaseButton>
          <BaseButton type="button" variant="primary" :loading="saving" @click="saveConfig">
            {{ t('modelPricing.config.save') }}
          </BaseButton>
        </template>
      </BaseModal>
    </div>
  </AdminLayout>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { modelPricingAdminApi } from '@/admin/api'
import AdminLayout from '@/admin/layout/AdminLayout.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseLoading from '@/components/ui/BaseLoading.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import { useToast } from '@/composables/useToast'
import { extractErrorMessage } from '@/utils/api'

const { t } = useI18n()
const { showError, showSuccess } = useToast()

const loading = ref(false)
const saving = ref(false)
const syncingPlatformSlug = ref('')
const showModal = ref(false)
const editingId = ref(null)
const configs = ref([])

const createEmptyForm = () => ({
  platform_slug: '',
  vendor_name: '',
  region: '',
  endpoint_url: '',
  currency: 'CNY',
  points_per_currency_unit: 10,
  is_enabled: true,
  notes: ''
})

const form = reactive(createEmptyForm())

function resetForm(data = null) {
  const next = { ...createEmptyForm(), ...(data || {}) }
  Object.keys(next).forEach((key) => {
    form[key] = next[key]
  })
}

async function loadConfigs() {
  loading.value = true
  try {
    const payload = await modelPricingAdminApi.listPrimarySourceConfigs()
    configs.value = Array.isArray(payload) ? payload : []
  } catch (error) {
    showError(extractErrorMessage(error, t('modelPricing.config.loadError')))
  } finally {
    loading.value = false
  }
}

function openCreateModal() {
  editingId.value = null
  resetForm()
  showModal.value = true
}

function openEditModal(item) {
  editingId.value = item.id
  resetForm(item)
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingId.value = null
  resetForm()
}

async function saveConfig() {
  saving.value = true
  try {
    const body = {
      platform_slug: form.platform_slug,
      vendor_name: form.vendor_name,
      region: form.region,
      endpoint_url: form.endpoint_url,
      currency: form.currency,
      points_per_currency_unit: form.points_per_currency_unit,
      is_enabled: form.is_enabled,
      notes: form.notes
    }
    if (editingId.value) {
      await modelPricingAdminApi.updatePrimarySourceConfig(editingId.value, body)
    } else {
      await modelPricingAdminApi.createPrimarySourceConfig(body)
    }
    await loadConfigs()
    closeModal()
    showSuccess(t('modelPricing.config.saveSuccess'))
  } catch (error) {
    showError(extractErrorMessage(error, t('modelPricing.config.saveError')))
  } finally {
    saving.value = false
  }
}

async function syncPlatform(item) {
  syncingPlatformSlug.value = item.platform_slug
  try {
    await modelPricingAdminApi.triggerPlatformSync(item.platform_slug)
    showSuccess(t('modelPricing.config.syncSuccess'))
  } catch (error) {
    showError(extractErrorMessage(error, t('modelPricing.config.syncError')))
  } finally {
    syncingPlatformSlug.value = ''
  }
}

onMounted(loadConfigs)
</script>
