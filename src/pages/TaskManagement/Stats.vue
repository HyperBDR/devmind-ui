<template>
  <AppLayout>
    <div class="w-full max-w-full">
      <!-- Page Header -->
      <div class="mb-4">
        <h1 class="text-lg font-semibold text-gray-900">
          {{ t('taskManagement.stats.title') }}
        </h1>
        <p class="mt-1 text-sm text-gray-500">
          {{ t('taskManagement.stats.subtitle') }}
        </p>
      </div>

      <div class="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
        <div class="p-6">
          <div class="flex flex-wrap items-center gap-3 mb-6">
            <span class="text-sm text-gray-600 whitespace-nowrap">{{ t('taskManagement.stats.granularity') }}</span>
            <div class="flex rounded-md border border-gray-300 overflow-hidden">
              <button
                v-for="opt in granularityOptions"
                :key="opt.value"
                type="button"
                :class="[
                  'px-2.5 py-1.5 text-sm font-medium border-r border-gray-300 last:border-r-0 transition-colors',
                  granularity === opt.value ? 'bg-primary-100 text-primary-700 border-primary-200' : 'bg-white text-gray-600 hover:bg-gray-50'
                ]"
                @click="selectGranularity(opt.value)"
              >
                {{ opt.label }}
              </button>
            </div>
            <template v-if="granularity === 'day'">
              <input
                v-model="selectedDate"
                type="date"
                class="rounded-md border border-gray-300 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                @change="fetchStats"
              />
            </template>
            <template v-else-if="granularity === 'month'">
              <input
                v-model="selectedMonth"
                type="month"
                class="rounded-md border border-gray-300 px-2.5 py-1.5 text-sm w-36 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                @change="fetchStats"
              />
            </template>
            <BaseButton
              variant="outline"
              size="sm"
              :loading="loading"
              :title="t('common.refresh')"
              class="flex items-center gap-1 shadow-sm hover:shadow-md transition-shadow ml-auto"
              @click="fetchStats"
            >
              <svg
                v-if="!loading"
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

          <BaseLoading v-if="loading && !stats" />

          <div
            v-else-if="!loading && !stats"
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
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <p class="text-sm font-medium text-gray-600">{{ t('taskManagement.stats.noData') }}</p>
          </div>

          <template v-else>
            <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
              <div class="rounded-lg border border-gray-200 bg-gray-50/50 p-4">
                <div class="text-sm text-gray-500">{{ t('taskManagement.stats.total') }}</div>
                <div class="text-2xl font-semibold text-gray-900">{{ stats.total ?? 0 }}</div>
              </div>
              <div class="rounded-lg border border-gray-200 bg-gray-50/50 p-4">
                <div class="text-sm text-gray-500">{{ t('taskManagement.stats.pending') }}</div>
                <div class="text-2xl font-semibold text-amber-600">{{ stats.pending ?? 0 }}</div>
              </div>
              <div class="rounded-lg border border-gray-200 bg-gray-50/50 p-4">
                <div class="text-sm text-gray-500">{{ t('taskManagement.stats.started') }}</div>
                <div class="text-2xl font-semibold text-blue-600">{{ stats.started ?? 0 }}</div>
              </div>
              <div class="rounded-lg border border-gray-200 bg-gray-50/50 p-4">
                <div class="text-sm text-gray-500">{{ t('taskManagement.stats.success') }}</div>
                <div class="text-2xl font-semibold text-green-600">{{ stats.success ?? 0 }}</div>
              </div>
              <div class="rounded-lg border border-gray-200 bg-gray-50/50 p-4">
                <div class="text-sm text-gray-500">{{ t('taskManagement.stats.failure') }}</div>
                <div class="text-2xl font-semibold text-red-600">{{ stats.failure ?? 0 }}</div>
              </div>
              <div class="rounded-lg border border-gray-200 bg-gray-50/50 p-4">
                <div class="text-sm text-gray-500">{{ t('taskManagement.stats.retry') }}</div>
                <div class="text-2xl font-semibold text-purple-600">{{ stats.retry ?? 0 }}</div>
              </div>
              <div class="rounded-lg border border-gray-200 bg-gray-50/50 p-4">
                <div class="text-sm text-gray-500">{{ t('taskManagement.stats.revoked') }}</div>
                <div class="text-2xl font-semibold text-gray-600">{{ stats.revoked ?? 0 }}</div>
              </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div class="bg-white rounded-lg border border-gray-200 p-4">
                <h3 class="text-sm font-semibold text-gray-900 mb-3">{{ t('taskManagement.stats.chartStatusDistribution') }}</h3>
                <div v-if="statusChartData && statusChartData.labels.length > 0" class="relative" style="min-height: 240px">
                  <Doughnut :data="statusChartData" :options="statusChartOptions" />
                </div>
                <p v-else class="text-sm text-gray-500 py-8 text-center">{{ t('taskManagement.stats.noData') }}</p>
              </div>
              <div class="bg-white rounded-lg border border-gray-200 p-4">
                <h3 class="text-sm font-semibold text-gray-900 mb-3">{{ t('taskManagement.stats.chartByModule') }}</h3>
                <div v-if="byModuleChartData && byModuleChartData.labels.length > 0" class="relative" style="min-height: 240px">
                  <Bar :data="byModuleChartData" :options="byModuleChartOptions" />
                </div>
                <p v-else class="text-sm text-gray-500 py-8 text-center">{{ t('taskManagement.stats.noData') }}</p>
              </div>
            </div>

            <div v-if="byTaskNameChartData && byTaskNameChartData.labels.length > 0" class="mb-8">
              <h3 class="text-sm font-semibold text-gray-900 mb-3">{{ t('taskManagement.stats.chartByTaskName') }}</h3>
              <div class="bg-white rounded-lg border border-gray-200 p-4">
                <div class="relative" style="min-height: 280px">
                  <Bar :data="byTaskNameChartData" :options="byTaskNameChartOptions" />
                </div>
              </div>
            </div>

            <div v-if="byModuleKeys.length > 0" class="mb-8">
              <h3 class="text-sm font-semibold text-gray-900 mb-3">{{ t('taskManagement.stats.byModule') }}</h3>
              <div class="overflow-x-auto relative rounded-lg border border-gray-200 bg-white shadow-sm">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                        {{ t('taskManagement.stats.moduleColumn') }}
                      </th>
                      <th class="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                        {{ t('taskManagement.stats.total') }}
                      </th>
                      <th class="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                        {{ t('taskManagement.stats.pending') }}
                      </th>
                      <th class="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                        {{ t('taskManagement.stats.started') }}
                      </th>
                      <th class="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                        {{ t('taskManagement.stats.success') }}
                      </th>
                      <th class="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                        {{ t('taskManagement.stats.failure') }}
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-100">
                    <tr
                      v-for="key in byModuleKeys"
                      :key="key"
                      class="transition-colors duration-150 hover:bg-gray-50"
                    >
                      <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{{ key || '-' }}</td>
                      <td class="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-600">{{ stats.by_module[key]?.total ?? 0 }}</td>
                      <td class="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-600">{{ stats.by_module[key]?.pending ?? 0 }}</td>
                      <td class="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-600">{{ stats.by_module[key]?.started ?? 0 }}</td>
                      <td class="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-600">{{ stats.by_module[key]?.success ?? 0 }}</td>
                      <td class="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-600">{{ stats.by_module[key]?.failure ?? 0 }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div v-if="byTaskNameKeys.length > 0">
              <h3 class="text-sm font-semibold text-gray-900 mb-3">{{ t('taskManagement.stats.byTaskName') }}</h3>
              <div class="overflow-x-auto relative rounded-lg border border-gray-200 bg-white shadow-sm">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                        {{ t('taskManagement.stats.taskColumn') }}
                      </th>
                      <th class="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                        {{ t('taskManagement.stats.total') }}
                      </th>
                      <th class="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                        {{ t('taskManagement.stats.pending') }}
                      </th>
                      <th class="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                        {{ t('taskManagement.stats.started') }}
                      </th>
                      <th class="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                        {{ t('taskManagement.stats.success') }}
                      </th>
                      <th class="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                        {{ t('taskManagement.stats.failure') }}
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-100">
                    <tr
                      v-for="key in byTaskNameKeys"
                      :key="key"
                      class="transition-colors duration-150 hover:bg-gray-50"
                    >
                      <td class="px-4 py-3 text-sm font-medium text-gray-900 break-all">{{ key || '-' }}</td>
                      <td class="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-600">{{ stats.by_task_name[key]?.total ?? 0 }}</td>
                      <td class="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-600">{{ stats.by_task_name[key]?.pending ?? 0 }}</td>
                      <td class="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-600">{{ stats.by_task_name[key]?.started ?? 0 }}</td>
                      <td class="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-600">{{ stats.by_task_name[key]?.success ?? 0 }}</td>
                      <td class="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-600">{{ stats.by_task_name[key]?.failure ?? 0 }}</td>
                    </tr>
                  </tbody>
                </table>
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
import { useToast } from '@/composables/useToast'
import { extractResponseData, extractErrorMessage } from '@/utils/api'
import { taskManagementApi } from '@/api/taskManagement'
import { Doughnut, Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import AppLayout from '@/components/layout/AppLayout.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseLoading from '@/components/ui/BaseLoading.vue'

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const { t } = useI18n()
const { showError } = useToast()

const loading = ref(false)
const stats = ref(null)
const granularity = ref('day')
const selectedDate = ref('')
const selectedMonth = ref('')

const granularityOptions = computed(() => [
  { value: 'day', label: t('taskManagement.stats.granularityDay') },
  { value: 'month', label: t('taskManagement.stats.granularityMonth') }
])

function setDefaultDates() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  selectedDate.value = `${y}-${m}-${d}`
  selectedMonth.value = `${y}-${m}`
}

function lastDayOfMonth(ym) {
  const [y, m] = ym.split('-').map(Number)
  const last = new Date(y, m, 0).getDate()
  return `${y}-${String(m).padStart(2, '0')}-${String(last).padStart(2, '0')}`
}

function selectGranularity(g) {
  granularity.value = g
  setDefaultDates()
  fetchStats()
}

const byModuleKeys = computed(() => {
  if (!stats.value?.by_module) return []
  return Object.keys(stats.value.by_module)
})

const byTaskNameKeys = computed(() => {
  if (!stats.value?.by_task_name) return []
  return Object.keys(stats.value.by_task_name)
})

const statusChartData = computed(() => {
  if (!stats.value) return null
  const s = stats.value
  const statusKeys = ['pending', 'started', 'success', 'failure', 'retry', 'revoked']
  const labels = statusKeys.map((k) => t(`taskManagement.stats.${k}`))
  const data = statusKeys.map((k) => s[k] ?? 0)
  if (data.every((v) => v === 0)) return null
  const colors = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6', '#6b7280']
  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors,
        borderColor: '#fff',
        borderWidth: 2
      }
    ]
  }
})

const statusChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'right', labels: { usePointStyle: true, padding: 8 } },
    tooltip: {
      callbacks: {
        label(ctx) {
          const total = ctx.dataset.data.reduce((a, b) => a + b, 0)
          const pct = total > 0 ? ((ctx.raw / total) * 100).toFixed(1) : 0
          return `${ctx.label}: ${ctx.raw} (${pct}%)`
        }
      }
    }
  }
}))

const byModuleChartData = computed(() => {
  if (!stats.value?.by_module || byModuleKeys.value.length === 0) return null
  const keys = byModuleKeys.value
  return {
    labels: keys.map((k) => k || '-'),
    datasets: [
      {
        label: t('taskManagement.stats.total'),
        data: keys.map((k) => stats.value.by_module[k]?.total ?? 0),
        backgroundColor: 'rgba(99, 102, 241, 0.7)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 1
      }
    ]
  }
})

const byModuleChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y',
  plugins: {
    legend: { display: false },
    tooltip: { callbacks: { label: (ctx) => `${t('taskManagement.stats.total')}: ${ctx.raw}` } }
  },
  scales: {
    x: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.06)' } },
    y: { grid: { display: false }, ticks: { maxRotation: 0 } }
  }
}))

const TOP_TASK_NAMES = 12
const byTaskNameChartData = computed(() => {
  if (!stats.value?.by_task_name || byTaskNameKeys.value.length === 0) return null
  const keys = byTaskNameKeys.value
    .map((k) => ({ k, total: stats.value.by_task_name[k]?.total ?? 0 }))
    .sort((a, b) => b.total - a.total)
    .slice(0, TOP_TASK_NAMES)
    .map((x) => x.k)
  if (keys.length === 0) return null
  return {
    labels: keys.map((k) => (k && k.length > 20 ? k.slice(0, 18) + '…' : k || '-')),
    datasets: [
      {
        label: t('taskManagement.stats.total'),
        data: keys.map((k) => stats.value.by_task_name[k]?.total ?? 0),
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1
      }
    ]
  }
})

const byTaskNameChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { callbacks: { label: (ctx) => `${t('taskManagement.stats.total')}: ${ctx.raw}` } }
  },
  scales: {
    x: { grid: { display: false }, ticks: { maxRotation: 45, minRotation: 0 } },
    y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.06)' } }
  }
}))

async function fetchStats() {
  loading.value = true
  try {
    const params = {}
    if (granularity.value === 'day' && selectedDate.value) {
      params.start_date = selectedDate.value
      params.end_date = selectedDate.value
    } else if (granularity.value === 'month' && selectedMonth.value) {
      params.start_date = `${selectedMonth.value}-01`
      params.end_date = lastDayOfMonth(selectedMonth.value)
    }
    const res = await taskManagementApi.getStats(params)
    stats.value = extractResponseData(res)
  } catch (e) {
    showError(extractErrorMessage(e, t('common.error')))
    stats.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  setDefaultDates()
  fetchStats()
})
</script>
