<template>
  <BaseModal
    :show="show"
    :title="modalTitle"
    @close="$emit('close')"
  >
    <div class="space-y-6">
      <template v-if="!isSectionEditMode">
        <nav class="flex items-center justify-center gap-2 text-sm" aria-label="Steps">
          <span
            class="flex items-center gap-1.5"
            :class="currentStep >= 1 ? 'text-primary-600 font-medium' : 'text-gray-400'"
          >
            <span class="flex h-7 w-7 items-center justify-center rounded-full border" :class="currentStep >= 1 ? 'border-primary-600 bg-primary-50' : 'border-gray-300'">1</span>
            {{ t('dataCollector.settings.step1Title') }}
          </span>
          <span class="text-gray-300">→</span>
          <span
            class="flex items-center gap-1.5"
            :class="currentStep >= 2 ? 'text-primary-600 font-medium' : 'text-gray-400'"
          >
            <span class="flex h-7 w-7 items-center justify-center rounded-full border" :class="currentStep >= 2 ? 'border-primary-600 bg-primary-50' : 'border-gray-300'">2</span>
            {{ t('dataCollector.settings.step2Title') }}
          </span>
          <span v-if="!isFullEditMode" class="text-gray-300">→</span>
          <span
            v-if="!isFullEditMode"
            class="flex items-center gap-1.5"
            :class="currentStep >= 3 ? 'text-primary-600 font-medium' : 'text-gray-400'"
          >
            <span class="flex h-7 w-7 items-center justify-center rounded-full border" :class="currentStep >= 3 ? 'border-primary-600 bg-primary-50' : 'border-gray-300'">3</span>
            {{ t('dataCollector.settings.step3Title') }}
          </span>
        </nav>

      <form v-if="currentStep === 1" @submit.prevent="currentStep = 2; loadProjectsIfNeeded()" class="space-y-4">
        <div class="space-y-3 border-b border-gray-200 pb-4">
          <h4 class="text-sm font-semibold text-gray-900">
            {{ t('dataCollector.settings.basicInfo') }}
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
            <div class="md:col-span-1">
              <label for="platform" class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('dataCollector.settings.platform') }}
              </label>
              <p class="text-xs text-gray-500 mb-2 md:mb-0">
                {{ t('dataCollector.settings.platformDesc') }}
              </p>
            </div>
            <div class="md:col-span-2">
              <select
                id="platform"
                v-model="formData.platform"
                required
                class="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                :disabled="!!config"
              >
                <option value="jira">Jira</option>
                <option value="feishu">Feishu</option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
            <div class="md:col-span-1">
              <label for="key" class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('dataCollector.settings.key') }}
              </label>
              <p class="text-xs text-gray-500 mb-2 md:mb-0">
                {{ t('dataCollector.settings.keyDesc') }}
              </p>
            </div>
            <div class="md:col-span-2">
              <BaseInput
                id="key"
                v-model="formData.key"
                type="text"
                :placeholder="t('dataCollector.settings.keyPlaceholder')"
                required
                class="w-full"
              />
            </div>
          </div>
        </div>

        <template v-if="formData.platform === 'jira'">
          <div class="space-y-3 border-b border-gray-200 pb-4">
            <h4 class="text-sm font-semibold text-gray-900">
              {{ t('dataCollector.settings.authConfig') }}
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
              <div class="md:col-span-1">
                <label for="authVersion" class="block text-sm font-medium text-gray-700 mb-1">
                  {{ t('dataCollector.jira.authVersion') }}
                </label>
                <p class="text-xs text-gray-500 mb-2 md:mb-0">
                  {{ t('dataCollector.jira.authVersionDesc') }}
                </p>
              </div>
              <div class="md:col-span-2">
                <select
                  id="authVersion"
                  v-model="formData.jira_auth_version"
                  class="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="legacy">{{ t('dataCollector.jira.authVersionLegacy') }}</option>
                  <option value="cloud">{{ t('dataCollector.jira.authVersionCloud') }}</option>
                </select>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
              <div class="md:col-span-1">
                <label for="baseUrl" class="block text-sm font-medium text-gray-700 mb-1">
                  {{ t('dataCollector.jira.baseUrl') }}
                </label>
                <p class="text-xs text-gray-500 mb-2 md:mb-0">
                  {{ t('dataCollector.jira.baseUrlDesc') }}
                </p>
              </div>
              <div class="md:col-span-2">
                <BaseInput
                  id="baseUrl"
                  v-model="formData.jira_base_url"
                  type="url"
                  :placeholder="t('dataCollector.jira.baseUrlPlaceholder')"
                  required
                  class="w-full"
                />
              </div>
            </div>
            <template v-if="formData.jira_auth_version === 'legacy'">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
                <div class="md:col-span-1">
                  <label for="jiraUsername" class="block text-sm font-medium text-gray-700 mb-1">
                    {{ t('dataCollector.jira.username') }}
                  </label>
                  <p class="text-xs text-gray-500 mb-2 md:mb-0">
                    {{ t('dataCollector.jira.usernameDesc') }}
                  </p>
                </div>
                <div class="md:col-span-2">
                  <BaseInput
                    id="jiraUsername"
                    v-model="formData.jira_username"
                    type="text"
                    :placeholder="t('dataCollector.jira.usernamePlaceholder')"
                    :required="formData.jira_auth_version === 'legacy'"
                    class="w-full"
                  />
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
                <div class="md:col-span-1">
                  <label for="jiraPassword" class="block text-sm font-medium text-gray-700 mb-1">
                    {{ t('dataCollector.jira.password') }}
                  </label>
                  <p class="text-xs text-gray-500 mb-2 md:mb-0">
                    {{ t('dataCollector.jira.passwordDesc') }}
                  </p>
                </div>
                <div class="md:col-span-2">
                  <BaseInput
                    id="jiraPassword"
                    v-model="formData.jira_password"
                    type="password"
                    :placeholder="config ? t('dataCollector.jira.passwordPlaceholderEdit') : t('dataCollector.jira.passwordPlaceholder')"
                    :required="!config && formData.jira_auth_version === 'legacy'"
                    class="w-full"
                  />
                </div>
              </div>
            </template>
            <template v-else>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
                <div class="md:col-span-1">
                  <label for="jiraEmail" class="block text-sm font-medium text-gray-700 mb-1">
                    {{ t('dataCollector.jira.email') }}
                  </label>
                  <p class="text-xs text-gray-500 mb-2 md:mb-0">
                    {{ t('dataCollector.jira.emailDesc') }}
                  </p>
                </div>
                <div class="md:col-span-2">
                  <BaseInput
                    id="jiraEmail"
                    v-model="formData.jira_email"
                    type="email"
                    :placeholder="t('dataCollector.jira.emailPlaceholder')"
                    :required="formData.jira_auth_version === 'cloud'"
                    class="w-full"
                  />
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
                <div class="md:col-span-1">
                  <label for="jiraApiToken" class="block text-sm font-medium text-gray-700 mb-1">
                    {{ t('dataCollector.jira.apiToken') }}
                  </label>
                  <p class="text-xs text-gray-500 mb-2 md:mb-0">
                    {{ t('dataCollector.jira.apiTokenDesc') }}
                  </p>
                </div>
                <div class="md:col-span-2">
                  <BaseInput
                    id="jiraApiToken"
                    v-model="formData.jira_api_token"
                    type="password"
                    :placeholder="config ? t('dataCollector.jira.apiTokenPlaceholderEdit') : t('dataCollector.jira.apiTokenPlaceholder')"
                    :required="!config && formData.jira_auth_version === 'cloud'"
                    class="w-full"
                  />
                </div>
              </div>
            </template>
          </div>
        </template>
      </form>

      <div v-else-if="currentStep === 2" class="space-y-4">
        <p class="text-sm text-gray-600">
          {{ t('dataCollector.settings.selectProjectsDesc') }}
        </p>
        <div v-if="projectsLoading" class="py-8 text-center text-sm text-gray-500">
          {{ t('dataCollector.settings.loadingProjects') }}
        </div>
        <div v-else-if="projectsError" class="rounded-md p-3 text-sm bg-red-50 text-red-800">
          {{ projectsError }}
        </div>
        <div v-else-if="projects.length === 0" class="py-8 text-center text-sm text-gray-500">
          {{ t('dataCollector.settings.noProjects') }}
        </div>
        <div v-else class="max-h-64 overflow-y-auto rounded border border-gray-200 divide-y divide-gray-200">
          <label
            v-for="proj in projects"
            :key="proj.key"
            class="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer"
          >
            <input
              v-model="formData.selected_project_keys"
              type="checkbox"
              :value="proj.key"
              class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span class="font-medium text-gray-900">{{ proj.key }}</span>
            <span class="text-sm text-gray-500">{{ proj.name }}</span>
          </label>
        </div>
      </div>

      <form v-else-if="currentStep === 3" @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
          <div class="md:col-span-1">
            <label for="isEnabled" class="block text-sm font-medium text-gray-700 mb-1">
              {{ t('dataCollector.settings.isEnabled') }}
            </label>
            <p class="text-xs text-gray-500 mb-2 md:mb-0">
              {{ t('dataCollector.settings.isEnabledDesc') }}
            </p>
          </div>
          <div class="md:col-span-2">
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                id="isEnabled"
                v-model="formData.is_enabled"
                type="checkbox"
                class="sr-only peer"
              />
              <div
                class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"
              />
              <span class="ml-3 text-sm text-gray-700">
                {{ formData.is_enabled ? t('common.enabled') : t('common.disabled') }}
              </span>
            </label>
          </div>
        </div>
        <div class="space-y-3 border-t border-gray-200 pt-4">
          <h4 class="text-sm font-semibold text-gray-900">
            {{ t('dataCollector.settings.scheduleSection') }}
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
            <div class="md:col-span-1">
              <label for="scheduleCron" class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('dataCollector.settings.scheduleCron') }}
              </label>
              <p class="text-xs text-gray-500 mb-2 md:mb-0">
                {{ t('dataCollector.settings.scheduleCronDesc') }}
              </p>
            </div>
            <div class="md:col-span-2">
              <BaseInput
                id="scheduleCron"
                v-model="formData.schedule_cron"
                type="text"
                :placeholder="t('dataCollector.settings.scheduleCronPlaceholder')"
                class="w-full"
              />
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
            <div class="md:col-span-1">
              <label for="cleanupCron" class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('dataCollector.settings.cleanupCron') }}
              </label>
              <p class="text-xs text-gray-500 mb-2 md:mb-0">
                {{ t('dataCollector.settings.cleanupCronDesc') }}
              </p>
            </div>
            <div class="md:col-span-2">
              <BaseInput
                id="cleanupCron"
                v-model="formData.cleanup_cron"
                type="text"
                :placeholder="t('dataCollector.settings.cleanupCronPlaceholder')"
                class="w-full"
              />
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
            <div class="md:col-span-1">
              <label for="retentionDays" class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('dataCollector.settings.retentionDays') }}
              </label>
              <p class="text-xs text-gray-500 mb-2 md:mb-0">
                {{ t('dataCollector.settings.retentionDaysDesc') }}
              </p>
            </div>
            <div class="md:col-span-2">
              <BaseInput
                id="retentionDays"
                v-model.number="formData.retention_days"
                type="number"
                min="1"
                class="w-full"
              />
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
            <div class="md:col-span-1">
              <label for="initialRange" class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('dataCollector.settings.initialRange') }}
              </label>
              <p class="text-xs text-gray-500 mb-2 md:mb-0">
                {{ t('dataCollector.settings.initialRangeDesc') }}
              </p>
            </div>
            <div class="md:col-span-2">
              <select
                id="initialRange"
                v-model="formData.initial_range"
                class="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="1m">{{ t('dataCollector.settings.initialRange1m') }}</option>
                <option value="3m">{{ t('dataCollector.settings.initialRange3m') }}</option>
              </select>
            </div>
          </div>
        </div>
      </form>
      </template>

      <template v-else-if="isSectionEditMode && editSection === 'schedule'">
        <div class="max-h-[60vh] overflow-y-auto space-y-4 pr-1">
          <p class="text-sm text-gray-500">{{ config.key }} · {{ t('dataCollector.settings.scheduleSection') }}</p>
          <section class="space-y-3">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
              <div class="md:col-span-1"><label for="sec-isEnabled" class="block text-sm font-medium text-gray-700 mb-1">{{ t('dataCollector.settings.isEnabled') }}</label></div>
              <div class="md:col-span-2">
                <label class="relative inline-flex items-center cursor-pointer">
                  <input id="sec-isEnabled" v-model="formData.is_enabled" type="checkbox" class="sr-only peer" />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600" />
                  <span class="ml-3 text-sm text-gray-700">{{ formData.is_enabled ? t('common.enabled') : t('common.disabled') }}</span>
                </label>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
              <div class="md:col-span-1"><label for="sec-scheduleCron" class="block text-sm font-medium text-gray-700 mb-1">{{ t('dataCollector.settings.scheduleCron') }}</label></div>
              <div class="md:col-span-2"><BaseInput id="sec-scheduleCron" v-model="formData.schedule_cron" type="text" :placeholder="t('dataCollector.settings.scheduleCronPlaceholder')" class="w-full" /></div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
              <div class="md:col-span-1"><label for="sec-cleanupCron" class="block text-sm font-medium text-gray-700 mb-1">{{ t('dataCollector.settings.cleanupCron') }}</label></div>
              <div class="md:col-span-2"><BaseInput id="sec-cleanupCron" v-model="formData.cleanup_cron" type="text" :placeholder="t('dataCollector.settings.cleanupCronPlaceholder')" class="w-full" /></div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
              <div class="md:col-span-1"><label for="sec-retentionDays" class="block text-sm font-medium text-gray-700 mb-1">{{ t('dataCollector.settings.retentionDays') }}</label></div>
              <div class="md:col-span-2"><BaseInput id="sec-retentionDays" v-model.number="formData.retention_days" type="number" min="1" class="w-full" /></div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
              <div class="md:col-span-1"><label for="sec-initialRange" class="block text-sm font-medium text-gray-700 mb-1">{{ t('dataCollector.settings.initialRange') }}</label></div>
              <div class="md:col-span-2">
                <select id="sec-initialRange" v-model="formData.initial_range" class="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="1m">{{ t('dataCollector.settings.initialRange1m') }}</option>
                  <option value="3m">{{ t('dataCollector.settings.initialRange3m') }}</option>
                </select>
              </div>
            </div>
          </section>
        </div>
      </template>
    </div>

    <template #footer>
      <div class="flex flex-col-reverse sm:flex-row justify-end gap-3">
        <BaseButton variant="outline" @click="$emit('close')" class="w-full sm:w-auto">
          {{ isSectionEditMode ? t('common.close') : t('common.cancel') }}
        </BaseButton>
        <template v-if="isSectionEditMode">
          <BaseButton
            type="button"
            :loading="savingSection"
            :disabled="savingSection"
            @click="handleSaveSection"
            class="w-full sm:w-auto"
          >
            {{ savingSection ? t('common.saving') : t('common.save') }}
          </BaseButton>
        </template>
        <template v-else-if="currentStep === 1">
          <BaseButton
            type="button"
            :disabled="!canGoNextFromStep1"
            @click="currentStep = 2; loadProjectsIfNeeded()"
            class="w-full sm:w-auto"
          >
            {{ t('dataCollector.settings.nextStep') }}
          </BaseButton>
        </template>
        <template v-else-if="currentStep === 2 && isFullEditMode">
          <BaseButton variant="outline" @click="currentStep = 1" class="w-full sm:w-auto">
            {{ t('dataCollector.settings.prevStep') }}
          </BaseButton>
          <BaseButton
            type="button"
            :loading="saving"
            :disabled="saving || !canGoNextFromStep2"
            @click="handleSubmit"
            class="w-full sm:w-auto"
          >
            {{ saving ? t('common.saving') : t('common.save') }}
          </BaseButton>
        </template>
        <template v-else-if="currentStep === 2">
          <BaseButton variant="outline" @click="currentStep = 1" class="w-full sm:w-auto">
            {{ t('dataCollector.settings.prevStep') }}
          </BaseButton>
          <BaseButton
            type="button"
            :disabled="!canGoNextFromStep2"
            @click="currentStep = 3"
            class="w-full sm:w-auto"
          >
            {{ t('dataCollector.settings.nextStep') }}
          </BaseButton>
        </template>
        <template v-else>
          <BaseButton variant="outline" @click="currentStep = 2" class="w-full sm:w-auto">
            {{ t('dataCollector.settings.prevStep') }}
          </BaseButton>
          <BaseButton
            :loading="saving"
            :disabled="saving"
            @click="handleSubmit"
            class="w-full sm:w-auto"
          >
            {{ saving ? t('common.saving') : t('common.save') }}
          </BaseButton>
        </template>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, watch, reactive, computed, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from '@/composables/useToast'
