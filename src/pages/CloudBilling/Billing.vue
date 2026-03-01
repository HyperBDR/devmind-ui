<template>
  <AppLayout>
    <div class="w-full max-w-full p-6">
      <div class="mb-4 flex items-center justify-between">
        <div>
          <h1 class="text-lg font-semibold text-gray-900">
            {{ t('cloudBilling.billing.title') }}
          </h1>
          <p class="mt-1 text-sm text-gray-500">
            {{ t('cloudBilling.billing.subtitle') }}
          </p>
        </div>
        <BaseButton
          variant="outline"
          size="sm"
          :loading="activeTab === 'statistics' ? statsLoading : detailsLoading"
          @click="handleRefresh"
          :title="t('common.refresh')"
          class="flex items-center gap-1 shadow-sm hover:shadow-md transition-shadow"
        >
          <svg
            v-if="!(activeTab === 'statistics' ? statsLoading : detailsLoading)"
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span class="sr-only">{{ t('common.refresh') }}</span>
        </BaseButton>
      </div>

      <div class="bg-white rounded border border-gray-200 shadow-sm">
        <div class="p-6">
          <!-- Tabs -->
          <div>
            <div class="border-b border-gray-200">
              <nav class="-mb-px flex space-x-4 overflow-x-auto">
                <button
                  v-for="tab in tabs"
                  :key="tab.id"
                  :class="[
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                    'whitespace-nowrap py-3 px-4 border-b-2 font-semibold text-sm transition-colors'
                  ]"
                  @click="activeTab = tab.id"
                >
                  {{ tab.label }}
                </button>
              </nav>
            </div>

            <div class="mt-6">
              <!-- Statistics Tab -->
              <div v-if="activeTab === 'statistics'">
                <!-- Statistics Filters -->
                <div class="mb-6 bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                  <div class="flex flex-wrap items-end gap-4">
                    <!-- Period Type Selection -->
                    <div class="flex-1 min-w-[140px]">
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        {{ t('cloudBilling.billing.periodType') }}:
                      </label>
                      <select
                        v-model="statsPeriodType"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="month">{{ t('cloudBilling.billing.byMonth') }}</option>
                        <option value="year">{{ t('cloudBilling.billing.byYear') }}</option>
                      </select>
                    </div>

                    <!-- Period Selection (Month or Year) -->
                    <div v-if="statsPeriodType === 'month'" class="flex-1 min-w-[180px]">
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        {{ t('cloudBilling.billing.month') }}:
                      </label>
                      <BaseMonthPicker
                        v-model="statsSelectedPeriod"
                        :placeholder="t('cloudBilling.billing.month')"
                      />
                    </div>
                    <div v-if="statsPeriodType === 'year'" class="flex-1 min-w-[140px]">
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        {{ t('cloudBilling.billing.year') }}:
                      </label>
                      <input
                        type="number"
                        v-model="statsSelectedYear"
                        :min="2020"
                        :max="2099"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <!-- Provider Filter -->
                    <div class="flex-1 min-w-[180px]">
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        {{ t('cloudBilling.billing.provider') }}
                      </label>
                      <select
                        v-model="statsProviderId"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        @change="statsAccountId = ''"
                      >
                        <option value="">{{ t('cloudBilling.billing.allProviders') }}</option>
                        <option
                          v-for="provider in providers"
                          :key="provider.id"
                          :value="provider.id"
                        >
                          {{ provider.display_name }}
                        </option>
                      </select>
                    </div>

                    <!-- Account ID Filter -->
                    <div class="flex-1 min-w-[180px]">
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        {{ t('cloudBilling.billing.accountId') }}
                      </label>
                      <select
                        v-model="statsAccountId"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        :disabled="!statsProviderId"
                      >
                        <option value="">{{ t('cloudBilling.billing.allAccounts') }}</option>
                        <option
                          v-for="account in availableAccounts"
                          :key="account"
                          :value="account"
                        >
                          {{ account || t('cloudBilling.billing.defaultAccount') }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>

                <!-- Statistics Content -->
                <BaseLoading v-if="statsLoading && !statistics" />

                <div v-if="!statsLoading && statistics" class="space-y-6">
                  <!-- Summary Cards and Pie Chart Row -->
                  <div v-if="statsPeriodType === 'month'" class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                    <!-- Left Column: Summary Cards -->
                    <div class="space-y-3 h-full flex flex-col">
                      <div class="bg-white border border-gray-200 rounded-lg p-4 flex-1 flex items-center gap-3">
                        <div class="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div class="flex-1 min-w-0">
                          <div class="text-xs font-medium text-gray-500 mb-1">
                            {{ t('cloudBilling.billing.totalCost') }}
                          </div>
                          <div class="text-xl font-bold text-gray-900">
                            {{ formatCost(statistics.total_cost, 'CNY') }}
                          </div>
                        </div>
                      </div>
                      <div class="bg-white border border-gray-200 rounded-lg p-4 flex-1 flex items-center gap-3">
                        <div class="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <div class="flex-1 min-w-0">
                          <div class="text-xs font-medium text-gray-500 mb-1">
                            {{ t('cloudBilling.billing.averageCost') }}
                          </div>
                          <div class="text-xl font-bold text-gray-900">
                            {{ formatCost(statistics.average_cost, 'CNY') }}
                          </div>
                        </div>
                      </div>
                      <div class="bg-white border border-gray-200 rounded-lg p-4 flex-1 flex items-center gap-3">
                        <div class="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div class="flex-1 min-w-0">
                          <div class="text-xs font-medium text-gray-500 mb-1">
                            {{ t('cloudBilling.billing.accountCount') }}
                          </div>
                          <div class="text-xl font-bold text-gray-900">
                            {{ accountCount }}
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- Right Column: Provider Cost Distribution Pie Chart -->
                    <div class="h-full">
                      <BillingPieChart
                        :statistics="statistics"
                      />
                    </div>
                  </div>

                  <!-- Summary Cards Only (for Year View) -->
                  <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="bg-white border border-gray-200 rounded-lg p-3 flex flex-col justify-center">
                      <div class="text-xs font-medium text-gray-500 mb-0.5">
                        {{ t('cloudBilling.billing.totalCost') }}
                      </div>
                      <div class="text-lg font-bold text-gray-900">
                        {{ formatCost(statistics.total_cost, 'CNY') }}
                      </div>
                    </div>
                    <div class="bg-white border border-gray-200 rounded-lg p-3 flex flex-col justify-center">
                      <div class="text-xs font-medium text-gray-500 mb-0.5">
                        {{ t('cloudBilling.billing.averageCost') }}
                      </div>
                      <div class="text-lg font-bold text-gray-900">
                        {{ formatCost(statistics.average_cost, 'CNY') }}
                      </div>
                    </div>
                    <div class="bg-white border border-gray-200 rounded-lg p-3 flex flex-col justify-center">
                      <div class="text-xs font-medium text-gray-500 mb-0.5">
                        {{ t('cloudBilling.billing.recordCount') }}
                      </div>
                      <div class="text-lg font-bold text-gray-900">
                        {{ statistics.count }}
                      </div>
                    </div>
                  </div>

                  <!-- Cost Chart (Full Width) -->
                  <BillingChart
                    :statistics="statistics"
                    :daily-data="dailyBillingData"
                    :period-type="statsPeriodType"
                    :selected-period="statsSelectedPeriod"
                    :selected-year="statsSelectedYear"
                    :providers="providers"
                  />

                  <!-- Daily Cost Breakdown Chart (Monthly View Only) -->
                  <BillingDailyCostChart
                    v-if="statsPeriodType === 'month'"
                    :daily-data="dailyBillingData"
                    :statistics="statistics"
                    :selected-period="statsSelectedPeriod"
                  />
                </div>

                <div v-if="!statsLoading && !statistics" class="py-16 text-center rounded-lg border border-gray-200 bg-gray-50">
                  <p class="text-sm font-medium text-gray-600">{{ t('cloudBilling.billing.noData') }}</p>
                </div>
              </div>

              <!-- Details Tab -->
              <div v-if="activeTab === 'details'">
                <!-- Details Filters -->
                <div class="mb-6 bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                  <div class="flex flex-wrap items-end gap-4">
                    <!-- Date Range -->
                    <div class="flex-1 min-w-[160px]">
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        {{ t('cloudBilling.billing.startDate') }}
                      </label>
                      <input
                        type="date"
                        v-model="detailsStartDate"
                        :max="detailsEndDate || undefined"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div class="flex-1 min-w-[160px]">
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        {{ t('cloudBilling.billing.endDate') }}
                      </label>
                      <input
                        type="date"
                        v-model="detailsEndDate"
                        :min="detailsStartDate || undefined"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <!-- Provider Filter -->
                    <div class="flex-1 min-w-[180px]">
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        {{ t('cloudBilling.billing.provider') }}
                      </label>
                      <select
                        v-model="detailsProviderId"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        @change="detailsAccountId = ''"
                      >
                        <option value="">{{ t('cloudBilling.billing.allProviders') }}</option>
                        <option
                          v-for="provider in providers"
                          :key="provider.id"
                          :value="provider.id"
                        >
                          {{ provider.display_name }}
                        </option>
                      </select>
                    </div>

                    <!-- Account ID Filter -->
                    <div class="flex-1 min-w-[180px]">
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        {{ t('cloudBilling.billing.accountId') }}
                      </label>
                      <select
                        v-model="detailsAccountId"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        :disabled="!detailsProviderId"
                      >
                        <option value="">{{ t('cloudBilling.billing.allAccounts') }}</option>
                        <option
                          v-for="account in availableDetailsAccounts"
                          :key="account"
                          :value="account"
                        >
                          {{ account || t('cloudBilling.billing.defaultAccount') }}
                        </option>
                      </select>
                    </div>

                    <!-- Search -->
                    <div class="flex-1 min-w-[200px]">
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        {{ t('common.search') }}
                      </label>
                      <BaseInput
                        v-model="searchQuery"
                        :placeholder="t('common.search')"
                        @update:modelValue="handleSearch"
                      >
                        <template #icon>
                          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </template>
                      </BaseInput>
                    </div>
                  </div>
                </div>

                <!-- Details Content -->
                <BaseLoading v-if="detailsLoading && billings.length === 0" />

                <div v-if="!detailsLoading && billings.length === 0" class="py-16 text-center rounded-lg border border-gray-200 bg-gray-50">
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
                  <p class="text-sm font-medium text-gray-600">{{ t('cloudBilling.billing.noData') }}</p>
                </div>

                <!-- Details Table -->
                <div v-if="!detailsLoading && billings.length > 0" class="overflow-x-auto rounded-lg border border-gray-200">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {{ t('cloudBilling.billing.provider') }}
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {{ t('cloudBilling.billing.accountId') }}
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {{ t('cloudBilling.billing.collectionTime') }}
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {{ t('cloudBilling.billing.cost') }}
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {{ t('cloudBilling.billing.changeFromLastHour') }}
                        </th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr
                        v-for="billing in billings"
                        :key="billing.id"
                        @click="handlePreview(billing)"
                        class="cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {{ billing.provider_display_name || billing.provider }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {{ billing.account_id || '-' }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {{ formatDate(billing.collection_time) }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {{ formatCost(billing.cost, billing.currency) }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm" :class="getChangeClass(billing.change_from_last_hour, 'text-gray-500', true)">
                          {{ formatChange(billing.change_from_last_hour) }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Billing Detail Panel -->
      <BillingDetailPanel
        :show="showPreviewModal"
        :billing="selectedBilling"
        @close="showPreviewModal = false"
      />
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { format, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns'
import { zhCN, enUS } from 'date-fns/locale'
import { useDebounce } from '@/composables/useDebounce'
import { extractResponseData } from '@/utils/api'
import { formatCost, formatChange, formatDate, getChangeClass } from '@/utils/formatting'
import { cloudBillingApi } from '@/api/cloudBilling'
import AppLayout from '@/components/layout/AppLayout.vue'
import BaseLoading from '@/components/ui/BaseLoading.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseMonthPicker from '@/components/ui/BaseMonthPicker.vue'
import BillingDetailPanel from '@/components/cloud-billing/BillingDetailPanel.vue'
import BillingChart from '@/components/cloud-billing/BillingChart.vue'
import BillingPieChart from '@/components/cloud-billing/BillingPieChart.vue'
import BillingDailyCostChart from '@/components/cloud-billing/BillingDailyCostChart.vue'

const { t, locale } = useI18n()

const dateFnsLocale = computed(() => {
  return locale.value === 'zh-CN' ? zhCN : enUS
})

// Calculate total account count from statistics
const accountCount = computed(() => {
  if (!statistics.value || !statistics.value.by_provider) {
    return 0
  }
  
  // Count unique provider+account_id combinations
  const accountSet = new Set()
  Object.values(statistics.value.by_provider).forEach(providerData => {
    const key = `${providerData.provider_id}_${providerData.account_id || ''}`
    accountSet.add(key)
  })
  
  return accountSet.size
})

// Available accounts for statistics filter (based on selected provider)
const availableAccounts = computed(() => {
  if (!statistics.value || !statistics.value.by_provider || !statsProviderId.value) {
    return []
  }
  
  const accounts = new Set()
  Object.values(statistics.value.by_provider).forEach(providerData => {
    if (providerData.provider_id === parseInt(statsProviderId.value)) {
      const accountId = providerData.account_id || ''
      accounts.add(accountId)
    }
  })
  
  return Array.from(accounts).sort()
})

// Available accounts for details filter (based on selected provider and loaded billings)
const availableDetailsAccounts = computed(() => {
  if (!detailsProviderId.value) {
    return []
  }
  
  const accounts = new Set()
  billings.value.forEach(billing => {
    const billingProviderId = billing.provider || billing.provider_id
    if (billingProviderId === parseInt(detailsProviderId.value)) {
      const accountId = billing.account_id || ''
      accounts.add(accountId)
    }
  })
  
  return Array.from(accounts).sort()
})

const activeTab = ref('statistics')
const tabs = [
  { id: 'statistics', label: t('cloudBilling.billing.statistics') },
  { id: 'details', label: t('cloudBilling.billing.details') }
]

// Statistics tab state
const statsLoading = ref(false)
const statistics = ref(null)
const dailyBillingData = ref([])
const statsPeriodType = ref('month')
const statsSelectedPeriod = ref('')
const statsSelectedYear = ref(new Date().getFullYear())
const statsProviderId = ref('')
const statsAccountId = ref('')
const providers = ref([])

// Details tab state
const detailsLoading = ref(false)
const billings = ref([])
const searchQuery = ref('')
const detailsStartDate = ref('')
const detailsEndDate = ref('')
const detailsProviderId = ref('')
const detailsAccountId = ref('')
const showPreviewModal = ref(false)
const selectedBilling = ref(null)

// Initialize date range: details tab default is last 3 days (from 3 days ago to today)
const initDateRange = () => {
  const now = new Date()
  
  // Initialize period for statistics (current month)
  statsSelectedPeriod.value = format(now, 'yyyy-MM')
  statsSelectedYear.value = now.getFullYear()
  
  const endStr = format(now, 'yyyy-MM-dd')
  const start = new Date(now)
  start.setDate(start.getDate() - 3)
  const startStr = format(start, 'yyyy-MM-dd')
  detailsEndDate.value = endStr
  detailsStartDate.value = startStr
}

// Load providers list
const loadProviders = async () => {
  try {
    const response = await cloudBillingApi.getProviders({ is_active: true })
    const data = extractResponseData(response)
    if (Array.isArray(data)) {
      providers.value = data
    } else if (data && data.results) {
      providers.value = data.results
    }
  } catch (error) {
    console.error('Failed to load providers:', error)
    providers.value = []
  }
}



// Load statistics
const loadStatistics = async () => {
  statsLoading.value = true
  try {
    const params = {}
    
    if (statsPeriodType.value === 'month' && statsSelectedPeriod.value) {
      params.start_period = statsSelectedPeriod.value
      params.end_period = statsSelectedPeriod.value
      
      // Load daily data for monthly view
      await loadDailyBillingData()
    } else if (statsPeriodType.value === 'year' && statsSelectedYear.value) {
      const year = statsSelectedYear.value
      const now = new Date()
      const currentYear = now.getFullYear()
      const currentMonth = now.getMonth() + 1
      
      params.start_period = `${year}-01`
      // Use current month as end_period to avoid backend grouping by year
      // This allows us to get monthly breakdown data
      if (year === currentYear) {
        params.end_period = `${year}-${String(currentMonth).padStart(2, '0')}`
      } else {
        // For past years, use December
        params.end_period = `${year}-12`
      }
      // Clear daily data for year view
      dailyBillingData.value = []
    }
    
    if (statsProviderId.value) {
      params.provider_id = statsProviderId.value
    }

    const response = await cloudBillingApi.getBillingStats(params)
    const data = extractResponseData(response)
    statistics.value = data
  } catch (error) {
    console.error('Failed to load statistics:', error)
    statistics.value = null
  } finally {
    statsLoading.value = false
  }
}

// Load daily billing data for chart
const loadDailyBillingData = async () => {
  if (!statsSelectedPeriod.value) return
  
  try {
    const [year, month] = statsSelectedPeriod.value.split('-')
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1)
    const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59)
    
    const params = {
      start_date: format(startDate, 'yyyy-MM-dd'),
      end_date: format(endDate, 'yyyy-MM-dd')
    }
    
    if (statsProviderId.value) {
      params.provider_id = statsProviderId.value
    }
    
    if (statsAccountId.value) {
      params.account_id = statsAccountId.value
    }
    
    const response = await cloudBillingApi.getBillingData(params)
    const data = extractResponseData(response)
    
    let billingList = []
    if (Array.isArray(data)) {
      billingList = data
    } else if (data && data.results) {
      billingList = data.results
    }
    
    dailyBillingData.value = billingList
  } catch (error) {
    console.error('Failed to load daily billing data:', error)
    dailyBillingData.value = []
  }
}

// Load billing details
const loadBillings = async (query = '') => {
  detailsLoading.value = true
  try {
    const params = {}
    
    if (query) {
      params.search = query
    }
    
    if (detailsStartDate.value) {
      params.start_date = detailsStartDate.value
    }
    
    if (detailsEndDate.value) {
      params.end_date = detailsEndDate.value
    }
    
    if (detailsProviderId.value) {
      params.provider_id = detailsProviderId.value
    }
    
    if (detailsAccountId.value) {
      params.account_id = detailsAccountId.value
    }

    const response = await cloudBillingApi.getBillingData(params)
    const data = extractResponseData(response)

    let billingList = []
    if (Array.isArray(data)) {
      billingList = data
    } else if (data && data.results) {
      billingList = data.results
    }

    // Map backend fields to frontend format and calculate changes
    const billingMap = new Map()
    billingList.forEach(billing => {
      const key = `${billing.provider}_${billing.period}_${billing.hour}_${billing.account_id || ''}`
      billingMap.set(key, billing)
    })

    // Calculate change from last hour for each billing record
    billings.value = billingList.map(billing => {
      const currentHour = billing.hour
      let prevHour = currentHour === 0 ? 23 : currentHour - 1
      let prevPeriod = billing.period

      // Handle cross-month case (hour 0 -> previous month hour 23)
      if (currentHour === 0) {
        const [year, month] = billing.period.split('-')
        const prevDate = new Date(parseInt(year), parseInt(month) - 2, 1)
        const prevYear = prevDate.getFullYear()
        const prevMonth = String(prevDate.getMonth() + 1).padStart(2, '0')
        prevPeriod = `${prevYear}-${prevMonth}`
      }

      const prevKey = `${billing.provider}_${prevPeriod}_${prevHour}_${billing.account_id || ''}`
      const prevBilling = billingMap.get(prevKey)

      let changeFromLastHour = null
      if (prevBilling && prevBilling.total_cost) {
        const currentCost = parseFloat(billing.total_cost) || 0
        const prevCost = parseFloat(prevBilling.total_cost) || 0
        if (prevCost > 0) {
          changeFromLastHour = ((currentCost - prevCost) / prevCost) * 100
        } else if (currentCost > 0) {
          changeFromLastHour = 100
        }
      }

      return {
        id: billing.id,
        provider: billing.provider,
        provider_display_name: billing.provider_name || billing.provider,
        collection_time: billing.collected_at,
        cost: billing.total_cost,
        currency: billing.currency,
        change_from_last_hour: changeFromLastHour,
        period: billing.period,
        hour: billing.hour,
        service_costs: billing.service_costs,
        account_id: billing.account_id
      }
    }).sort((a, b) => {
      return new Date(b.collection_time) - new Date(a.collection_time)
    })

    // Apply search filter
    if (query) {
      const lowerQuery = query.toLowerCase()
      billings.value = billings.value.filter(billing =>
        billing.provider_display_name.toLowerCase().includes(lowerQuery) ||
        (billing.account_id && billing.account_id.toLowerCase().includes(lowerQuery))
      )
    }
  } catch (error) {
    console.error('Failed to load billings:', error)
    billings.value = []
  } finally {
    detailsLoading.value = false
  }
}

const debouncedSearch = useDebounce((query) => {
  loadBillings(query)
}, 300)

const handleSearch = (query) => {
  searchQuery.value = query
  debouncedSearch(query)
}

const handleRefresh = () => {
  if (activeTab.value === 'statistics') {
    loadStatistics()
  } else {
    loadBillings(searchQuery.value)
  }
}

const handlePreview = (billing) => {
  selectedBilling.value = billing
  showPreviewModal.value = true
}

// Watch tab changes
watch(activeTab, (newTab) => {
  if (newTab === 'statistics') {
    loadStatistics()
  } else {
    loadBillings()
  }
})

// Watch statistics filter changes for real-time updates
watch([statsPeriodType, statsSelectedPeriod, statsSelectedYear, statsProviderId, statsAccountId], () => {
  if (activeTab.value === 'statistics') {
    loadStatistics()
  }
})

// Watch details filter changes
watch([detailsStartDate, detailsEndDate, detailsProviderId, detailsAccountId], () => {
  if (activeTab.value === 'details') {
    loadBillings(searchQuery.value)
  }
})

onMounted(() => {
  initDateRange()
  loadProviders()
  loadStatistics()
})
</script>
