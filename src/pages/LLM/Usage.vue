<template>
  <AppLayout>
    <div class="w-full max-w-full p-6">
      <div class="mb-4">
        <h1 class="text-lg font-semibold text-gray-900">
          {{ t('llm.usage.title') }}
        </h1>
        <p class="mt-1 text-sm text-gray-500">
          {{ t('llm.usage.subtitle') }}
        </p>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div class="p-6">
          <div class="flex flex-wrap items-center gap-3 mb-6">
            <span class="text-sm text-gray-600 whitespace-nowrap">{{ t('llm.usage.filterByUser') }}</span>
            <select
              v-model="selectedUserId"
              class="rounded-md border border-gray-300 px-2.5 py-1.5 text-sm w-56 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              @change="onFiltersChanged"
            >
              <option value="">{{ t('llm.usage.allUsers') }}</option>
              <option v-for="u in userOptions" :key="u.id" :value="u.id">{{ u.label }}</option>
            </select>
            <input
              v-model="filters.model"
              type="text"
              :placeholder="t('llm.usage.filterModel')"
              class="rounded-md border border-gray-300 px-2.5 py-1.5 text-sm w-44 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              @input="onModelInput"
            />
            <select
              v-model="filters.success"
              class="rounded-md border border-gray-300 px-2.5 py-1.5 text-sm w-28 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white"
              @change="onFiltersChanged"
            >
              <option value="">{{ t('llm.usage.filterSuccess') }}</option>
              <option value="true">{{ t('common.yes') }}</option>
              <option value="false">{{ t('common.no') }}</option>
            </select>
            <span class="text-sm text-gray-600 whitespace-nowrap">{{ t('llm.usage.dateRange') }}</span>
            <input
              v-model="filters.startDate"
              type="date"
              class="rounded-md border border-gray-300 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
              @change="onFiltersChanged"
            />
            <span class="text-gray-400">–</span>
            <input
              v-model="filters.endDate"
              type="date"
              class="rounded-md border border-gray-300 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
              @change="onFiltersChanged"
            />
          </div>

          <BaseLoading v-if="loading && !items.length" />

          <div v-if="!loading && !items.length" class="py-16 text-center rounded-lg border border-gray-200 bg-gray-50">
            <p class="text-sm font-medium text-gray-600">{{ t('common.noData') }}</p>
          </div>

          <template v-if="!loading && items.length > 0">
            <div class="overflow-x-auto relative rounded-lg border border-gray-200 bg-white shadow-sm">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">{{ t('llm.usage.time') }}</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">{{ t('llm.usage.user') }}</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">{{ t('llm.usage.model') }}</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">{{ t('llm.usage.promptTokens') }}</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">{{ t('llm.usage.completionTokens') }}</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">{{ t('llm.usage.totalTokens') }}</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">{{ t('llm.usage.costUsd') }}</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">{{ t('llm.usage.success') }}</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">{{ t('llm.usage.error') }}</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-100">
                  <tr v-for="u in items" :key="u.id" class="hover:bg-gray-50 transition-colors duration-150">
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(u.created_at) }}</td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{{ u.username || u.user_id || '-' }}</td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ u.model || '-' }}</td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatNum(u.prompt_tokens) }}</td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatNum(u.completion_tokens) }}</td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatNum(u.total_tokens) }}</td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-amber-600 font-medium">{{ formatCost(u.cost, u.cost_currency) }}</td>
                    <td class="px-4 py-4 whitespace-nowrap">
                      <span
                        :class="u.success ? 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800' : 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'"
                      >
                        {{ u.success ? t('common.yes') : t('common.no') }}
                      </span>
                    </td>
                    <td class="px-4 py-4 text-sm text-red-600 max-w-xs truncate" :title="u.error">{{ u.error || '-' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div
              v-if="total > 0"
              class="mt-6 pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div class="text-sm text-gray-700 font-medium">
                {{ t('common.pagination.showing', { from: formatNum((page - 1) * pageSize + 1), to: formatNum(Math.min(page * pageSize, total)), total: formatNum(total) }) }}
              </div>
              <div class="flex items-center gap-3 flex-wrap">
                <label class="text-sm text-gray-600">{{ t('common.pagination.itemsPerPage') }}:</label>
                <select
                  v-model.number="pageSize"
                  class="rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  @change="page = 1; fetchList()"
                >
                  <option :value="10">10</option>
                  <option :value="20">20</option>
                  <option :value="50">50</option>
                  <option :value="100">100</option>
                </select>
                <BaseButton variant="outline" size="sm" :disabled="page <= 1" @click="goPrevPage">{{ t('common.pagination.previous') }}</BaseButton>
                <span class="text-sm text-gray-700 font-semibold px-3 py-1.5 bg-gray-50 rounded-md border border-gray-200">
                  {{ t('common.pagination.page', { current: page, total: totalPages }) }}
                </span>
                <BaseButton variant="outline" size="sm" :disabled="page >= totalPages" @click="goNextPage">{{ t('common.pagination.next') }}</BaseButton>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDebounce } from '@/composables/useDebounce'
import { formatNumLocale, formatCostLocale, formatDateIsoLocale } from '@/utils/formatting'
import { llmAdminApi } from '@/api/llmAdmin'
import AppLayout from '@/components/layout/AppLayout.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseLoading from '@/components/ui/BaseLoading.vue'

const { t, locale } = useI18n()

function formatNum(value) {
  return formatNumLocale(value, locale.value)
}

function formatCost(value, currency = 'USD') {
  return formatCostLocale(value, currency, locale.value)
}

function formatDate(iso) {
  return formatDateIsoLocale(iso, locale.value)
}

const items = ref([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(20)
const loading = ref(false)
const filters = reactive({ model: '', success: '', startDate: '', endDate: '' })
const userOptions = ref([])
const selectedUserId = ref('')

function toUserLabel(u) {
  const parts = []
  if (u.username) parts.push(u.username)
  if (u.email) parts.push(u.email)
  if (u.nickname) parts.push(u.nickname)
  if (parts.length === 0 && u.id) parts.push(String(u.id))
  return parts.join(' · ')
}

async function fetchUserOptions() {
  try {
    const data = await llmAdminApi.getUsers({ page_size: 200 })
    const list = Array.isArray(data)
      ? data
      : (Array.isArray(data?.results) ? data.results : [])
    userOptions.value = list.map((u) => ({ id: u.id, label: toUserLabel(u) }))
  } catch {
    userOptions.value = []
  }
}

function onFiltersChanged() {
  page.value = 1
  fetchList()
}

function applyModelFilter() {
  page.value = 1
  fetchList()
}

const { debouncedFn: onModelInput, cancel: cancelDebounce } = useDebounce(applyModelFilter, 300)

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))

function goPrevPage() {
  if (page.value <= 1) return
  page.value -= 1
  fetchList()
}

function goNextPage() {
  if (page.value >= totalPages.value) return
  page.value += 1
  fetchList()
}

async function fetchList() {
  loading.value = true
  try {
    const params = { page: page.value, page_size: pageSize.value }
    if (selectedUserId.value) params.user_id = selectedUserId.value
    if (filters.model) params.model = filters.model
    if (filters.success) params.success = filters.success
    if (filters.startDate) params.start_date = filters.startDate
    if (filters.endDate) params.end_date = filters.endDate
    const data = await llmAdminApi.getLLMUsage(params)
    items.value = data?.results ?? []
    total.value = data?.total ?? 0
  } catch (err) {
    console.error(err)
    items.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  filters.startDate = `${y}-${m}-01`
  filters.endDate = `${y}-${m}-${d}`
  fetchUserOptions()
  fetchList()
})

onUnmounted(() => {
  cancelDebounce()
})
</script>