import { extractResponseData, extractErrorMessage } from '@/utils/api'
import { dataCollectorApi } from '@/api/dataCollector'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  config: { type: Object, default: null },
  editSection: { type: String, default: null }
})

const emit = defineEmits(['close', 'saved', 'section-saved'])

const { t } = useI18n()
const { showSuccess, showError } = useToast()
const saving = ref(false)
const savingSchedule = ref(false)
const currentStep = ref(1)
const projects = ref([])
const projectsLoading = ref(false)
const projectsError = ref('')

const formData = reactive({
  platform: 'jira',
  key: '',
  is_enabled: true,
  jira_auth_version: 'legacy',
  jira_base_url: '',
  jira_username: '',
  jira_password: '',
  jira_email: '',
  jira_api_token: '',
  selected_project_keys: [],
  schedule_cron: '0 */2 * * *',
  cleanup_cron: '0 3 * * *',
  retention_days: 180,
  initial_range: '1m'
})

const isSectionEditMode = computed(() => !!props.config && props.editSection === 'schedule')
const isFullEditMode = computed(() => !!props.config && props.editSection === 'full')

const modalTitle = computed(() => {
  if (!props.config) return t('dataCollector.settings.addConfig')
  if (props.editSection === 'full') return t('dataCollector.settings.editConfig')
  if (props.editSection === 'schedule') return t('dataCollector.settings.editScheduleAndRetention')
  return t('dataCollector.settings.editConfig')
})

