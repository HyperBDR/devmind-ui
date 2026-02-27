<template>
  <BaseModal
    :show="show"
    :title="provider ? t('cloudBilling.providers.editProvider') : t('cloudBilling.providers.createProvider')"
    @close="$emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Basic Information Section -->
      <div class="space-y-3 border-b border-gray-200 pb-4">
        <h4 class="text-sm font-semibold text-gray-900">
          {{ t('cloudBilling.providers.basicInfo') }}
        </h4>

        <!-- Provider Type -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
          <div class="md:col-span-1">
            <label
              for="providerType"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              {{ t('cloudBilling.providers.type') }}
            </label>
            <p class="text-xs text-gray-500 mb-2 md:mb-0">
              {{ t('cloudBilling.providers.typeDesc') }}
            </p>
          </div>
          <div class="md:col-span-2">
            <select
              id="providerType"
              v-model="formData.provider_type"
              required
              class="block w-full px-3 py-2 text-sm border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="aws">{{ t('cloudBilling.providers.types.aws') }}</option>
              <option value="huawei">{{ t('cloudBilling.providers.types.huawei') }}</option>
              <option value="huawei-intl">{{ t('cloudBilling.providers.types.huaweiIntl') }}</option>
              <option value="alibaba">{{ t('cloudBilling.providers.types.alibaba') }}</option>
              <option value="azure">{{ t('cloudBilling.providers.types.azure') }}</option>
            </select>
          </div>
        </div>

        <!-- Notes -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
          <div class="md:col-span-1">
            <label
              for="notes"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              {{ t('cloudBilling.providers.notes') }}
            </label>
            <p class="text-xs text-gray-500 mb-2 md:mb-0">
              {{ t('cloudBilling.providers.notesDesc') }}
            </p>
          </div>
          <div class="md:col-span-2">
            <textarea
              id="notes"
              v-model="formData.notes"
              rows="3"
              :placeholder="t('cloudBilling.providers.notesPlaceholder')"
              class="block w-full px-3 py-2 text-sm border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            ></textarea>
          </div>
        </div>

        <!-- Status -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
          <div class="md:col-span-1">
            <label
              for="isActive"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              {{ t('cloudBilling.providers.isActive') }}
            </label>
            <p class="text-xs text-gray-500 mb-2 md:mb-0">
              {{ t('cloudBilling.providers.isActiveDesc') }}
            </p>
          </div>
          <div class="md:col-span-2">
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                id="isActive"
                v-model="formData.is_active"
                type="checkbox"
                class="sr-only peer"
              />
              <div
                class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"
              ></div>
              <span class="ml-3 text-sm text-gray-700">
                {{ formData.is_active ? t('common.enabled') : t('common.disabled') }}
              </span>
            </label>
          </div>
        </div>
      </div>

      <!-- Authentication Configuration Section -->
      <div class="space-y-3 border-b border-gray-200 pb-4">
        <h4 class="text-sm font-semibold text-gray-900">
          {{ t('cloudBilling.providers.authConfig') }}
        </h4>

        <!-- AWS Configuration -->
        <template v-if="formData.provider_type === 'aws'">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
            <div class="md:col-span-1">
              <label
                for="awsAccessKeyId"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                {{ t('cloudBilling.providers.awsAccessKeyId') }}
              </label>
              <p class="text-xs text-gray-500 mb-2 md:mb-0">
                {{ t('cloudBilling.providers.awsAccessKeyIdDesc') }}
              </p>
            </div>
            <div class="md:col-span-2">
              <BaseInput
                id="awsAccessKeyId"
                v-model="configFields.aws_access_key_id"
                type="text"
                :placeholder="t('cloudBilling.providers.awsAccessKeyIdPlaceholder')"
                required
                class="w-full"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
            <div class="md:col-span-1">
              <label
                for="awsSecretAccessKey"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                {{ t('cloudBilling.providers.awsSecretAccessKey') }}
              </label>
              <p class="text-xs text-gray-500 mb-2 md:mb-0">
                {{ t('cloudBilling.providers.awsSecretAccessKeyDesc') }}
              </p>
            </div>
            <div class="md:col-span-2">
              <BaseInput
                id="awsSecretAccessKey"
                v-model="configFields.aws_secret_access_key"
                type="password"
                :placeholder="t('cloudBilling.providers.awsSecretAccessKeyPlaceholder')"
                required
                class="w-full"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
            <div class="md:col-span-1">
              <label
                for="awsRegion"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                {{ t('cloudBilling.providers.awsRegion') }}
              </label>
              <p class="text-xs text-gray-500 mb-2 md:mb-0">
                {{ t('cloudBilling.providers.awsRegionDesc') }}
              </p>
            </div>
            <div class="md:col-span-2">
              <BaseInput
                id="awsRegion"
                v-model="configFields.aws_region"
                type="text"
                :placeholder="t('cloudBilling.providers.awsRegionPlaceholder')"
                required
                class="w-full"
              />
            </div>
          </div>
        </template>

        <!-- Huawei Configuration -->
        <template v-if="formData.provider_type === 'huawei' || formData.provider_type === 'huawei-intl'">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
            <div class="md:col-span-1">
              <label
                for="huaweiAccessKeyId"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                {{ t('cloudBilling.providers.huaweiAccessKeyId') }}
              </label>
              <p class="text-xs text-gray-500 mb-2 md:mb-0">
                {{ t('cloudBilling.providers.huaweiAccessKeyIdDesc') }}
              </p>
            </div>
            <div class="md:col-span-2">
              <BaseInput
                id="huaweiAccessKeyId"
                v-model="configFields.huawei_access_key_id"
                type="text"
                :placeholder="t('cloudBilling.providers.huaweiAccessKeyIdPlaceholder')"
                required
                class="w-full"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
            <div class="md:col-span-1">
              <label
                for="huaweiSecretAccessKey"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                {{ t('cloudBilling.providers.huaweiSecretAccessKey') }}
              </label>
              <p class="text-xs text-gray-500 mb-2 md:mb-0">
                {{ t('cloudBilling.providers.huaweiSecretAccessKeyDesc') }}
              </p>
            </div>
            <div class="md:col-span-2">
              <BaseInput
                id="huaweiSecretAccessKey"
                v-model="configFields.huawei_secret_access_key"
                type="password"
                :placeholder="t('cloudBilling.providers.huaweiSecretAccessKeyPlaceholder')"
                required
                class="w-full"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
            <div class="md:col-span-1">
              <label
                for="huaweiRegion"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                {{ t('cloudBilling.providers.huaweiRegion') }}
              </label>
              <p class="text-xs text-gray-500 mb-2 md:mb-0">
                {{ t('cloudBilling.providers.huaweiRegionDesc') }}
              </p>
            </div>
            <div class="md:col-span-2">
              <BaseInput
                id="huaweiRegion"
                v-model="configFields.huawei_region"
                type="text"
                :placeholder="t('cloudBilling.providers.huaweiRegionPlaceholder')"
                required
                class="w-full"
              />
            </div>
          </div>
        </template>

        <!-- Azure Configuration -->
        <template v-if="formData.provider_type === 'azure'">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
            <div class="md:col-span-1">
              <label
                for="azureClientId"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                {{ t('cloudBilling.providers.azureClientId') }}
              </label>
              <p class="text-xs text-gray-500 mb-2 md:mb-0">
                {{ t('cloudBilling.providers.azureClientIdDesc') }}
              </p>
            </div>
            <div class="md:col-span-2">
              <BaseInput
                id="azureClientId"
                v-model="configFields.azure_client_id"
                type="text"
                :placeholder="t('cloudBilling.providers.azureClientIdPlaceholder')"
                required
                class="w-full"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
            <div class="md:col-span-1">
              <label
                for="azureClientSecret"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                {{ t('cloudBilling.providers.azureClientSecret') }}
              </label>
              <p class="text-xs text-gray-500 mb-2 md:mb-0">
                {{ t('cloudBilling.providers.azureClientSecretDesc') }}
              </p>
            </div>
            <div class="md:col-span-2">
              <BaseInput
                id="azureClientSecret"
                v-model="configFields.azure_client_secret"
                type="password"
                :placeholder="t('cloudBilling.providers.azureClientSecretPlaceholder')"
                required
                class="w-full"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
            <div class="md:col-span-1">
              <label
                for="azureTenantId"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                {{ t('cloudBilling.providers.azureTenantId') }}
              </label>
              <p class="text-xs text-gray-500 mb-2 md:mb-0">
                {{ t('cloudBilling.providers.azureTenantIdDesc') }}
              </p>
            </div>
            <div class="md:col-span-2">
              <BaseInput
                id="azureTenantId"
                v-model="configFields.azure_tenant_id"
                type="text"
                :placeholder="t('cloudBilling.providers.azureTenantIdPlaceholder')"
                required
                class="w-full"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
            <div class="md:col-span-1">
              <label
                for="azureSubscriptionId"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                {{ t('cloudBilling.providers.azureSubscriptionId') }}
              </label>
              <p class="text-xs text-gray-500 mb-2 md:mb-0">
                {{ t('cloudBilling.providers.azureSubscriptionIdDesc') }}
              </p>
            </div>
            <div class="md:col-span-2">
              <BaseInput
                id="azureSubscriptionId"
                v-model="configFields.azure_subscription_id"
                type="text"
                :placeholder="t('cloudBilling.providers.azureSubscriptionIdPlaceholder')"
                required
                class="w-full"
              />
            </div>
          </div>
        </template>

        <!-- Alibaba Configuration -->
        <template v-if="formData.provider_type === 'alibaba'">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
            <div class="md:col-span-1">
              <label
                for="alibabaAccessKeyId"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                {{ t('cloudBilling.providers.alibabaAccessKeyId') }}
              </label>
              <p class="text-xs text-gray-500 mb-2 md:mb-0">
                {{ t('cloudBilling.providers.alibabaAccessKeyIdDesc') }}
              </p>
            </div>
            <div class="md:col-span-2">
              <BaseInput
                id="alibabaAccessKeyId"
                v-model="configFields.alibaba_access_key_id"
                type="text"
                :placeholder="t('cloudBilling.providers.alibabaAccessKeyIdPlaceholder')"
                required
                class="w-full"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
            <div class="md:col-span-1">
              <label
                for="alibabaSecretAccessKey"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                {{ t('cloudBilling.providers.alibabaSecretAccessKey') }}
              </label>
              <p class="text-xs text-gray-500 mb-2 md:mb-0">
                {{ t('cloudBilling.providers.alibabaSecretAccessKeyDesc') }}
              </p>
            </div>
            <div class="md:col-span-2">
              <BaseInput
                id="alibabaSecretAccessKey"
                v-model="configFields.alibaba_secret_access_key"
                type="password"
                :placeholder="t('cloudBilling.providers.alibabaSecretAccessKeyPlaceholder')"
                required
                class="w-full"
              />
            </div>
          </div>
        </template>
      </div>

      <!-- Alert Rule Section -->
      <div v-if="showAlertRule" class="space-y-3 border-t border-gray-200 pt-4">
        <h4 class="text-sm font-semibold text-gray-900 mb-3">
          {{ t('cloudBilling.settings.alertRule.title') }}
        </h4>

        <!-- Enable Alert Rule -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
          <div class="md:col-span-1">
            <label
              for="alertRuleEnabled"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              {{ t('cloudBilling.settings.alertRule.enable') }}
            </label>
            <p class="text-xs text-gray-500 mb-2 md:mb-0">
              {{ t('cloudBilling.settings.alertRule.enableDesc') }}
            </p>
          </div>
          <div class="md:col-span-2">
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                id="alertRuleEnabled"
                v-model="alertRuleData.is_active"
                type="checkbox"
                class="sr-only peer"
              />
              <div
                class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"
              ></div>
              <span class="ml-3 text-sm text-gray-700">
                {{ alertRuleData.is_active ? t('common.enabled') : t('common.disabled') }}
              </span>
            </label>
          </div>
        </div>

        <!-- Alert Notification Channel (only when alert is enabled) -->
        <div
          v-if="alertRuleData.is_active"
          class="space-y-3"
        >
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
            <div class="md:col-span-1">
              <label
                for="alertChannelUuid"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                {{ t('cloudBilling.providers.alertChannelLabel') }}
              </label>
              <p class="text-xs text-gray-500 mb-2 md:mb-0">
                {{ t('cloudBilling.providers.alertChannelDesc') }}
              </p>
            </div>
            <div class="md:col-span-2">
              <select
                id="alertChannelUuid"
                v-model="selectedChannelValue"
                required
                :disabled="channelsLoading"
                class="block w-full px-3 py-2 text-sm border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="" disabled>
                  {{
                    channelsLoading
                      ? t('common.loading')
                      : t('cloudBilling.providers.alertChannelPlaceholder')
                  }}
                </option>
                <option
                  v-for="ch in allChannels"
                  :key="`${resolveChannelType(ch)}:${ch.uuid}`"
                  :value="`${resolveChannelType(ch)}:${ch.uuid}`"
                >
                  {{ getChannelOptionLabel(ch) }}
                </option>
              </select>
              <p
                v-if="channelsLoading"
                class="text-xs text-gray-500 mt-1"
              >
                {{ t('common.loading') }}
              </p>
              <p
                v-if="!channelsLoading && allChannels.length === 0"
                class="text-xs text-gray-500 mt-1"
              >
                {{ t('cloudBilling.providers.alertChannelEmptyHint') }}
              </p>
            </div>
          </div>
          <div
            v-if="isEmailChannelSelected"
            class="grid grid-cols-1 md:grid-cols-3 gap-3 items-start"
          >
            <div class="md:col-span-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('cloudBilling.providers.alertEmailRecipients') }}
              </label>
              <p class="text-xs text-gray-500 mb-2 md:mb-0">
                {{ t('cloudBilling.providers.alertEmailRecipientsDesc3') }}
              </p>
            </div>
            <div class="md:col-span-2 space-y-2">
              <BaseInput
                v-for="i in 3"
                :key="i"
                v-model="emailToRecipients[i - 1]"
                type="email"
                :placeholder="t('cloudBilling.providers.alertEmailRecipientsPlaceholder')"
                class="w-full"
              />
            </div>
          </div>
        </div>

        <template v-if="alertRuleData.is_active">
          <!-- Cost Threshold -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
            <div class="md:col-span-1">
              <label
                for="costThreshold"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                {{ t('cloudBilling.settings.alertRule.costThreshold') }}
              </label>
              <p class="text-xs text-gray-500 mb-2 md:mb-0">
                {{ t('cloudBilling.settings.alertRule.costThresholdDesc') }}
              </p>
            </div>
            <div class="md:col-span-2">
              <BaseInput
                id="costThreshold"
                v-model="alertRuleData.cost_threshold"
                type="number"
                step="0.01"
                min="0"
                :placeholder="t('cloudBilling.settings.alertRule.costThresholdPlaceholder')"
                class="w-full"
              />
            </div>
          </div>

          <!-- Growth Threshold (Percentage) -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
            <div class="md:col-span-1">
              <label
                for="growthThreshold"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                {{ t('cloudBilling.settings.alertRule.growthThreshold') }}
              </label>
              <p class="text-xs text-gray-500 mb-2 md:mb-0">
                {{ t('cloudBilling.settings.alertRule.growthThresholdDesc') }}
              </p>
            </div>
            <div class="md:col-span-2">
              <BaseInput
                id="growthThreshold"
                v-model="alertRuleData.growth_threshold"
                type="number"
                step="0.01"
                min="0"
                max="100"
                :placeholder="t('cloudBilling.settings.alertRule.growthThresholdPlaceholder')"
                class="w-full"
              />
              <p class="text-xs text-gray-500 mt-1">
                {{ t('cloudBilling.settings.alertRule.growthThresholdNote') }}
              </p>
            </div>
          </div>

          <!-- Growth Amount Threshold -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
            <div class="md:col-span-1">
              <label
                for="growthAmountThreshold"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                {{ t('cloudBilling.settings.alertRule.growthAmountThreshold') }}
              </label>
              <p class="text-xs text-gray-500 mb-2 md:mb-0">
                {{ t('cloudBilling.settings.alertRule.growthAmountThresholdDesc') }}
              </p>
            </div>
            <div class="md:col-span-2">
              <BaseInput
                id="growthAmountThreshold"
                v-model="alertRuleData.growth_amount_threshold"
                type="number"
                step="0.01"
                min="0"
                :placeholder="t('cloudBilling.settings.alertRule.growthAmountThresholdPlaceholder')"
                class="w-full"
              />
            </div>
          </div>

          <div class="rounded-md bg-blue-50 p-3 border border-blue-200">
            <p class="text-xs text-blue-800">
              {{ t('cloudBilling.settings.alertRule.note') }}
            </p>
          </div>
        </template>
      </div>

      <!-- Validation Messages -->
      <div v-if="validationErrors.length > 0" class="rounded-md bg-red-50 p-2.5">
        <div class="flex gap-2">
          <div class="flex-shrink-0 pt-0.5">
            <svg
              class="h-4 w-4 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="flex-1">
            <p class="text-xs font-medium text-red-800 mb-1">
              {{ t('cloudBilling.providers.validationErrors') }}
            </p>
            <div class="text-xs text-red-700 space-y-1">
              <div v-for="(error, index) in validationErrors" :key="index">
                {{ error }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="validationSuccess" class="rounded-md bg-green-50 p-2.5">
        <div class="flex gap-2">
          <div class="flex-shrink-0 pt-0.5">
            <svg
              class="h-4 w-4 text-green-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="flex-1">
            <p class="text-xs font-medium text-green-800">
              {{ validationSuccess }}
            </p>
          </div>
        </div>
      </div>
    </form>

    <template #footer>
      <div class="flex flex-col-reverse sm:flex-row justify-end gap-3">
        <BaseButton
          variant="outline"
          @click="$emit('close')"
          class="w-full sm:w-auto"
        >
          {{ t('common.cancel') }}
        </BaseButton>
        <BaseButton
          v-if="!props.provider"
          type="button"
          variant="secondary"
          :loading="validating"
          :disabled="validating || saving"
          @click="handleValidate"
          class="w-full sm:w-auto"
        >
          {{ validating ? t('common.loading') : t('cloudBilling.providers.validateConfig') }}
        </BaseButton>
        <BaseButton
          :loading="saving"
          :disabled="saving || validating || (!props.provider && !isValidated)"
          @click="handleSubmit"
          :title="!props.provider && !isValidated ? t('cloudBilling.providers.pleaseValidateConfigFirst') : ''"
          class="w-full sm:w-auto"
        >
          {{ saving ? t('common.saving') : t('common.save') }}
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, watch, reactive, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from '@/composables/useToast'
import { extractResponseData } from '@/utils/api'
import { cloudBillingApi } from '@/api/cloudBilling'
import { notificationsAdminApi } from '@/api/notificationsAdmin'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  provider: {
    type: Object,
    default: null
  },
  showAlertRule: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close', 'saved'])

const { t } = useI18n()
const { showSuccess, showError } = useToast()
const saving = ref(false)
const validating = ref(false)
const isValidated = ref(false)
const validationErrors = ref([])
const validationSuccess = ref('')

const formData = reactive({
  name: '',
  provider_type: 'aws',
  display_name: '',
  notes: '',
  is_active: true,
})

// Auto-generate name based on provider_type and display_name
const generateName = (providerType, displayName) => {
  if (!displayName) return ''
  
  // Convert display name to lowercase and replace spaces/special chars with underscores
  const baseName = displayName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
  
  // Add provider type prefix if not already present
  const typePrefix = providerType.replace('-', '_')
  if (baseName.startsWith(typePrefix)) {
    return baseName
  }
  return `${typePrefix}_${baseName}`
}

const configFields = reactive({
  aws_access_key_id: '',
  aws_secret_access_key: '',
  aws_region: '',
  huawei_access_key_id: '',
  huawei_secret_access_key: '',
  huawei_region: '',
  azure_client_id: '',
  azure_client_secret: '',
  azure_tenant_id: '',
  azure_subscription_id: '',
  alibaba_access_key_id: '',
  alibaba_secret_access_key: '',
})

const alertRuleData = reactive({
  is_active: false,
  cost_threshold: '',
  growth_threshold: '',
  growth_amount_threshold: '',
})

const existingAlertRuleId = ref(null)
const allChannels = ref([])
const channelsLoading = ref(false)
const selectedChannelValue = ref('')
const emailToRecipients = ref(['', '', ''])
const pendingChannelUuid = ref('')

// Watch provider_type to auto-generate display_name and name
watch(() => formData.provider_type, (type) => {
  if (!props.provider) {
    // Auto-generate display_name based on provider_type
    const typeLabels = {
      'aws': t('cloudBilling.providers.types.aws'),
      'huawei': t('cloudBilling.providers.types.huawei'),
      'huawei-intl': t('cloudBilling.providers.types.huaweiIntl'),
      'alibaba': t('cloudBilling.providers.types.alibaba'),
      'azure': t('cloudBilling.providers.types.azure')
    }
    formData.display_name = typeLabels[type] || type
    formData.name = generateName(type, formData.display_name)
  }
  // Reset validation when provider type changes
  isValidated.value = false
  validationErrors.value = []
  validationSuccess.value = ''
}, { immediate: false })

// Reset validation when config fields change
watch(() => [
  configFields.aws_access_key_id,
  configFields.aws_secret_access_key,
  configFields.aws_region,
  configFields.huawei_access_key_id,
  configFields.huawei_secret_access_key,
  configFields.huawei_region,
  configFields.azure_client_id,
  configFields.azure_client_secret,
  configFields.azure_tenant_id,
  configFields.azure_subscription_id,
  configFields.alibaba_access_key_id,
  configFields.alibaba_secret_access_key,
], () => {
  if (!props.provider) {
    isValidated.value = false
    validationErrors.value = []
    validationSuccess.value = ''
  }
})

watch(() => props.provider, async (newProvider) => {
  if (newProvider) {
    formData.name = newProvider.name || ''
    formData.provider_type = newProvider.provider_type || 'aws'
    formData.display_name = newProvider.display_name || newProvider.provider_type || 'aws'
    formData.notes = newProvider.notes || ''
    formData.is_active = newProvider.is_active ?? true

    const config = newProvider.config || {}
    const notification = config.notification
    const channelUuid = getNotificationChannelUuid(notification)
    if (channelUuid) {
      applyNotificationSelection(notification)
      const to = notification.email_to
      if (Array.isArray(to) && to.length) {
        emailToRecipients.value = [
          (to[0] || '').trim(),
          (to[1] || '').trim(),
          (to[2] || '').trim(),
        ]
      } else {
        emailToRecipients.value = ['', '', '']
      }
    } else {
      selectedChannelValue.value = ''
      pendingChannelUuid.value = ''
      emailToRecipients.value = ['', '', '']
    }
    if (newProvider.provider_type === 'aws') {
      configFields.aws_access_key_id = config.AWS_ACCESS_KEY_ID || ''
      configFields.aws_secret_access_key = config.AWS_SECRET_ACCESS_KEY || ''
      configFields.aws_region = config.AWS_REGION || ''
    } else if (newProvider.provider_type === 'huawei' || newProvider.provider_type === 'huawei-intl') {
      configFields.huawei_access_key_id = config.HUAWEI_ACCESS_KEY_ID || ''
      configFields.huawei_secret_access_key = config.HUAWEI_SECRET_ACCESS_KEY || ''
      configFields.huawei_region = config.HUAWEI_REGION || ''
    } else if (newProvider.provider_type === 'azure') {
      configFields.azure_client_id = config.AZURE_CLIENT_ID || ''
      configFields.azure_client_secret = config.AZURE_CLIENT_SECRET || ''
      configFields.azure_tenant_id = config.AZURE_TENANT_ID || ''
      configFields.azure_subscription_id = config.AZURE_SUBSCRIPTION_ID || ''
    } else if (newProvider.provider_type === 'alibaba') {
      configFields.alibaba_access_key_id = config.ALIBABA_ACCESS_KEY_ID || ''
      configFields.alibaba_secret_access_key = config.ALIBABA_SECRET_ACCESS_KEY || ''
    }

    // Load alert rule if exists and showAlertRule is true
    if (props.showAlertRule) {
      try {
        const alertRulesResponse = await cloudBillingApi.getAlertRules({ provider_id: newProvider.id })
        const alertRulesData = extractResponseData(alertRulesResponse)
        const rules = Array.isArray(alertRulesData) 
          ? alertRulesData 
          : (alertRulesData?.results || alertRulesData?.list || [])
        
        if (rules.length > 0) {
          const rule = rules[0]
          existingAlertRuleId.value = rule.id
          alertRuleData.is_active = rule.is_active ?? false
          alertRuleData.cost_threshold = rule.cost_threshold || ''
          alertRuleData.growth_threshold = rule.growth_threshold || ''
          alertRuleData.growth_amount_threshold = rule.growth_amount_threshold || ''
        } else {
          existingAlertRuleId.value = null
          alertRuleData.is_active = false
          alertRuleData.cost_threshold = ''
          alertRuleData.growth_threshold = ''
          alertRuleData.growth_amount_threshold = ''
        }
      } catch (error) {
        console.error('Failed to load alert rule:', error)
        existingAlertRuleId.value = null
        alertRuleData.is_active = false
        alertRuleData.cost_threshold = ''
        alertRuleData.growth_threshold = ''
        alertRuleData.growth_amount_threshold = ''
      }
    }
  } else {
    const typeLabels = {
      'aws': t('cloudBilling.providers.types.aws'),
      'huawei': t('cloudBilling.providers.types.huawei'),
      'huawei-intl': t('cloudBilling.providers.types.huaweiIntl'),
      'alibaba': t('cloudBilling.providers.types.alibaba'),
      'azure': t('cloudBilling.providers.types.azure')
    }
    Object.assign(formData, {
      name: '',
      provider_type: 'aws',
      display_name: typeLabels['aws'] || 'aws',
      notes: '',
      is_active: true,
    })
    Object.assign(configFields, {
      aws_access_key_id: '',
      aws_secret_access_key: '',
      aws_region: '',
      huawei_access_key_id: '',
      huawei_secret_access_key: '',
      huawei_region: '',
      azure_client_id: '',
      azure_client_secret: '',
      azure_tenant_id: '',
      azure_subscription_id: '',
      alibaba_access_key_id: '',
      alibaba_secret_access_key: '',
    })
    existingAlertRuleId.value = null
    alertRuleData.is_active = false
    alertRuleData.cost_threshold = ''
    alertRuleData.growth_threshold = ''
    alertRuleData.growth_amount_threshold = ''
    selectedChannelValue.value = ''
    pendingChannelUuid.value = ''
    emailToRecipients.value = ['', '', '']
  }
}, { immediate: true })

const isEmailChannelSelected = computed(() =>
  (selectedChannelValue.value || '').startsWith('email:')
)

function normalizeChannelType(value) {
  const type = String(value || '').trim().toLowerCase()
  if (type === 'email' || type === 'webhook') {
    return type
  }
  return ''
}

function resolveChannelType(channel) {
  const direct = normalizeChannelType(channel?.channel_type || channel?.type)
  if (direct) {
    return direct
  }
  const cfg = channel?.config || {}
  if (cfg.smtp_host || cfg.from_email || cfg.smtp_user) {
    return 'email'
  }
  return 'webhook'
}

function applyNotificationSelection(notification) {
  const n = notification && typeof notification === 'object' ? notification : {}
  const channelUuid = getNotificationChannelUuid(n)
  const channelType = normalizeChannelType(n.type || n.channel_type || n.notification_type)

  if (!channelUuid) {
    selectedChannelValue.value = ''
    pendingChannelUuid.value = ''
    return
  }

  if (channelType) {
    selectedChannelValue.value = `${channelType}:${channelUuid}`
    pendingChannelUuid.value = ''
    return
  }

  const matched = allChannels.value.find((ch) => String(ch?.uuid || '') === channelUuid)
  if (matched) {
    selectedChannelValue.value = `${resolveChannelType(matched)}:${channelUuid}`
    pendingChannelUuid.value = ''
    return
  }

  selectedChannelValue.value = ''
  pendingChannelUuid.value = channelUuid
}

function getNotificationChannelUuid(notification) {
  const n = notification && typeof notification === 'object' ? notification : {}
  return String(
    n.channel_uuid ||
    n.channelUuid ||
    n.channel_id ||
    n.channelId ||
    n.uuid ||
    n.id ||
    ''
  ).trim()
}

async function loadChannels() {
  channelsLoading.value = true
  try {
    const channelRes = await notificationsAdminApi.getChannels()
    let rawList = []
    if (Array.isArray(channelRes)) {
      rawList = channelRes
    } else if (Array.isArray(channelRes?.results)) {
      rawList = channelRes.results
    } else if (Array.isArray(channelRes?.list)) {
      rawList = channelRes.list
    } else if (Array.isArray(channelRes?.items)) {
      rawList = channelRes.items
    } else if (Array.isArray(channelRes?.data)) {
      rawList = channelRes.data
    } else if (Array.isArray(channelRes?.data?.results)) {
      rawList = channelRes.data.results
    } else if (Array.isArray(channelRes?.data?.list)) {
      rawList = channelRes.data.list
    } else if (Array.isArray(channelRes?.data?.items)) {
      rawList = channelRes.data.items
    }
    allChannels.value = rawList.filter((ch) => {
      const type = resolveChannelType(ch)
      return type === 'webhook' || type === 'email'
    })
    if (pendingChannelUuid.value) {
      const matched = allChannels.value.find((ch) => String(ch?.uuid || '') === pendingChannelUuid.value)
      if (matched) {
        selectedChannelValue.value = `${resolveChannelType(matched)}:${pendingChannelUuid.value}`
        pendingChannelUuid.value = ''
      }
    }
  } catch (err) {
    console.error('Failed to load channels:', err)
    allChannels.value = []
  } finally {
    channelsLoading.value = false
  }
}

watch(() => props.show, (visible) => {
  if (visible) {
    loadChannels()
  }
})
onMounted(() => {
  if (props.show) {
    loadChannels()
  }
})

function getChannelOptionLabel(ch) {
  const name = (ch.name || '').trim() || t('cloudBilling.providers.channelUnnamed')
  const channelType = resolveChannelType(ch)
  const typeLabel = channelType === 'email'
    ? t('cloudBilling.providers.channelTypeEmail')
    : t('cloudBilling.providers.channelTypeWebhook')
  const cfg = ch.config || {}
  if (channelType === 'email') {
    const host = (cfg.smtp_host || '').trim()
    const hint = host ? ` · ${host}` : ''
    return `${name} (${typeLabel})${hint}`
  }
  const provider = (cfg.provider || cfg.provider_type || 'webhook').toLowerCase()
  const url = (cfg.url || '').trim()
  const urlHint = url ? (url.length > 40 ? url.slice(0, 37) + '...' : url) : ''
  if (urlHint) {
    return `${name} (${typeLabel} · ${provider}) · ${urlHint}`
  }
  return `${name} (${typeLabel} · ${provider})`
}

const buildConfig = () => {
  const config = {}
  if (formData.provider_type === 'aws') {
    if (configFields.aws_access_key_id) {
      config.AWS_ACCESS_KEY_ID = configFields.aws_access_key_id
    }
    if (configFields.aws_secret_access_key) {
      config.AWS_SECRET_ACCESS_KEY = configFields.aws_secret_access_key
    }
    if (configFields.aws_region) {
      config.AWS_REGION = configFields.aws_region
    }
  } else if (formData.provider_type === 'huawei' || formData.provider_type === 'huawei-intl') {
    if (configFields.huawei_access_key_id) {
      config.HUAWEI_ACCESS_KEY_ID = configFields.huawei_access_key_id
    }
    if (configFields.huawei_secret_access_key) {
      config.HUAWEI_SECRET_ACCESS_KEY = configFields.huawei_secret_access_key
    }
    if (configFields.huawei_region) {
      config.HUAWEI_REGION = configFields.huawei_region
    }
    if (formData.provider_type === 'huawei-intl') {
      config.HUAWEI_IS_INTERNATIONAL = true
    }
  } else if (formData.provider_type === 'azure') {
    if (configFields.azure_client_id) {
      config.AZURE_CLIENT_ID = configFields.azure_client_id
    }
    if (configFields.azure_client_secret) {
      config.AZURE_CLIENT_SECRET = configFields.azure_client_secret
    }
    if (configFields.azure_tenant_id) {
      config.AZURE_TENANT_ID = configFields.azure_tenant_id
    }
    if (configFields.azure_subscription_id) {
      config.AZURE_SUBSCRIPTION_ID = configFields.azure_subscription_id
    }
  } else if (formData.provider_type === 'alibaba') {
    if (configFields.alibaba_access_key_id) {
      config.ALIBABA_ACCESS_KEY_ID = configFields.alibaba_access_key_id
    }
    if (configFields.alibaba_secret_access_key) {
      config.ALIBABA_SECRET_ACCESS_KEY = configFields.alibaba_secret_access_key
    }
  }
  const raw = (selectedChannelValue.value || '').trim()
  if (raw) {
    const colonIndex = raw.indexOf(':')
    const notifType = colonIndex >= 0 ? raw.slice(0, colonIndex) : 'webhook'
    const notifUuid = colonIndex >= 0 ? raw.slice(colonIndex + 1) : raw
    config.notification = {
      type: notifType,
      channel_uuid: notifUuid,
    }
    if (notifType === 'email') {
      const list = (emailToRecipients.value || [])
        .map((s) => (s || '').trim())
        .filter(Boolean)
      if (list.length) {
        config.notification.email_to = list
      }
    }
  }
  return config
}

const handleValidate = async () => {
  validating.value = true
  validationErrors.value = []
  validationSuccess.value = ''
  isValidated.value = false

  try {
    const config = buildConfig()
    const response = await cloudBillingApi.validateProviderConfig(
      formData.provider_type,
      config
    )
    const validation = extractResponseData(response)

    if (validation.valid) {
      validationSuccess.value = t('cloudBilling.providers.validationSuccess')
      if (validation.account_id) {
        validationSuccess.value += ` (${t('cloudBilling.providers.accountId')}: ${validation.account_id})`
      }
      isValidated.value = true
      setTimeout(() => {
        validationSuccess.value = ''
      }, 5000)
    } else {
      const errorCode = validation.error_code || 'validation_failed'
      const errorMessage = t(`cloudBilling.providers.validationErrorCodes.${errorCode}`, 
        t('cloudBilling.providers.validationFailed'))
      validationErrors.value = [errorMessage]
      isValidated.value = false
    }
  } catch (error) {
    console.error('Failed to validate provider config:', error)
    let errorMessage = t('cloudBilling.providers.validationFailed')
    if (error.response?.data) {
      const errorData = error.response.data
      if (errorData.message) {
        errorMessage = errorData.message
      } else if (errorData.detail) {
        errorMessage = errorData.detail
      }
    }
    validationErrors.value = [errorMessage]
    isValidated.value = false
  } finally {
    validating.value = false
  }
}

const handleSubmit = async () => {
  // Check validation for new providers
  if (!props.provider && !isValidated.value) {
    validationErrors.value = [t('cloudBilling.providers.pleaseValidateConfigFirst')]
    return
  }

  // Validate alert rule if enabled and showAlertRule is true
  if (props.showAlertRule && alertRuleData.is_active) {
    if (!alertRuleData.cost_threshold && !alertRuleData.growth_threshold && !alertRuleData.growth_amount_threshold) {
      showError(t('cloudBilling.settings.alertRule.atLeastOneThreshold'))
      return
    }
    if (!(selectedChannelValue.value || '').trim()) {
      showError(t('cloudBilling.providers.alertChannelRequired'))
      return
    }
    if (isEmailChannelSelected.value) {
      const list = (emailToRecipients.value || [])
        .map((s) => (s || '').trim())
        .filter(Boolean)
      if (list.length === 0) {
        showError(t('cloudBilling.providers.alertEmailRecipientsRequired'))
        return
      }
      const invalid = list.find((e) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))
      if (invalid) {
        showError(t('cloudBilling.providers.alertEmailRecipientsInvalid', { email: invalid }))
        return
      }
    }
  }

  saving.value = true
  let requestPayload = null
  try {
    // Auto-generate display_name and name if not editing existing provider
    if (!props.provider) {
      const typeLabels = {
        'aws': t('cloudBilling.providers.types.aws'),
        'huawei': t('cloudBilling.providers.types.huawei'),
        'huawei-intl': t('cloudBilling.providers.types.huaweiIntl'),
        'alibaba': t('cloudBilling.providers.types.alibaba'),
        'azure': t('cloudBilling.providers.types.azure')
      }
      if (!formData.display_name) {
        formData.display_name = typeLabels[formData.provider_type] || formData.provider_type
      }
      formData.name = generateName(formData.provider_type, formData.display_name)
    }
    
    // Clean up data before sending
    const data = {
      provider_type: formData.provider_type,
      display_name: formData.display_name,
      is_active: formData.is_active,
      config: buildConfig(),
    }

    // Only include name for update operations
    // For create, backend will auto-generate name from display_name
    if (props.provider && formData.name) {
      data.name = formData.name
    }

    // Only include notes if it's not empty
    if (formData.notes && formData.notes.trim()) {
      data.notes = formData.notes.trim()
    }
    requestPayload = { ...data }

    let providerId
    let successMessage
    if (props.provider) {
      await cloudBillingApi.updateProvider(props.provider.id, data)
      providerId = props.provider.id
      successMessage = t('cloudBilling.providers.updateSuccess')
    } else {
      const response = await cloudBillingApi.createProvider(data)
      const providerData = extractResponseData(response)
      providerId = providerData.id
      successMessage = t('cloudBilling.providers.createSuccess')
    }

    // Save alert rule if configured and showAlertRule is true
    if (props.showAlertRule) {
      if (alertRuleData.is_active && providerId) {
        const alertRulePayload = {
          provider: providerId,
          is_active: alertRuleData.is_active,
          cost_threshold: alertRuleData.cost_threshold ? parseFloat(alertRuleData.cost_threshold) : null,
          growth_threshold: alertRuleData.growth_threshold ? parseFloat(alertRuleData.growth_threshold) : null,
          growth_amount_threshold: alertRuleData.growth_amount_threshold ? parseFloat(alertRuleData.growth_amount_threshold) : null,
        }

        if (existingAlertRuleId.value) {
          await cloudBillingApi.updateAlertRule(existingAlertRuleId.value, alertRulePayload)
        } else {
          await cloudBillingApi.createAlertRule(alertRulePayload)
        }
      } else if (existingAlertRuleId.value && !alertRuleData.is_active) {
        // If alert rule exists but is being disabled, update it
        await cloudBillingApi.updateAlertRule(existingAlertRuleId.value, {
          provider: providerId,
          is_active: false,
          cost_threshold: null,
          growth_threshold: null,
          growth_amount_threshold: null,
        })
      }
    }

    showSuccess(successMessage)
    emit('saved')
  } catch (error) {
    console.error('Failed to save provider:', error)
    console.error('Error response data:', error.response?.data)
    console.error('Request data sent:', requestPayload)
    
    // Show more detailed error message
    let errorMessage = t('cloudBilling.providers.saveError')
    if (error.response?.data) {
      const errorData = error.response.data
      
      // Handle DRF validation errors format
      if (errorData.data) {
        // Custom JSON renderer format
        const validationErrors = errorData.data
        const errors = []
        for (const [field, messages] of Object.entries(validationErrors)) {
          if (Array.isArray(messages)) {
            errors.push(`${field}: ${messages.join(', ')}`)
          } else if (typeof messages === 'string') {
            errors.push(`${field}: ${messages}`)
          } else if (typeof messages === 'object') {
            errors.push(`${field}: ${JSON.stringify(messages)}`)
          }
        }
        if (errors.length > 0) {
          errorMessage = errors.join('; ')
        }
      } else if (errorData.message) {
        errorMessage = errorData.message
      } else if (errorData.detail) {
        errorMessage = errorData.detail
      } else if (typeof errorData === 'object') {
        // Handle direct validation errors
        const errors = []
        for (const [field, messages] of Object.entries(errorData)) {
          if (Array.isArray(messages)) {
            errors.push(`${field}: ${messages.join(', ')}`)
          } else if (typeof messages === 'string') {
            errors.push(`${field}: ${messages}`)
          } else if (typeof messages === 'object') {
            errors.push(`${field}: ${JSON.stringify(messages)}`)
          }
        }
        if (errors.length > 0) {
          errorMessage = errors.join('; ')
        }
      }
    }
    
    showError(errorMessage)
  } finally {
    saving.value = false
  }
}
</script>
