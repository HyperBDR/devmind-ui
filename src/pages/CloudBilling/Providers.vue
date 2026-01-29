<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto space-y-4">
      <!-- Page Header -->
      <div class="mb-3 flex items-center justify-between">
        <div>
          <h2 class="text-lg font-semibold text-gray-900">
            {{ t('cloudBilling.providers.title') }}
          </h2>
          <p class="text-sm text-gray-600 mt-1">
            {{ t('cloudBilling.providers.subtitle') }}
          </p>
        </div>
        <button
          @click="showCreateModal = true"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {{ t('cloudBilling.providers.createProvider') }}
        </button>
      </div>

      <!-- Loading State -->
      <BaseLoading v-if="loading" full-page size="lg" variant="primary" />

      <!-- Content -->
      <template v-else>
        <!-- Providers List -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ t('cloudBilling.providers.name') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ t('cloudBilling.providers.type') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ t('cloudBilling.providers.displayName') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ t('cloudBilling.providers.status') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ t('cloudBilling.providers.createdAt') }}
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ t('common.actions') }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="provider in providers" :key="provider.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ provider.name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ getProviderTypeLabel(provider.provider_type) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ provider.display_name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="provider.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  >
                    {{ provider.is_active ? t('common.active') : t('common.inactive') }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(provider.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    @click="editProvider(provider)"
                    class="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    {{ t('common.edit') }}
                  </button>
                  <button
                    @click="validateProvider(provider.id)"
                    class="text-green-600 hover:text-green-900 mr-4"
                  >
                    {{ t('cloudBilling.providers.testConnection') }}
                  </button>
                  <button
                    @click="deleteProvider(provider.id)"
                    class="text-red-600 hover:text-red-900"
                  >
                    {{ t('common.delete') }}
                  </button>
                </td>
              </tr>
              <tr v-if="providers.length === 0">
                <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
                  {{ t('cloudBilling.providers.noProviders') }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </div>

    <!-- Create/Edit Modal -->
    <ProviderFormModal
      v-if="showCreateModal || editingProvider"
      :show="showCreateModal || !!editingProvider"
      :provider="editingProvider"
      @close="closeModal"
      @saved="handleSaved"
    />
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { cloudBillingApi } from '@/api/cloudBilling'
import AppLayout from '@/components/layout/AppLayout.vue'
import BaseLoading from '@/components/ui/BaseLoading.vue'
import ProviderFormModal from '@/components/cloud-billing/ProviderFormModal.vue'
import { format } from 'date-fns'

const { t } = useI18n()
const loading = ref(true)
const providers = ref([])
const showCreateModal = ref(false)
const editingProvider = ref(null)

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

const loadProviders = async () => {
  loading.value = true
  try {
    const response = await cloudBillingApi.getProviders()
    providers.value = response.data?.list || response.data || []
  } catch (error) {
    console.error('Failed to load providers:', error)
  } finally {
    loading.value = false
  }
}

const editProvider = (provider) => {
  editingProvider.value = provider
}

const closeModal = () => {
  showCreateModal.value = false
  editingProvider.value = null
}

const handleSaved = () => {
  closeModal()
  loadProviders()
}

const validateProvider = async (id) => {
  try {
    const response = await cloudBillingApi.validateProvider(id)
    if (response.data?.valid) {
      alert(t('cloudBilling.providers.validationSuccess'))
    } else {
      alert(t('cloudBilling.providers.validationFailed') + ': ' + (response.data?.message || ''))
    }
  } catch (error) {
    console.error('Failed to validate provider:', error)
    alert(t('cloudBilling.providers.validationError'))
  }
}

const deleteProvider = async (id) => {
  if (!confirm(t('cloudBilling.providers.confirmDelete'))) {
    return
  }

  try {
    await cloudBillingApi.deleteProvider(id)
    loadProviders()
  } catch (error) {
    console.error('Failed to delete provider:', error)
    alert(t('cloudBilling.providers.deleteError'))
  }
}

onMounted(() => {
  loadProviders()
})
</script>