const savingSection = computed(() => {
  if (props.editSection === 'schedule') return savingSchedule.value
  return false
})

const canGoNextFromStep1 = computed(() => true)

const canGoNextFromStep2 = computed(() => {
  if (formData.platform !== 'jira') return true
  return Array.isArray(formData.selected_project_keys) && formData.selected_project_keys.length > 0
})

function buildAuthValue() {
  const value = { base_url: formData.jira_base_url }
  value.auth = {
    auth_version: formData.jira_auth_version,
    base_url: formData.jira_base_url
  }
  if (formData.jira_auth_version === 'legacy') {
    value.auth.username = formData.jira_username
    value.auth.password = formData.jira_password
  } else {
    value.auth.email = formData.jira_email
    value.auth.api_token = formData.jira_api_token
  }
  return value
}

function buildAuthValueForPatch() {
  const v = {
    base_url: formData.jira_base_url,
    auth: {
      auth_version: formData.jira_auth_version,
      base_url: formData.jira_base_url
    }
  }
  if (formData.jira_auth_version === 'legacy') {
    v.auth.username = formData.jira_username
    v.auth.password = formData.jira_password
  } else {
    v.auth.email = formData.jira_email
    v.auth.api_token = formData.jira_api_token
  }
  return v
}

function buildSyncTargetsValueForPatch() {
  return {
    project_keys: Array.isArray(formData.selected_project_keys) ? formData.selected_project_keys : []
  }
}

