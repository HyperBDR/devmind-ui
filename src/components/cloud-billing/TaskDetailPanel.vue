<template>
  <!-- Overlay -->
  <Transition
    enter-active-class="transition-opacity duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-150"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="show"
      @click="handleClose"
      class="fixed inset-0 bg-gray-900 bg-opacity-50 z-40"
    />
  </Transition>

  <!-- Right Panel -->
  <Transition
    enter-active-class="transition-transform duration-300 ease-out"
    enter-from-class="translate-x-full"
    enter-to-class="translate-x-0"
    leave-active-class="transition-transform duration-250 ease-in"
    leave-from-class="translate-x-0"
    leave-to-class="translate-x-full"
  >
    <div
      v-if="show"
      class="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-xl z-50 flex flex-col"
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 flex-shrink-0">
        <h2 class="text-lg font-semibold text-gray-900">
          {{ t('cloudBilling.tasks.details') }}
        </h2>
        <button
          @click="handleClose"
          class="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Content - Scrollable -->
      <div class="flex-1 overflow-y-auto">
        <div v-if="task" class="p-6 space-y-6">
          <!-- Basic Information -->
          <div>
            <h3 class="text-sm font-semibold text-gray-900 mb-4">
              {{ t('cloudBilling.tasks.basicInfo') }}
            </h3>
            <dl class="grid grid-cols-1 gap-4">
              <div>
                <dt class="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                  {{ t('cloudBilling.tasks.taskName') }}
                </dt>
                <dd class="text-sm font-medium text-gray-900">
                  {{ task.name || task.task_name || 'cloud_billing.tasks.collect_billing_data' }}
                </dd>
              </div>
              <div>
                <dt class="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                  {{ t('cloudBilling.tasks.status') }}
                </dt>
                <dd>
                  <StatusBadge :status="mapTaskStatus(task.status)" />
                </dd>
              </div>
              <div>
                <dt class="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                  Task ID
                </dt>
                <dd class="text-sm font-medium text-gray-900 font-mono">
                  {{ task.task_id || '-' }}
                </dd>
              </div>
              <div>
                <dt class="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                  {{ t('cloudBilling.tasks.startTime') }}
                </dt>
                <dd class="text-sm font-medium text-gray-900">
                  {{ formatDate(task.started_at || task.created_at) }}
                </dd>
              </div>
              <div>
                <dt class="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                  {{ t('cloudBilling.tasks.endTime') }}
                </dt>
                <dd class="text-sm font-medium text-gray-900">
                  {{ formatDate(task.finished_at) }}
                </dd>
              </div>
              <div>
                <dt class="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                  {{ t('cloudBilling.tasks.duration') }}
                </dt>
                <dd class="text-sm font-medium text-gray-900">
                  {{ formatDuration(task.duration || calculateDuration(task.started_at || task.created_at, task.finished_at)) }}
                </dd>
              </div>
              <div v-if="task.error">
                <dt class="text-xs font-semibold text-red-700 mb-2 uppercase tracking-wider">
                  Error
                </dt>
                <dd class="text-sm text-red-600 whitespace-pre-wrap">
                  {{ task.error }}
                </dd>
              </div>
              <div v-if="task.result">
                <dt class="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                  Result
                </dt>
                <dd class="text-sm text-gray-600">
                  <pre class="bg-gray-50 p-3 rounded text-xs overflow-auto max-h-64">{{ JSON.stringify(task.result, null, 2) }}</pre>
                </dd>
              </div>
            </dl>
          </div>

          <!-- Traceback -->
          <div v-if="task.traceback" class="border-t border-gray-200 pt-6">
            <h3 class="text-sm font-semibold text-gray-900 mb-4">
              {{ t('cloudBilling.tasks.traceback') }}
            </h3>
            <div class="bg-red-50 border border-red-200 rounded-lg p-4 shadow-sm">
              <pre class="text-xs font-mono text-red-800 whitespace-pre-wrap overflow-auto max-h-96">{{ task.traceback }}</pre>
            </div>
          </div>

          <!-- Warnings and Errors -->
          <div v-if="warningsAndErrors && warningsAndErrors.length > 0" class="border-t border-gray-200 pt-6">
            <h3 class="text-sm font-semibold text-gray-900 mb-4">
              {{ t('cloudBilling.tasks.warningsAndErrors') }}
              <span class="text-xs font-normal text-gray-500 ml-2">
                ({{ warningsAndErrors.length }})
              </span>
            </h3>
            <div class="space-y-2 max-h-96 overflow-y-auto">
              <div
                v-for="(log, index) in warningsAndErrors"
                :key="index"
                class="border rounded-lg p-3 shadow-sm"
                :class="{
                  'bg-yellow-50 border-yellow-200': log.level === 'WARNING',
                  'bg-red-50 border-red-200': log.level === 'ERROR' || log.level === 'CRITICAL'
                }"
              >
                <div class="flex items-start justify-between mb-1">
                  <span
                    class="text-xs font-semibold px-2 py-0.5 rounded"
                    :class="{
                      'bg-yellow-200 text-yellow-800': log.level === 'WARNING',
                      'bg-red-200 text-red-800': log.level === 'ERROR' || log.level === 'CRITICAL'
                    }"
                  >
                    {{ log.level }}
                  </span>
                  <span class="text-xs text-gray-500">
                    {{ formatLogTimestamp(log.timestamp) }}
                  </span>
                </div>
                <div class="text-sm font-medium mt-1 whitespace-pre-wrap" :class="{
                  'text-yellow-800': log.level === 'WARNING',
                  'text-red-800': log.level === 'ERROR' || log.level === 'CRITICAL'
                }">
                  {{ log.message }}
                </div>
                <div v-if="log.exception" class="mt-2 pt-2 border-t border-gray-300">
                  <pre class="text-xs font-mono whitespace-pre-wrap overflow-auto">{{ log.exception.join('') }}</pre>
                </div>
                <div v-if="log.module || log.funcName" class="text-xs text-gray-500 mt-1">
                  {{ log.module }}{{ log.funcName ? '.' + log.funcName : '' }}{{ log.lineno ? ':' + log.lineno : '' }}
                </div>
              </div>
            </div>
          </div>

          <!-- Execution Logs -->
          <div v-if="executionLogs && executionLogs.length > 0" class="border-t border-gray-200 pt-6">
            <h3 class="text-sm font-semibold text-gray-900 mb-4">
              {{ t('cloudBilling.tasks.executionLogs') }}
              <span class="text-xs font-normal text-gray-500 ml-2">
                ({{ executionLogs.length }})
              </span>
            </h3>
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
              <details class="cursor-pointer">
                <summary class="text-xs font-semibold text-gray-700 mb-2">
                  {{ t('cloudBilling.tasks.viewLogs') }}
                </summary>
                <div class="mt-3 space-y-1 max-h-96 overflow-y-auto">
                  <div
                    v-for="(log, index) in executionLogs"
                    :key="index"
                    class="text-xs font-mono whitespace-pre-wrap p-2 rounded"
                    :class="{
                      'bg-blue-50 text-blue-800': log.level === 'INFO',
                      'bg-yellow-50 text-yellow-800': log.level === 'WARNING',
                      'bg-red-50 text-red-800': log.level === 'ERROR' || log.level === 'CRITICAL',
                      'bg-gray-50 text-gray-600': log.level === 'DEBUG'
                    }"
                  >
                    <span class="text-gray-500">[{{ formatLogTimestamp(log.timestamp) }}]</span>
                    <span class="font-semibold ml-2">{{ log.level }}:</span>
                    <span class="ml-1">{{ log.message }}</span>
                  </div>
                </div>
              </details>
            </div>
          </div>

          <!-- Log Summary -->
          <div v-if="logSummary" class="border-t border-gray-200 pt-6">
            <h3 class="text-sm font-semibold text-gray-900 mb-4">
              {{ t('cloudBilling.tasks.logSummary') }}
            </h3>
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
              <dl class="grid grid-cols-2 gap-4">
                <div>
                  <dt class="text-xs font-semibold text-gray-700 mb-1">
                    {{ t('cloudBilling.tasks.totalLogs') }}
                  </dt>
                  <dd class="text-sm font-medium text-gray-900">
                    {{ logSummary.total }}
                  </dd>
                </div>
                <div v-for="(count, level) in logSummary.by_level" :key="level">
                  <dt class="text-xs font-semibold text-gray-700 mb-1">
                    {{ level }}
                  </dt>
                  <dd class="text-sm font-medium text-gray-900">
                    {{ count }}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { format } from 'date-fns'
