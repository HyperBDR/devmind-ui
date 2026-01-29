<template>
  <div class="p-6">
    <!-- Toolbar -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <!-- Batch Actions (Left) -->
      <div class="flex items-center gap-2 flex-wrap">
      </div>

      <!-- Search and Filter (Right) -->
      <div class="flex items-center gap-3 w-full sm:w-auto">
        <BaseButton
          @click="showCreateModal = true"
          size="sm"
          class="flex items-center gap-1.5"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          {{ t('cloudBilling.settings.providers.addProvider') }}
        </BaseButton>
      </div>
    </div>

    <!-- Loading State -->
    <BaseLoading v-if="loading" size="lg" variant="primary" />

    <!-- Providers Table -->
    <template v-else>
      <div v-if="providers.length === 0" class="py-16 text-center rounded-lg border border-gray-200 bg-gray-50">
        <svg
          class="mx-auto h-12 w-12 text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
        <p class="text-sm font-medium text-gray-600">{{ t('cloudBilling.settings.providers.noProviders') }}</p>
      </div>

      <template v-else>
        <!-- Desktop Table View -->
        <div class="hidden md:block overflow-x-auto relative rounded-lg border border-gray-200 bg-white shadow-sm">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200 w-1/4 min-w-[200px]">
                  {{ t('cloudBilling.providers.displayName') }}
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                  {{ t('cloudBilling.settings.providers.providerType') }}
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                  {{ t('cloudBilling.providers.status') }}
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                  {{ t('cloudBilling.settings.alertRule.title') }}
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                  {{ t('cloudBilling.providers.createdAt') }}
                </th>
                <th class="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                  {{ t('common.actions') }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100">
              <tr
                v-for="provider in providers"
                :key="provider.id"
                class="transition-colors duration-150 hover:bg-gray-50"
              >
                <td class="px-4 py-3">
                  <div class="min-w-[180px]">
                    <div class="text-sm font-medium text-gray-900 break-words">
                      {{ provider.display_name }}
                    </div>
                    <div v-if="provider.notes" class="text-xs text-gray-500 mt-1 truncate max-w-[300px]" :title="provider.notes">
                      {{ provider.notes }}
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {{ getProviderTypeLabel(provider.provider_type) }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      :checked="provider.is_active"
                      @change="toggleProvider(provider.id, $event.target.checked)"
                      class="sr-only peer"
                      :disabled="togglingIds.includes(provider.id)"
                    />
                    <div
                      class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"
                    ></div>
                  </label>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  <div v-if="getAlertRule(provider.id)" class="space-y-1">
                    <div v-if="getAlertRule(provider.id).cost_threshold" class="text-xs">
                      {{ t('cloudBilling.settings.alertRule.costThreshold') }}: {{ formatCurrency(getAlertRule(provider.id).cost_threshold) }}
                    </div>
                    <div v-if="getAlertRule(provider.id).growth_threshold" class="text-xs">
                      {{ t('cloudBilling.settings.alertRule.growthThreshold') }}: {{ getAlertRule(provider.id).growth_threshold }}%
                    </div>
                    <div v-if="getAlertRule(provider.id).growth_amount_threshold" class="text-xs">
                      {{ t('cloudBilling.settings.alertRule.growthAmountThreshold') }}: {{ formatCurrency(getAlertRule(provider.id).growth_amount_threshold) }}
                    </div>
                    <div v-if="!getAlertRule(provider.id).is_active" class="text-xs text-gray-400">
                      {{ t('common.disabled') }}
                    </div>
                  </div>
                  <span v-else class="text-xs text-gray-400">{{ t('cloudBilling.settings.alertRule.notConfigured') }}</span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(provider.created_at) }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end gap-2">
                    <button
                      @click="editAuthConfig(provider)"
                      class="text-primary-600 hover:text-primary-900 transition-colors"
                      :title="t('cloudBilling.providers.editAuthConfig')"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </button>
                    <button
                      @click="editAlertRule(provider)"
                      class="text-orange-600 hover:text-orange-900 transition-colors"
                      :title="t('cloudBilling.settings.alertRule.title')"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </button>
                    <button
                      @click="validateProvider(provider.id)"
                      class="text-green-600 hover:text-green-900 transition-colors"
                      :title="t('cloudBilling.providers.testConnection')"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                    <button
                      @click="deleteProvider(provider.id)"
                      class="text-red-600 hover:text-red-900 transition-colors"
                      :title="t('common.delete')"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Card View -->
        <div class="md:hidden space-y-3">
          <div
            v-for="provider in providers"
            :key="provider.id"
            class="bg-white rounded-lg border border-gray-200 shadow-sm p-4"
          >
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1">
                <h3 class="text-sm font-semibold text-gray-900 mb-1">
                  {{ provider.display_name }}
                </h3>
                <p v-if="provider.notes" class="text-xs text-gray-500 mt-1 truncate" :title="provider.notes">
                  {{ provider.notes }}
                </p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  :checked="provider.is_active"
                  @change="toggleProvider(provider.id, $event.target.checked)"
                  class="sr-only peer"
                  :disabled="togglingIds.includes(provider.id)"
                />
                <div
                  class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"
                ></div>
              </label>
            </div>
            <div class="space-y-2 text-sm text-gray-600">
              <div>
                <span class="font-medium">{{ t('cloudBilling.settings.providers.providerType') }}:</span>
                {{ getProviderTypeLabel(provider.provider_type) }}
              </div>
              <div v-if="getAlertRule(provider.id)">
                <span class="font-medium">{{ t('cloudBilling.settings.alertRule.title') }}:</span>
                <div class="ml-2 mt-1 space-y-1">
                  <div v-if="getAlertRule(provider.id).cost_threshold" class="text-xs">
                    {{ t('cloudBilling.settings.alertRule.costThreshold') }}: {{ formatCurrency(getAlertRule(provider.id).cost_threshold) }}
                  </div>
                  <div v-if="getAlertRule(provider.id).growth_threshold" class="text-xs">
                    {{ t('cloudBilling.settings.alertRule.growthThreshold') }}: {{ getAlertRule(provider.id).growth_threshold }}%
                  </div>
                  <div v-if="getAlertRule(provider.id).growth_amount_threshold" class="text-xs">
                    {{ t('cloudBilling.settings.alertRule.growthAmountThreshold') }}: {{ formatCurrency(getAlertRule(provider.id).growth_amount_threshold) }}
                  </div>
                  <div v-if="!getAlertRule(provider.id).is_active" class="text-xs text-gray-400">
                    {{ t('common.disabled') }}
                  </div>
                </div>
              </div>
              <div v-else class="text-xs text-gray-400">
                {{ t('cloudBilling.settings.alertRule.notConfigured') }}
              </div>
              <div>
                <span class="font-medium">{{ t('cloudBilling.providers.createdAt') }}:</span>
                {{ formatDate(provider.created_at) }}
              </div>
            </div>
            <div class="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-gray-200">
              <button
                @click="editAuthConfig(provider)"
                class="text-primary-600 hover:text-primary-900 text-sm font-medium"
              >
                {{ t('cloudBilling.providers.editAuthConfig') }}
              </button>
              <button
                @click="editAlertRule(provider)"
                class="text-orange-600 hover:text-orange-900 text-sm font-medium"
              >
                {{ t('cloudBilling.settings.alertRule.title') }}
              </button>
              <button
                @click="validateProvider(provider.id)"
                class="text-green-600 hover:text-green-900 text-sm font-medium"
              >
                {{ t('cloudBilling.providers.testConnection') }}
              </button>
              <button
                @click="deleteProvider(provider.id)"
                class="text-red-600 hover:text-red-900 text-sm font-medium"
              >
                {{ t('common.delete') }}
              </button>
            </div>
          </div>
        </div>
      </template>
    </template>

    <!-- Create/Edit Provider Modal -->
    <ProviderFormModal
      v-if="showCreateModal || editingProvider"
      :show="showCreateModal || !!editingProvider"
      :provider="editingProvider"
      :show-alert-rule="!editingProvider"
      @close="closeModal"
      @saved="handleSaved"
    />

    <!-- Alert Rule Modal -->
    <AlertRuleModal
      v-if="editingAlertRuleProvider"
      :show="!!editingAlertRuleProvider"
      :provider="editingAlertRuleProvider"
      :alert-rule="getAlertRule(editingAlertRuleProvider.id)"
      @close="editingAlertRuleProvider = null"
      @saved="handleAlertRuleSaved"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { format } from 'date-fns'