function buildFullEditValueForPatch() {
  const authPatch = buildAuthValueForPatch()
  return {
    ...authPatch,
    project_keys: Array.isArray(formData.selected_project_keys) ? formData.selected_project_keys : []
  }
}

function buildScheduleValueForPatch() {
  return {
    schedule_cron: formData.schedule_cron || '0 */2 * * *',
    cleanup_cron: formData.cleanup_cron || '0 3 * * *',
    retention_days: formData.retention_days ?? 180,
    initial_range: formData.initial_range || '1m'
  }
}

function buildValue() {
  const value = {
    schedule_cron: formData.schedule_cron || '0 */2 * * *',
    cleanup_cron: formData.cleanup_cron || '0 3 * * *',
    retention_days: formData.retention_days || 180,
    initial_range: formData.initial_range || '1m',
    runtime_state: {
      first_collect_at: null,
      last_collect_start_at: null,
      last_collect_end_at: null,
      last_success_collect_at: null,
      last_validate_at: null,
      last_cleanup_at: null
    }
  }
  if (formData.platform === 'jira') {
    value.base_url = formData.jira_base_url
    value.auth = {
      auth_version: formData.jira_auth_version,
      base_url: formData.jira_base_url
    }
    if (formData.jira_auth_version === 'legacy') {
      value.auth.username = formData.jira_username
      value.auth.password = formData.jira_password
    } else {
      value.auth.email = formData.jira_email
      value.auth.api_token = formData.jira_api_token
    }
    value.project_keys = Array.isArray(formData.selected_project_keys) ? formData.selected_project_keys : []
  }
  return value
}