import StatusBadge from '@/components/ui/StatusBadge.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  task: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close'])

const { t } = useI18n()

const warningsAndErrors = computed(() => {
  if (!props.task || !props.task.metadata) return []
  return props.task.metadata.warnings_and_errors || []
})

const executionLogs = computed(() => {
  if (!props.task || !props.task.metadata) return []
  return props.task.metadata.logs || []
})

const logSummary = computed(() => {
  if (!props.task || !props.task.metadata) return null
  return props.task.metadata.log_summary || null
})

const formatDate = (dateString) => {
  if (!dateString) return '-'
  try {
    return format(new Date(dateString), 'yyyy-MM-dd HH:mm:ss')
  } catch {
    return dateString
  }
}

const formatDuration = (seconds) => {
  if (!seconds && seconds !== 0) return '-'
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${hours}h ${minutes}m`
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

const mapTaskStatus = (status) => {
  const statusMap = {
    pending: 'pending',
    running: 'processing',
    completed: 'success',
    failed: 'failed',
    'PENDING': 'pending',
    'STARTED': 'processing',
    'SUCCESS': 'success',
    'FAILURE': 'failed',
    'RETRY': 'processing',
    'REVOKED': 'failed'
  }
  return statusMap[status] || status?.toLowerCase() || 'pending'
}

const formatLogTimestamp = (timestamp) => {
  if (!timestamp) return '-'
  try {
    const date = new Date(timestamp * 1000)
    return format(date, 'HH:mm:ss.SSS')
  } catch {
    return timestamp
  }
}

const handleClose = () => {
  emit('close')
}
</script>
