<template>
  <AdminLayout>
    <div class="w-full max-w-full p-6">
      <div class="mb-4">
        <h1 class="text-lg font-semibold text-gray-900">
          {{ t('llm.stats.title') }}
        </h1>
        <p class="mt-1 text-sm text-gray-500">
          {{ t('llm.stats.subtitle') }}
        </p>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div class="p-6">
          <div class="flex flex-wrap items-center gap-3 mb-6">
            <span class="text-sm text-gray-600 whitespace-nowrap">{{ t('llm.stats.filterByUser') }}</span>
            <select
              v-model="selectedUserId"
              class="rounded-md border border-gray-300 px-2.5 py-1.5 text-sm w-56 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              @change="fetchStats"
            >
              <option value="">{{ t('llm.stats.allUsers') }}</option>
              <option v-for="u in userOptions" :key="u.id" :value="u.id">
                {{ u.label }}
              </option>
            </select>
            <span class="text-sm text-gray-600 whitespace-nowrap ml-1">{{ t('llm.stats.granularity') }}</span>
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
            <template v-else-if="granularity === 'year'">
              <select
                v-model.number="selectedYear"
                class="rounded-md border border-gray-300 px-2.5 py-1.5 text-sm w-28 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                @change="fetchStats"
              >
                <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}</option>
              </select>
            </template>
          </div>

          <BaseLoading v-if="loading && !statsData" />

          <div
            v-if="!loading && !statsData"
            class="py-16 text-center rounded-lg border border-gray-200 bg-gray-50"
          >
            <p class="text-sm font-medium text-gray-600">{{ t('llm.stats.noData') }}</p>
          </div>

          <template v-else-if="statsData">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 mb-6">
              <div class="rounded-lg border border-gray-200 bg-gray-50/50 p-4">
                <div class="text-sm text-gray-500">{{ t('llm.stats.totalTokens') }}</div>
                <div class="text-2xl font-semibold text-primary-600">{{ formatNum(statsData.summary?.total_tokens) }}</div>
              </div>
              <div class="rounded-lg border border-gray-200 bg-gray-50/50 p-4">
                <div class="text-sm text-gray-500">{{ t('llm.stats.totalCalls') }}</div>
                <div class="text-2xl font-semibold text-green-600">{{ formatNum(statsData.summary?.total_calls) }}</div>
              </div>
              <div class="rounded-lg border border-gray-200 bg-gray-50/50 p-4">
                <div class="text-sm text-gray-500">{{ t('llm.stats.totalCostUsd') }}</div>
                <div class="text-2xl font-semibold text-amber-600">{{ formatCost(statsData.summary?.total_cost, statsData.summary?.total_cost_currency) }}</div>
              </div>
              <div class="rounded-lg border border-gray-200 bg-gray-50/50 p-4">
                <div class="text-sm text-gray-500">{{ t('llm.stats.promptTokens') }}</div>
                <div class="text-2xl font-semibold text-purple-600">{{ formatNum(statsData.summary?.total_prompt_tokens) }}</div>
              </div>
              <div class="rounded-lg border border-gray-200 bg-gray-50/50 p-4">
                <div class="text-sm text-gray-500">{{ t('llm.stats.completionTokens') }}</div>
                <div class="text-2xl font-semibold text-orange-600">{{ formatNum(statsData.summary?.total_completion_tokens) }}</div>
              </div>
              <div class="rounded-lg border border-gray-200 bg-gray-50/50 p-4">
                <div class="text-sm text-gray-500">{{ t('llm.stats.cachedTokens') }}</div>
                <div class="text-2xl font-semibold text-cyan-600">{{ formatNum(statsData.summary?.total_cached_tokens) }}</div>
              </div>
              <div class="rounded-lg border border-gray-200 bg-gray-50/50 p-4">
                <div class="text-sm text-gray-500">{{ t('llm.stats.reasoningTokens') }}</div>
                <div class="text-2xl font-semibold text-teal-600">{{ formatNum(statsData.summary?.total_reasoning_tokens) }}</div>
              </div>
            </div>

            <div v-if="seriesItems.length" class="mb-6">
              <h3 class="text-sm font-semibold text-gray-700 mb-3">
                {{ t('llm.stats.chartTitle') }} — {{ chartSubtitle }}
              </h3>
              <div class="h-64 sm:h-80 rounded-lg border border-gray-200 bg-white p-4">
                <Bar :data="chartData" :options="chartOptions" />
              </div>
            </div>

            <div v-if="byModel.length" class="mb-6">
              <h3 class="text-sm font-semibold text-gray-700 mb-2">{{ t('llm.stats.byModel') }}</h3>
              <div class="overflow-x-auto rounded-lg border border-gray-200">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">{{ t('llm.stats.model') }}</th>
                      <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">{{ t('llm.stats.totalTokens') }}</th>
                      <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">{{ t('llm.stats.totalCostUsd') }}</th>
                      <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">{{ t('llm.stats.promptTokens') }}</th>
                      <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">{{ t('llm.stats.completionTokens') }}</th>
                      <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">{{ t('llm.stats.totalCalls') }}</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-100">
                    <tr v-for="row in byModel" :key="row.model || row.name" class="hover:bg-gray-50 transition-colors duration-150">
                      <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{{ row.model ?? row.name ?? '-' }}</td>
                      <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{{ formatNum(row.total_tokens) }}</td>
                      <td class="px-4 py-3 whitespace-nowrap text-sm text-amber-600 font-medium">{{ formatCost(row.total_cost, row.total_cost_currency) }}</td>
                      <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{{ formatNum(row.total_prompt_tokens) }}</td>
                      <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{{ formatNum(row.total_completion_tokens) }}</td>
                      <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{{ formatNum(row.total_calls ?? row.count) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'vue-chartjs'
import { formatNumLocale, formatCostLocale } from '@/utils/formatting'
import { llmAdminApi } from '@/api/llmAdmin'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import BaseLoading from '@/components/ui/BaseLoading.vue'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const { t, locale } = useI18n()

function formatNum(value) {
  const s = formatNumLocale(value, locale.value)
  return s === '-' ? '0' : s
}

function formatCost(value, currency = 'USD') {
  return formatCostLocale(value, currency, locale.value)
}

const statsData = ref(null)
const loading = ref(false)
const userOptions = ref([])
const selectedUserId = ref('')
const selectedDate = ref('')
const selectedMonth = ref('')
const selectedYear = ref(new Date().getFullYear())
const granularity = ref('day')

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

function selectGranularity(g) {
  granularity.value = g
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  selectedDate.value = `${y}-${m}-${d}`
  selectedMonth.value = `${y}-${m}`
  selectedYear.value = y
  fetchStats()
}

function lastDayOfMonth(ym) {
  const [y, m] = ym.split('-').map(Number)
  const d = new Date(y, m, 0).getDate()
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

const yearOptions = computed(() => {
  const current = new Date().getFullYear()
  return Array.from({ length: 10 }, (_, i) => current - i)
})

const granularityOptions = computed(() => [
  { value: 'day', label: t('llm.stats.granularityDay') },
  { value: 'month', label: t('llm.stats.granularityMonth') },
  { value: 'year', label: t('llm.stats.granularityYear') }
])

const byModel = computed(() => {
  const list = statsData.value?.by_model
  return Array.isArray(list) ? list : []
})

const seriesItems = computed(() => {
  const s = statsData.value?.series
  return Array.isArray(s?.items) ? s.items : []
})

const chartSubtitle = computed(() => {
  const g = statsData.value?.series?.granularity || granularity.value
  if (g === 'day') return t('llm.stats.chartByHour')
  if (g === 'month') return t('llm.stats.chartByDay')
  if (g === 'year') return t('llm.stats.chartByMonth')
  return ''
})

function formatBucketLabel(bucketIso) {
  if (!bucketIso) return ''
  try {
    const d = new Date(bucketIso)
    const g = statsData.value?.series?.granularity || granularity.value
    if (g === 'day') return d.toLocaleTimeString(locale.value, { hour: '2-digit', minute: '2-digit', hour12: false })
    if (g === 'month') return d.toLocaleDateString(locale.value, { month: '2-digit', day: '2-digit' })
    if (g === 'year') return d.toLocaleDateString(locale.value, { year: 'numeric', month: '2-digit' })
  } catch {
    return bucketIso
  }
  return bucketIso
}

const chartData = computed(() => ({
  labels: seriesItems.value.map((i) => formatBucketLabel(i.bucket)),
  datasets: [
    {
      label: t('llm.stats.totalTokens'),
      data: seriesItems.value.map((i) => i.total_tokens ?? 0),
      backgroundColor: 'rgba(245, 158, 11, 0.6)',
      borderColor: 'rgb(217, 119, 6)',
      borderWidth: 1
    }
  ]
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label(ctx) {
          return `${t('llm.stats.totalTokens')}: ${formatNum(ctx.raw)}`
        }
      }
    }
  },
  scales: {
    x: { grid: { display: false }, ticks: { maxRotation: 45, minRotation: 0 } },
    y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.06)' } }
  }
}))

async function fetchStats() {
  loading.value = true
  try {
    const params = { granularity: granularity.value }
    let start = ''
    let end = ''
    if (granularity.value === 'day') {
      start = selectedDate.value
      end = selectedDate.value
    } else if (granularity.value === 'month') {
      start = selectedMonth.value ? `${selectedMonth.value}-01` : ''
      end = selectedMonth.value ? lastDayOfMonth(selectedMonth.value) : ''
    } else if (granularity.value === 'year') {
      start = selectedYear.value ? `${selectedYear.value}-01-01` : ''
      end = selectedYear.value ? `${selectedYear.value}-12-31` : ''
    }
    if (start) params.start_date = start
    if (end) params.end_date = end
    if (selectedUserId.value) params.user_id = selectedUserId.value
    const data = await llmAdminApi.getTokenStats(params)
    statsData.value = data ?? null
  } catch {
    statsData.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  selectedDate.value = `${y}-${m}-${d}`
  selectedMonth.value = `${y}-${m}`
  selectedYear.value = y
  fetchUserOptions()
  fetchStats()
})
</script>