function applyConfig(c) {
  if (!c) return
  const v = c.value || {}
  const auth = v.auth || {}
  formData.platform = c.platform || 'jira'
  formData.key = c.key || ''
  formData.is_enabled = c.is_enabled !== false
  formData.jira_auth_version = auth.auth_version || 'legacy'
  formData.jira_base_url = v.base_url || auth.base_url || ''
  formData.jira_username = auth.username || ''
  formData.jira_password = ''
  formData.jira_email = auth.email || ''
  formData.jira_api_token = ''
  formData.selected_project_keys = Array.isArray(v.project_keys) ? [...v.project_keys] : []
  formData.schedule_cron = v.schedule_cron || '0 */2 * * *'
  formData.cleanup_cron = v.cleanup_cron || '0 3 * * *'
  formData.retention_days = v.retention_days ?? 180
  formData.initial_range = v.initial_range || '1m'
}

watch(() => props.config, (c) => {
  applyConfig(c)
  const v = c?.value || {}
  const hasBaseUrl = !!(v.base_url || v.auth?.base_url)
  if (hasBaseUrl && (props.editSection === 'full' || props.editSection === 'sync') && formData.platform === 'jira') {
    nextTick(loadProjectsIfNeeded)
  }
}, { immediate: true })

watch(() => props.show, (visible) => {
  if (visible) {
    if (props.config) {
      applyConfig(props.config)
      currentStep.value = 1
      projects.value = []
      projectsError.value = ''
    } else {
      formData.platform = 'jira'
      formData.key = ''
      formData.is_enabled = true
      formData.jira_auth_version = 'legacy'
      formData.jira_base_url = ''
      formData.jira_username = ''
      formData.jira_password = ''
      formData.jira_email = ''
      formData.jira_api_token = ''
      formData.selected_project_keys = []
      formData.schedule_cron = '0 */2 * * *'
      formData.cleanup_cron = '0 3 * * *'
      formData.retention_days = 180
      formData.initial_range = '1m'
      currentStep.value = 1
      projects.value = []
      projectsError.value = ''
    }
  }
})

