<template>
  <AppLayout>
    <div class="w-full max-w-full p-6">
      <div class="mb-4">
        <h1 class="text-lg font-semibold text-gray-900">
          {{ t('notificationManagement.records.title') }}
        </h1>
        <p class="mt-1 text-sm text-gray-500">
          {{ t('notificationManagement.records.subtitle') }}
        </p>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div class="p-6">
          <div class="flex flex-wrap items-center gap-3 mb-6">
            <input
              v-model="filters.source_app"
              type="text"
              :placeholder="t('notificationManagement.records.sourceApp')"
              class="rounded-md border border-gray-300 px-2.5 py-1.5 text-sm w-40 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            <input
              v-model="filters.source_type"
              type="text"
              :placeholder="t('notificationManagement.records.sourceType')"
              class="rounded-md border border-gray-300 px-2.5 py-1.5 text-sm w-40 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            <select
              v-model="filters.status"
              class="rounded-md border border-gray-300 px-2.5 py-1.5 text-sm w-36 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="">{{ t('notificationManagement.records.statusAll') }}</option>
              <option value="success">{{ t('notificationManagement.records.statusSuccess') }}</option>
              <option value="failed">{{ t('notificationManagement.records.statusFailed') }}</option>
              <option value="merged">{{ t('notificationManagement.records.statusMerged') }}</option>
              <option value="silenced">{{ t('notificationManagement.records.statusSilenced') }}</option>
              <option value="pending">{{ t('notificationManagement.records.statusPending') }}</option>
            </select>
            <input
              v-model="filters.start_date"
              type="date"
              class="rounded-md border border-gray-300 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            <input
              v-model="filters.end_date"
              type="date"
              class="rounded-md border border-gray-300 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            <BaseButton
              variant="primary"
              size="sm"
              :loading="loading"
              class="flex items-center gap-1"
              @click="fetchRecords"
            >
              <svg v-if="!loading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {{ t('common.search') }}
            </BaseButton>
            <BaseButton
              variant="outline"
              size="sm"
              class="flex items-center gap-1"
              @click="resetFilters"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {{ t('notificationManagement.records.resetFilters') }}
            </BaseButton>
          </div>

          <BaseLoading v-if="loading && records.length === 0" />

          <div
            v-else-if="!loading && records.length === 0"
            class="py-16 text-center rounded-lg border border-gray-200 bg-gray-50"
          >
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p class="text-sm font-medium text-gray-600">{{ t('notificationManagement.records.noRecords') }}</p>
          </div>

          <template v-else>
            <div class="overflow-x-auto rounded-lg border border-gray-200">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">{{ t('notificationManagement.records.sourceApp') }}</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">{{ t('notificationManagement.records.sourceType') }}</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">{{ t('notificationManagement.records.sourceId') }}</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">{{ t('notificationManagement.records.provider') }}</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">{{ t('notificationManagement.records.status') }}</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">{{ t('notificationManagement.records.createdAt') }}</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">{{ t('notificationManagement.records.sentAt') }}</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">{{ t('notificationManagement.records.userId') }}</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-100">
                  <tr v-for="r in records" :key="r.uuid" class="hover:bg-gray-50">
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ r.source_app || '-' }}</td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ r.source_type || '-' }}</td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600 font-mono">{{ r.source_id || '-' }}</td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ r.provider_display_name || r.provider_type || '-' }}</td>
                    <td class="px-4 py-3 whitespace-nowrap">
                      <span :class="statusClass(r.status)">{{ r.status || '-' }}</span>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ formatDate(r.created_at) }}</td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ formatDate(r.sent_at) }}</td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ r.user_id ?? '-' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div
              v-if="total > pageSize"
              class="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-gray-200 pt-4"
            >
              <p class="text-sm text-gray-600">
                {{ t('common.pagination.showing', { from: (page - 1) * pageSize + 1, to: Math.min(page * pageSize, total), total }) }}
              </p>
              <div class="flex items-center gap-2">
                <select
                  v-model.number="pageSize"
                  class="rounded-md border border-gray-300 px-2 py-1 text-sm"
                  @change="page = 1; fetchRecords()"
                >
                  <option :value="10">10</option>
                  <option :value="20">20</option>
                  <option :value="50">50</option>
                  <option :value="100">100</option>
                </select>
                <span class="text-sm text-gray-500">{{ t('notificationManagement.records.pageSize') }}</span>
                <BaseButton
                  variant="outline"
                  size="sm"
                  :disabled="page <= 1"
                  :title="t('common.pagination.previous')"
                  class="flex items-center gap-1"
                  @click="page--; fetchRecords()"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  <span class="sr-only">{{ t('common.pagination.previous') }}</span>
                </BaseButton>
                <BaseButton
                  variant="outline"
                  size="sm"
                  :disabled="page >= totalPages"
                  :title="t('common.pagination.next')"
                  class="flex items-center gap-1"
                  @click="page++; fetchRecords()"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                  <span class="sr-only">{{ t('common.pagination.next') }}</span>
                </BaseButton>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { format } from 'date-fns'
import { notificationsAdminApi } from '@/api/notificationsAdmin'
import AppLayout from '@/components/layout/AppLayout.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseLoading from '@/components/ui/BaseLoading.vue'

const { t } = useI18n()

const loading = ref(false)
const records = ref([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(20)

const filters = ref({
  source_app: '',
  source_type: '',
  status: '',
  start_date: '',
  end_date: ''
})

const totalPages = computed(() => (total.value > 0 ? Math.ceil(total.value / pageSize.value) : 1))

function formatDate(val) {
  if (!val) return '-'
  try {
    return format(new Date(val), 'yyyy-MM-dd HH:mm')
  } catch {
    return String(val)
  }
}

function statusClass(status) {
  const s = (status || '').toLowerCase()
  const base = 'text-xs font-medium px-2 py-0.5 rounded'
  if (s === 'success') return `${base} bg-green-100 text-green-800`
  if (s === 'failed') return `${base} bg-red-100 text-red-800`
  if (s === 'pending') return `${base} bg-blue-100 text-blue-800`
  if (s === 'merged' || s === 'silenced') return `${base} bg-gray-100 text-gray-700`
  return `${base} bg-gray-100 text-gray-600`
}

function resetFilters() {
  filters.value = { source_app: '', source_type: '', status: '', start_date: '', end_date: '' }
  page.value = 1
  fetchRecords()
}

async function fetchRecords() {
  loading.value = true
  try {
    const params = { page: page.value, page_size: pageSize.value }
    if (filters.value.source_app) params.source_app = filters.value.source_app
    if (filters.value.source_type) params.source_type = filters.value.source_type
    if (filters.value.status) params.status = filters.value.status
    if (filters.value.start_date) params.start_date = filters.value.start_date
    if (filters.value.end_date) params.end_date = filters.value.end_date
    const data = await notificationsAdminApi.getRecords(params)
    records.value = data?.results ?? []
    total.value = data?.total ?? 0
  } catch {
    records.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchRecords()
})
</script>