import { useToast } from '@/composables/useToast'
import { extractResponseData } from '@/utils/api'
import { cloudBillingApi } from '@/api/cloudBilling'
import BaseLoading from '@/components/ui/BaseLoading.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import ProviderFormModal from '@/components/cloud-billing/ProviderFormModal.vue'
import AlertRuleModal from '@/components/cloud-billing/AlertRuleModal.vue'

const { t } = useI18n()
const { showToast } = useToast()

const loading = ref(true)
const providers = ref([])
const alertRules = ref([])
const showCreateModal = ref(false)
const editingProvider = ref(null)
const editingAlertRuleProvider = ref(null)
const togglingIds = ref([])

const providerTypes = {
  aws: t('cloudBilling.providers.types.aws'),
  huawei: t('cloudBilling.providers.types.huawei'),
  alibaba: t('cloudBilling.providers.types.alibaba'),
  azure: t('cloudBilling.providers.types.azure'),
}

const getProviderTypeLabel = (type) => {
  return providerTypes[type] || type
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return format(new Date(dateString), 'yyyy-MM-dd HH:mm')
}

const formatCurrency = (value) => {
  if (!value) return '-'
  return `¥${Number(value).toFixed(2)}`
}

const getAlertRule = (providerId) => {
  return alertRules.value.find(rule => rule.provider === providerId)
}

