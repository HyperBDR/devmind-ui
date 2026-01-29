<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto space-y-4">
      <h2 class="text-lg font-semibold text-gray-900">
        {{ t('cloudBilling.alerts.rules.title') }}
      </h2>
      <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <p class="text-sm text-gray-600">
          {{ t('cloudBilling.alerts.rules.comingSoon') }}
        </p>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import AppLayout from '@/components/layout/AppLayout.vue'

const { t } = useI18n()
</script>