watch(
  () => [
    formData.jira_base_url,
    formData.jira_username,
    formData.jira_password,
    formData.jira_email,
    formData.jira_api_token,
    formData.jira_auth_version
  ],
  () => {
    projects.value = []
    projectsError.value = ''
  }
)

async function loadProjectsIfNeeded() {
  if (formData.platform !== 'jira') return
  if (projects.value.length > 0) return
  projectsLoading.value = true
  projectsError.value = ''
  try {
    const configUuid = props.config?.uuid ?? null
    const value = buildAuthValue()
    const res = await dataCollectorApi.fetchProjects(formData.platform, value, configUuid)
    const data = extractResponseData(res)
    projects.value = data?.projects ?? []
  } catch (e) {
    projectsError.value = extractErrorMessage(e, t('dataCollector.settings.noProjects'))
    projects.value = []
  } finally {
    projectsLoading.value = false
  }
}

watch(currentStep, (step) => {
  if (step === 2) {
    loadProjectsIfNeeded()
  }
})

watch(
  () => [props.show, props.editSection],
  ([visible, section]) => {
    if (visible && props.config && (section === 'full' || section === 'sync') && formData.platform === 'jira' && formData.jira_base_url) {
      loadProjectsIfNeeded()
    }
  },
  { immediate: true }
)