const loadProviders = async () => {
  loading.value = true
  try {
    const [providersResponse, alertRulesResponse] = await Promise.all([
      cloudBillingApi.getProviders(),
      cloudBillingApi.getAlertRules().catch(() => ({ data: { results: [] } }))
    ])
    
    const providersData = extractResponseData(providersResponse)
    const alertRulesData = extractResponseData(alertRulesResponse)
    
    if (Array.isArray(providersData)) {
      providers.value = providersData
    } else if (providersData && providersData.results && Array.isArray(providersData.results)) {
      providers.value = providersData.results
    } else if (providersData && providersData.list && Array.isArray(providersData.list)) {
      providers.value = providersData.list
    } else {
      providers.value = []
    }

    if (Array.isArray(alertRulesData)) {
      alertRules.value = alertRulesData
    } else if (alertRulesData && alertRulesData.results && Array.isArray(alertRulesData.results)) {
      alertRules.value = alertRulesData.results
    } else if (alertRulesData && alertRulesData.list && Array.isArray(alertRulesData.list)) {
      alertRules.value = alertRulesData.list
    } else {
      alertRules.value = []
    }
  } catch (error) {
    console.error('Failed to load providers:', error)
    providers.value = []
    alertRules.value = []
  } finally {
    loading.value = false
  }
}

const toggleProvider = async (id, enabled) => {
  togglingIds.value.push(id)
  try {
    await cloudBillingApi.patchProvider(id, { is_active: enabled })
    const provider = providers.value.find(p => p.id === id)
    if (provider) {
      provider.is_active = enabled
    }
    showToast(
      enabled ? t('cloudBilling.providers.enableSuccess') : t('cloudBilling.providers.disableSuccess'),
      'success'
    )
  } catch (error) {
    console.error('Failed to toggle provider:', error)
    showToast(t('cloudBilling.providers.toggleError'), 'error')
    const provider = providers.value.find(p => p.id === id)
    if (provider) {
      provider.is_active = !enabled
    }
  } finally {
    togglingIds.value = togglingIds.value.filter(pid => pid !== id)
  }
}

const editAuthConfig = (provider) => {
  editingProvider.value = provider
}

const editAlertRule = (provider) => {
  editingAlertRuleProvider.value = provider
}

const closeModal = () => {
  showCreateModal.value = false
  editingProvider.value = null
}

const handleAlertRuleSaved = () => {
  editingAlertRuleProvider.value = null
  loadProviders()
}

const handleSaved = () => {
  closeModal()
  loadProviders()
}

const validateProvider = async (id) => {
  try {
    const response = await cloudBillingApi.validateProvider(id)
    const data = extractResponseData(response)
    if (data?.valid) {
      showToast(t('cloudBilling.providers.validationSuccess'), 'success')
    } else {
      showToast(t('cloudBilling.providers.validationFailed') + ': ' + (data?.message || ''), 'error')
    }
  } catch (error) {
    console.error('Failed to validate provider:', error)
    showToast(t('cloudBilling.providers.validationError'), 'error')
  }
}

const deleteProvider = async (id) => {
  if (!confirm(t('cloudBilling.providers.confirmDelete'))) {
    return
  }

  try {
    await cloudBillingApi.deleteProvider(id)
    showToast(t('cloudBilling.providers.deleteSuccess'), 'success')
    loadProviders()
  } catch (error) {
    console.error('Failed to delete provider:', error)
    showToast(t('cloudBilling.providers.deleteError'), 'error')
  }
}

onMounted(() => {
  loadProviders()
})
</script>
