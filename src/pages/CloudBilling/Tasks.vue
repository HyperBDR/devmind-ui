<template>
  <AppLayout>
    <div class="w-full max-w-full">
      <!-- Page Header -->
      <div class="mb-4">
        <h1 class="text-lg font-semibold text-gray-900">
          {{ t('cloudBilling.tasks.title') }}
        </h1>
      </div>

      <!-- Content Card -->
      <div class="bg-white rounded border border-gray-200 shadow-sm">
        <div class="p-6">
          <!-- Toolbar -->
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <!-- Actions (Left) -->
            <div class="flex items-center gap-3 flex-wrap">
              <BaseButton
                variant="primary"
                size="sm"
                :loading="triggering"
                @click="handleTriggerCollection"
                class="flex items-center gap-2"
              >
                <svg
                  v-if="!triggering"
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                {{ triggering ? t('cloudBilling.tasks.triggering') : t('cloudBilling.tasks.triggerCollection') }}
              </BaseButton>
            </div>

            <!-- Search and Filter (Right) -->
            <div class="flex items-center gap-3 w-full sm:w-auto">
              <BaseInput
                v-model="searchQuery"
                :placeholder="t('common.search')"
                class="flex-1 sm:w-64"
                @update:modelValue="handleSearch"
              >
                <template #icon>
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </template>
              </BaseInput>

              <BaseButton
                variant="outline"
                size="sm"
                :loading="loading"
                @click="handleRefresh"
                :title="t('common.refresh')"
                class="flex items-center gap-1 shadow-sm hover:shadow-md transition-shadow"
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
          </div>

          <BaseLoading v-if="loading && tasks.length === 0" />

          <div v-if="!loading && tasks.length === 0" class="py-16 text-center rounded-lg border border-gray-200 bg-gray-50">
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p class="text-sm font-medium text-gray-600">{{ t('cloudBilling.tasks.noTasks') }}</p>
          </div>

          <!-- Mobile Card View -->
          <div
            v-if="!loading && tasks.length > 0"
            class="md:hidden space-y-3"
          >
            <TaskCard
              v-for="task in tasks"
              :key="task.id"
              :task="task"
              @view="handlePreview"
            />
          </div>

          <!-- Desktop Table View -->
          <div
            v-if="!loading && tasks.length > 0"
            class="hidden md:block overflow-x-auto"
          >
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ t('cloudBilling.tasks.taskName') }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ t('cloudBilling.tasks.status') }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ t('cloudBilling.tasks.startTime') }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ t('cloudBilling.tasks.endTime') }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ t('cloudBilling.tasks.duration') }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="task in tasks"
                  :key="task.id"
                  @click="handlePreview(task)"
                  class="cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ task.name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <StatusBadge :status="mapTaskStatus(task.status)" />
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(task.started_at) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(task.finished_at) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDuration(task.duration) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Task Detail Panel -->
      <TaskDetailPanel
        :show="showPreviewModal"
        :task="selectedTask"
        @close="showPreviewModal = false"
      />
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { format } from 'date-fns'
import { useDebounce } from '@/composables/useDebounce'
import { useToast } from '@/composables/useToast'
import { extractResponseData } from '@/utils/api'
import { cloudBillingApi } from '@/api/cloudBilling'
import AppLayout from '@/components/layout/AppLayout.vue'
import BaseLoading from '@/components/ui/BaseLoading.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import TaskCard from '@/components/cloud-billing/TaskCard.vue'
import TaskDetailPanel from '@/components/cloud-billing/TaskDetailPanel.vue'

const { t } = useI18n()
const { showSuccess, showError } = useToast()

const loading = ref(false)
const triggering = ref(false)
const tasks = ref([])
const searchQuery = ref('')
const showPreviewModal = ref(false)
const selectedTask = ref(null)

const formatDate = (dateString) => {
  if (!dateString) return '-'
  try {
    return format(new Date(dateString), 'yyyy-MM-dd HH:mm')
  } catch {
    return dateString
  }
}

const formatDuration = (seconds) => {
  if (!seconds) return '-'
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${hours}h ${minutes}m`
}

const mapTaskStatus = (status) => {
  const statusMap = {
    pending: 'pending',
    running: 'processing',
    completed: 'success',
    failed: 'failed'
  }
  return statusMap[status] || status
}

const debouncedSearch = useDebounce((query) => {
  loadTasks(query)
}, 300)

const handleSearch = (query) => {
  searchQuery.value = query
  debouncedSearch(query)
}

const handleRefresh = () => {
  loadTasks(searchQuery.value)
}

const handlePreview = (task) => {
  selectedTask.value = task
  showPreviewModal.value = true
}

const handleTriggerCollection = async () => {
  triggering.value = true
  try {
    const response = await cloudBillingApi.triggerCollection()
    const data = extractResponseData(response)
    
    if (data.success) {
      showSuccess(t('cloudBilling.tasks.collectionTriggered'))
      // Refresh task list after a short delay
      setTimeout(() => {
        loadTasks(searchQuery.value)
      }, 1000)
    } else {
      showError(data.message || t('cloudBilling.tasks.collectionFailed'))
    }
  } catch (error) {
    console.error('Failed to trigger collection:', error)
    const errorMessage = error.response?.data?.message || 
                         error.response?.data?.detail ||
                         t('cloudBilling.tasks.collectionFailed')
    showError(errorMessage)
  } finally {
    triggering.value = false
  }
}

const loadTasks = async (query = '') => {
  loading.value = true
  try {
    const params = {}
    if (query) {
      // Search by task_id or task_name
      params.search = query
    }
    const response = await cloudBillingApi.getCollectionTasks(params)
    const data = extractResponseData(response)
    
    // Handle paginated response format
    let taskList = []
    if (Array.isArray(data)) {
      taskList = data
    } else if (data && data.results) {
      taskList = data.results
    } else if (data && data.list) {
      taskList = data.list
    }
    
    // Map task_manager fields to display format
    tasks.value = taskList.map(task => ({
      id: task.id,
      name: task.task_name || 'cloud_billing.tasks.collect_billing_data',
      status: mapTaskManagerStatus(task.status),
      started_at: task.started_at || task.created_at,
      finished_at: task.finished_at,
      duration: calculateDuration(task.started_at, task.finished_at),
      task_id: task.task_id,
      result: task.result,
      error: task.error,
      metadata: task.metadata
    }))
  } catch (error) {
    console.error('Failed to load tasks:', error)
    tasks.value = []
  } finally {
    loading.value = false
  }
}

const calculateDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return null
  try {
    const start = new Date(startTime)
    const end = new Date(endTime)
    return Math.floor((end - start) / 1000) // Duration in seconds
  } catch {
    return null
  }
}

const mapTaskManagerStatus = (status) => {
  const statusMap = {
    'PENDING': 'pending',
    'STARTED': 'running',
    'SUCCESS': 'completed',
    'FAILURE': 'failed',
    'RETRY': 'running',
    'REVOKED': 'failed'
  }
  return statusMap[status] || status?.toLowerCase() || 'pending'
}

onMounted(() => {
  loadTasks()
})
</script>