async function handleSaveSchedule() {
  savingSchedule.value = true
  try {
    const res = await dataCollectorApi.patchConfig(props.config.uuid, {
      value: buildScheduleValueForPatch(),
      is_enabled: formData.is_enabled,
      version: props.config.version
    })
    const data = extractResponseData(res)
    if (data) applyConfig(data)
    showSuccess(t('dataCollector.settings.scheduleUpdateSuccess'))
    emit('section-saved', data)
  } catch (e) {
    showError(extractErrorMessage(e, t('common.error')))
  } finally {
    savingSchedule.value = false
  }
}

async function handleSaveSection() {
  if (props.editSection === 'schedule') await handleSaveSchedule()
}

async function handleSubmit() {
  if (formData.platform === 'jira' && (!formData.selected_project_keys || formData.selected_project_keys.length === 0)) {
    showError(t('dataCollector.settings.selectAtLeastOne'))
    return
  }
  saving.value = true
  try {
    if (isFullEditMode.value) {
      await dataCollectorApi.patchConfig(props.config.uuid, {
        value: buildFullEditValueForPatch(),
        version: props.config.version
      })
      showSuccess(t('dataCollector.settings.updateSuccess'))
      emit('section-saved', null)
      emit('close')
    } else {
      const keyTrimmed = (formData.key || '').trim()
      if (!keyTrimmed) {
        showError(t('dataCollector.settings.keyRequired'))
        return
      }
      const value = buildValue()
      if (props.config) {
        await dataCollectorApi.patchConfig(props.config.uuid, {
          key: keyTrimmed,
          value,
          is_enabled: formData.is_enabled,
          version: props.config.version
        })
        showSuccess(t('dataCollector.settings.updateSuccess'))
      } else {
        await dataCollectorApi.createConfig({
          platform: formData.platform,
          key: keyTrimmed,
          value,
          is_enabled: formData.is_enabled
        })
        showSuccess(t('dataCollector.settings.createSuccess'))
      }
      emit('saved')
      emit('close')
    }
  } catch (e) {
    const msg = extractErrorMessage(e, t('common.error'))
    showError(msg)
  } finally {
    saving.value = false
  }
}
</script>
