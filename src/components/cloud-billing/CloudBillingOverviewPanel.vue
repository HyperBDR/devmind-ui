<template>
  <div class="space-y-6">
    <div
      v-if="showHeader"
      class="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h2 class="text-base font-semibold tracking-tight text-gray-900">
          {{ t('cloudBilling.billing.overviewTitle') }}
        </h2>
        <p class="mt-1 text-sm text-gray-500">
          {{ t('cloudBilling.billing.overviewSubtitle') }}
        </p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <div class="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
          <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 21c4.97 0 9-3.806 9-8.5S16.97 4 12 4 3 7.806 3 12.5 7.03 21 12 21z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v17m-6-8.5h12" />
          </svg>
          <select
            v-model="selectedTimezone"
            class="bg-transparent text-xs font-medium text-gray-700 focus:outline-none"
          >
            <option v-for="item in timezones" :key="item.value" :value="item.value">
              {{ item.label }}
            </option>
          </select>
        </div>
        <div class="flex rounded-lg border border-gray-200 bg-gray-50 p-1">
          <button
            v-for="item in currencies"
            :key="item"
            class="rounded-md px-3 py-1.5 text-xs font-semibold transition-colors"
            :class="selectedCurrency === item ? 'bg-primary-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'"
            @click="selectedCurrency = item"
          >
            {{ item }}
          </button>
        </div>
        <BaseButton variant="outline" size="sm" :loading="loading" @click="loadOverview">
          {{ t('common.refresh') }}
        </BaseButton>
      </div>
    </div>

    <div v-if="error" class="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      {{ error }}
    </div>

    <BaseLoading v-if="loading && !overviewLoaded" />

    <template v-else>
      <section class="grid gap-6 lg:grid-cols-4">
        <div class="space-y-6 lg:col-span-3">
          <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <article
              v-for="card in summaryCards"
              :key="card.key"
              class="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-colors hover:border-gray-300"
            >
              <div class="mb-4 flex items-center justify-between">
                <span class="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400">
                  {{ card.label }}
                </span>
                <div class="rounded-lg bg-gray-50 p-2 text-gray-400 transition-colors group-hover:bg-primary-50 group-hover:text-primary-600">
                  <component :is="card.icon" class="h-4 w-4" />
                </div>
              </div>
              <div class="text-2xl font-bold tracking-tight text-gray-900">
                {{ card.value }}
              </div>
              <div v-if="card.subValue" class="mt-1 text-xs text-gray-500">
                {{ card.subValue }}
              </div>
            </article>
          </div>

          <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 class="text-sm font-semibold text-gray-900">
                  {{ t('cloudBilling.billing.overviewCostTrend') }}
                </h3>
                <p class="mt-1 text-xs text-gray-500">
                  {{ t('cloudBilling.billing.overviewCostTrendHint') }}
                </p>
              </div>
              <div class="flex items-center gap-3">
                <div class="flex rounded-lg border border-gray-200 bg-gray-50 p-1">
                  <button
                    v-for="range in trendRanges"
                    :key="range"
                    class="rounded-md px-3 py-1.5 text-xs font-semibold transition-colors"
                    :class="selectedTrendRange === range ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
                    @click="selectedTrendRange = range"
                  >
                    {{ t(`cloudBilling.billing.overviewTrendRange${capitalizeRange(range)}`) }}
                  </button>
                </div>
                <div class="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-semibold text-gray-500">
                  {{ t('cloudBilling.billing.overviewMixedCurrency') }}
                </div>
              </div>
            </div>
            <div class="h-[320px]">
              <Line
                v-if="trendChartData"
                :key="trendChartRenderKey"
                :data="trendChartData"
                :options="trendChartOptions"
              />
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div class="mb-5">
              <h3 class="text-sm font-semibold text-gray-900">
                {{ t('cloudBilling.billing.overviewCurrencyDistribution') }}
              </h3>
              <p class="mt-1 text-xs text-gray-500">
                {{ t('cloudBilling.billing.overviewCurrencyDistributionHint') }}
              </p>
            </div>
            <div class="mx-auto h-[200px] max-w-[220px]">
              <Doughnut v-if="currencyChartData" :data="currencyChartData" :options="currencyChartOptions" />
            </div>
            <div class="mt-6 space-y-4">
              <div v-for="item in overview.currency_breakdown" :key="item.code" class="space-y-2">
                <div class="flex items-center justify-between text-xs">
                  <div class="flex items-center gap-2">
                    <span class="h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: item.color }" />
                    <span class="font-medium text-gray-600">{{ item.code }} · {{ item.name }}</span>
                  </div>
                  <span class="font-mono font-semibold text-gray-900">
                    {{ formatBreakdownValue(item) }}
                  </span>
                </div>
                <div class="h-1.5 overflow-hidden rounded-full bg-gray-100">
                  <div class="h-full rounded-full" :style="{ width: `${item.percentage}%`, backgroundColor: item.color }" />
                </div>
              </div>
            </div>
            <div class="mt-6 rounded-lg border border-primary-100 bg-primary-50 p-4">
              <div class="flex items-start gap-3">
                <svg class="mt-0.5 h-4 w-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12A9 9 0 103 12a9 9 0 0018 0z" />
                </svg>
                <div class="min-w-0 flex-1">
                  <div class="text-xs font-semibold text-primary-900">
                    {{ t('cloudBilling.billing.overviewExchangeRate') }}
                  </div>
                  <div class="mt-1 text-[11px] leading-5 text-primary-700">
                    1 USD = {{ overview.exchange_rate }} CNY
                  </div>
                  <div class="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-primary-100 pt-3 text-[11px]">
                    <span class="text-primary-600">{{ overview.rate_source_label }}</span>
                    <span class="font-mono font-medium text-primary-800">{{ formatTime(overview.rate_collected_at) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div class="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div class="flex flex-wrap items-center gap-4">
            <div>
              <h3 class="text-sm font-semibold text-gray-900">
                {{ t('cloudBilling.billing.overviewFinancialHealth') }}
              </h3>
              <p class="mt-1 text-xs text-gray-500">
                {{ t('cloudBilling.billing.overviewFinancialHealthHint') }}
              </p>
            </div>
            <div class="hidden h-4 w-px bg-gray-200 md:block" />
            <div class="text-xs text-gray-500">
              {{ t('cloudBilling.billing.overviewTotalFunds') }}
              <span class="ml-1 font-mono font-semibold text-emerald-600">{{ formatValue(overview.financial_health.total_funds) }}</span>
            </div>
            <div class="text-xs text-gray-500">
              {{ t('cloudBilling.billing.overviewMinDays') }}
              <span
                class="ml-1 rounded-full px-2 py-0.5 font-mono font-semibold"
                :class="overview.financial_health.total_days < 10 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'"
              >
                {{ overview.financial_health.total_days }} {{ t('cloudBilling.billing.overviewDaysUnit') }}
              </span>
            </div>
          </div>
          <div
            v-if="overview.financial_health.bottleneck"
            class="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-red-700"
          >
            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-7.938 4h15.876c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L2.33 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {{ t('cloudBilling.billing.overviewBottleneck') }}: {{ overview.financial_health.bottleneck }}
          </div>
        </div>

        <div class="flex flex-col gap-8">
          <div class="grid gap-8 lg:grid-cols-12">
            <div class="rounded-xl border border-gray-200 bg-gray-50 p-6 lg:col-span-8">
              <div class="mb-6">
                <h4 class="text-xs font-bold uppercase tracking-[0.16em] text-gray-900">
                  {{ t('cloudBilling.billing.overviewQuotaTrend') }}
                </h4>
                <p class="mt-1 text-[11px] text-gray-500">
                  {{ t('cloudBilling.billing.overviewQuotaTrendHint') }}
                </p>
              </div>
              <div class="h-[320px]">
                <Line
                  v-if="quotaTrendChartData"
                  :data="quotaTrendChartData"
                  :options="quotaTrendChartOptions"
                />
              </div>
            </div>

            <div class="rounded-xl border border-gray-200 bg-gray-50 p-6 lg:col-span-4">
              <div class="mb-5">
                <h4 class="text-xs font-bold uppercase tracking-[0.16em] text-gray-900">
                  {{ t('cloudBilling.billing.overviewRechargeTimeline') }}
                </h4>
                <p class="mt-1 text-[11px] text-gray-500">
                  {{ t('cloudBilling.billing.overviewRechargeTimelineHint') }}
                </p>
              </div>
              <div class="space-y-4">
                <div
                  v-for="item in overview.financial_health.recharge_alerts"
                  :key="`${item.name}-${item.account_id || 'default'}`"
                  class="space-y-2"
                >
                  <div class="flex items-start justify-between gap-3 text-xs">
                    <div class="min-w-0 flex-1">
                      <div class="flex items-center gap-2">
                      <span
                        class="rounded px-1.5 py-0.5 text-[9px] font-bold uppercase"
                        :class="item.category === 'LLM' ? 'bg-gray-200 text-gray-700' : 'bg-primary-100 text-primary-700'"
                      >
                        {{ item.category }}
                      </span>
                        <span class="truncate font-medium text-gray-700">{{ item.name }}</span>
                      </div>
                      <div class="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-gray-500">
                        <span class="font-mono text-gray-600">
                          {{ item.account_id || t('cloudBilling.billing.defaultAccount') }}
                        </span>
                        <span
                          v-if="item.notes"
                          class="truncate font-medium text-gray-600"
                        >
                          {{ item.notes }}
                        </span>
                      </div>
                    </div>
                    <span class="font-mono font-semibold" :class="riskTextClass(daysToRisk(item.days_remaining))">
                      {{ item.days_remaining }}{{ t('cloudBilling.billing.overviewDaysShort') }}
                    </span>
                  </div>
                  <div class="h-1.5 overflow-hidden rounded-full bg-gray-200">
                    <div class="h-full rounded-full" :class="riskBarClass(daysToRisk(item.days_remaining))" :style="{ width: `${Math.min(100, item.days_remaining)}%` }" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="grid gap-4 lg:grid-cols-2">
            <div>
              <div class="mb-3 flex items-center justify-between">
                <h4 class="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                  {{ t('cloudBilling.billing.overviewPrepaidAccounts') }}
                </h4>
                <span class="text-[11px] font-mono text-zinc-400">{{ prepaidAccounts.length }}</span>
              </div>
              <div class="grid gap-3">
                <article
                  v-for="account in prepaidAccounts"
                  :key="account.id"
                  class="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
                >
                  <div class="flex items-start justify-between gap-3">
                    <div class="flex min-w-0 items-start gap-3">
                      <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white p-2 shadow-sm">
                        <img
                          v-if="providerIcon(account)"
                          :src="providerIcon(account)"
                          :alt="account.provider"
                          class="h-full w-full object-contain"
                        >
                        <div v-else class="text-[11px] font-bold text-zinc-500">
                          {{ providerFallbackLetter(account) }}
                        </div>
                      </div>
                      <div class="min-w-0">
                        <div class="flex items-center gap-2">
                          <h5 class="truncate text-sm font-semibold text-zinc-900">{{ account.name }}</h5>
                          <span
                            class="rounded px-1.5 py-0.5 text-[9px] font-bold uppercase"
                            :class="account.category === 'LLM' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'"
                          >
                            {{ account.category }}
                          </span>
                        </div>
                        <p v-if="showProviderLabel(account)" class="mt-1 truncate text-[11px] text-zinc-500">{{ account.provider }}</p>
                        <p v-if="account.notes" class="mt-1 truncate text-xs font-medium text-zinc-600">
                          {{ account.notes }}
                        </p>
                      </div>
                    </div>
                    <span class="h-2.5 w-2.5 rounded-full" :class="riskDotClass(account.risk)" />
                  </div>
                  <div class="mt-3 grid grid-cols-2 gap-3 rounded-xl bg-zinc-50 px-3 py-2.5">
                    <div class="min-w-0">
                      <div class="text-[11px] text-zinc-500">{{ t('cloudBilling.billing.balance') }}</div>
                      <div class="mt-0.5 truncate font-mono text-sm font-semibold text-zinc-900">{{ formatValue(account.balance) }}</div>
                    </div>
                    <div class="min-w-0 text-right">
                      <div class="text-[11px] text-zinc-500">{{ t('cloudBilling.billing.overviewDaysRemaining') }}</div>
                      <div class="mt-0.5 font-mono text-sm font-semibold" :class="riskTextClass(account.risk)">{{ account.days_remaining }}{{ t('cloudBilling.billing.overviewDaysShort') }}</div>
                    </div>
                  </div>
                </article>
              </div>
            </div>

            <div>
              <div class="mb-3 flex items-center justify-between">
                <h4 class="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                  {{ t('cloudBilling.billing.overviewPostpaidAccounts') }}
                </h4>
                <span class="text-[11px] font-mono text-zinc-400">{{ postpaidAccounts.length }}</span>
              </div>
              <div class="grid gap-3">
                <article
                  v-for="account in postpaidAccounts"
                  :key="account.id"
                  class="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
                >
                  <div class="flex items-start justify-between gap-3">
                    <div class="flex min-w-0 items-start gap-3">
                      <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white p-2 shadow-sm">
                        <img
                          v-if="providerIcon(account)"
                          :src="providerIcon(account)"
                          :alt="account.provider"
                          class="h-full w-full object-contain"
                        >
                        <div v-else class="text-[11px] font-bold text-zinc-500">
                          {{ providerFallbackLetter(account) }}
                        </div>
                      </div>
                      <div class="min-w-0">
                        <div class="flex items-center gap-2">
                          <h5 class="truncate text-sm font-semibold text-zinc-900">{{ account.name }}</h5>
                          <span class="rounded bg-zinc-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-zinc-700">
                            {{ account.category }}
                          </span>
                        </div>
                        <p v-if="showProviderLabel(account)" class="mt-1 truncate text-[11px] text-zinc-500">{{ account.provider }}</p>
                        <p v-if="account.notes" class="mt-1 truncate text-xs font-medium text-zinc-600">
                          {{ account.notes }}
                        </p>
                      </div>
                    </div>
                    <span class="h-2.5 w-2.5 rounded-full" :class="riskDotClass(account.risk)" />
                  </div>
                  <div class="mt-3 grid grid-cols-2 gap-3 rounded-xl bg-zinc-50 px-3 py-2.5">
                    <div class="min-w-0">
                      <div class="text-[11px] text-zinc-500">{{ t('cloudBilling.billing.cost') }}</div>
                      <div class="mt-0.5 truncate font-mono text-sm font-semibold text-zinc-900">{{ formatValue(account.cost) }}</div>
                    </div>
                    <div class="min-w-0 text-right">
                      <div class="text-[11px] text-zinc-500">{{ t('cloudBilling.billing.overviewDaysRemaining') }}</div>
                      <div class="mt-0.5 font-mono text-sm font-semibold" :class="riskTextClass(account.risk)">{{ account.days_remaining }}{{ t('cloudBilling.billing.overviewDaysShort') }}</div>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div class="flex flex-col gap-4 border-b border-zinc-200 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div class="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div>
              <h3 class="text-sm font-semibold text-zinc-900">
                {{ t('cloudBilling.billing.overviewAccountDetails') }}
              </h3>
              <p class="mt-1 text-xs text-zinc-500">
                {{ t('cloudBilling.billing.overviewAccountDetailsHint') }}
              </p>
            </div>
            <div class="relative">
              <svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" />
              </svg>
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="t('cloudBilling.billing.overviewSearchPlaceholder')"
                class="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2 pl-9 pr-3 text-sm text-zinc-700 outline-none transition-colors focus:border-blue-300 lg:w-72"
              />
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-500 transition-colors hover:bg-zinc-50"
              @click="exportAccountsCsv"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1" />
              </svg>
              {{ t('common.export') }} CSV
            </button>
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors"
              :class="groupByProvider ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50'"
              @click="groupByProvider = !groupByProvider"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h7M4 12h16M4 18h12" />
              </svg>
              {{ t('cloudBilling.billing.overviewGroupByProvider') }}
            </button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-zinc-200">
            <thead class="bg-zinc-50">
              <tr>
                <th class="table-head">{{ t('cloudBilling.billing.provider') }}</th>
                <th class="table-head">{{ t('cloudBilling.billing.cost') }}</th>
                <th class="table-head">{{ t('cloudBilling.billing.overviewBalanceQuota') }}</th>
                <th class="table-head">{{ t('cloudBilling.billing.overviewDaysRemaining') }}</th>
                <th class="table-head">{{ t('cloudBilling.billing.overviewRiskStatus') }}</th>
                <th class="table-head">{{ t('cloudBilling.billing.overviewTrendMini') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-zinc-100">
              <template v-for="group in groupedRows" :key="group.name">
                <tr
                  v-if="groupByProvider"
                  class="cursor-pointer bg-zinc-50/70 transition-colors hover:bg-zinc-50"
                  @click="toggleProvider(group.name)"
                >
                  <td colspan="6" class="px-6 py-3">
                    <div class="flex items-center justify-between gap-4">
                      <div class="flex items-center gap-2">
                        <svg class="h-4 w-4 text-zinc-400 transition-transform" :class="expandedProviders[group.name] === false ? '-rotate-90' : 'rotate-0'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                        <span class="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                          {{ group.name }} ({{ group.rows.length }})
                        </span>
                      </div>
                      <div class="flex items-center gap-6 text-[11px]">
                        <span class="text-zinc-500">
                          {{ t('cloudBilling.billing.overviewGroupCost') }}
                          <span class="ml-1 font-mono font-semibold text-zinc-700">{{ formatValue(group.totalCost) }}</span>
                        </span>
                        <span class="text-zinc-500">
                          {{ t('cloudBilling.billing.overviewGroupBalance') }}
                          <span class="ml-1 font-mono font-semibold text-emerald-600">{{ formatValue(group.totalBalance) }}</span>
                        </span>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr
                  v-for="account in visibleGroupRows(group)"
                  :key="account.id"
                  class="transition-colors hover:bg-zinc-50/60"
                >
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white p-2 shadow-sm">
                        <img
                          v-if="providerIcon(account)"
                          :src="providerIcon(account)"
                          :alt="account.provider"
                          class="h-full w-full object-contain"
                        >
                        <div v-else class="text-[11px] font-bold text-zinc-500">
                          {{ providerFallbackLetter(account) }}
                        </div>
                      </div>
                      <div class="min-w-0">
                        <div class="flex items-center gap-2">
                          <div class="truncate text-sm font-semibold text-zinc-900">{{ account.name }}</div>
                          <span
                            class="rounded px-1.5 py-0.5 text-[9px] font-bold uppercase"
                            :class="account.category === 'LLM' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'"
                          >
                            {{ account.category }}
                          </span>
                          <span class="rounded bg-zinc-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-zinc-600">
                            {{ paymentTypeLabel(account.type) }}
                          </span>
                        </div>
                        <div v-if="showProviderLabel(account)" class="mt-1 truncate text-[11px] text-zinc-500">{{ account.provider }}</div>
                        <div v-if="account.notes" class="mt-1 truncate text-xs font-medium text-zinc-600">
                          {{ account.notes }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="font-mono text-sm font-semibold text-zinc-800">
                      {{ formatValue(account.cost) }}
                    </div>
                    <div class="mt-1 flex items-center gap-2">
                      <div class="h-1.5 w-20 overflow-hidden rounded-full bg-zinc-100">
                        <div class="h-full rounded-full bg-indigo-500" :style="{ width: `${Math.min(account.percentage, 100)}%` }" />
                      </div>
                      <span class="text-[11px] font-mono text-zinc-400">{{ account.percentage }}%</span>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="space-y-1 text-xs">
                      <div v-if="showBalance(account)" class="flex items-center justify-between gap-4">
                        <span class="text-zinc-400">{{ t('cloudBilling.billing.balance') }}</span>
                        <span class="font-mono font-semibold text-zinc-800">
                          {{ formatAccountValue(account.balance, account.balance_currency) }}
                        </span>
                      </div>
                      <div v-if="account.credit_limit" class="flex items-center justify-between gap-4">
                        <span class="text-zinc-400">{{ t('cloudBilling.billing.overviewCreditLimit') }}</span>
                        <span class="font-mono font-semibold text-zinc-500">
                          {{ formatAccountValue(account.credit_limit, account.credit_limit_currency) }}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="font-mono text-sm font-semibold" :class="riskTextClass(account.risk)">
                      {{ account.days_remaining }} {{ t('cloudBilling.billing.overviewDaysUnit') }}
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]" :class="riskBadgeClass(account.risk)">
                      <span class="h-1.5 w-1.5 rounded-full" :class="riskDotClass(account.risk)" />
                      {{ riskLabel(account.risk) }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <svg viewBox="0 0 100 32" class="h-8 w-24 overflow-visible">
                      <polyline
                        fill="none"
                        :stroke="account.risk === 'high' ? '#e11d48' : account.risk === 'medium' ? '#f59e0b' : '#10b981'"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        :points="sparklinePoints(account.trend)"
                      />
                    </svg>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup>
import { computed, h, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Doughnut, Line } from 'vue-chartjs'
import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip
} from 'chart.js'
import { cloudBillingApi } from '@/api/cloudBilling'
import alibabaCloudIcon from '@/assets/provider-icons/lobehub/alibabacloud.svg'
import awsIcon from '@/assets/provider-icons/lobehub/aws.svg'
import azureIcon from '@/assets/provider-icons/lobehub/azure.svg'
import baiduCloudIcon from '@/assets/provider-icons/lobehub/baiducloud.svg'
import huaweiCloudIcon from '@/assets/provider-icons/lobehub/huaweicloud.svg'
import tencentCloudIcon from '@/assets/provider-icons/lobehub/tencentcloud.svg'
import volcengineIcon from '@/assets/provider-icons/lobehub/volcengine.svg'
import zhipuIcon from '@/assets/provider-icons/lobehub/zhipu.svg'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseLoading from '@/components/ui/BaseLoading.vue'
import {
  OPERATIONS_CURRENCIES,
  OPERATIONS_DEFAULT_TIMEZONE,
  OPERATIONS_TIMEZONES
} from '@/constants/operationsView'
import {
  cloudBillingOverviewAccounts,
  cloudBillingOverviewCurrencyBreakdown,
  cloudBillingOverviewFinancialHealth,
  cloudBillingOverviewSummary
} from '@/mock/cloudBillingOverview'
import { extractErrorMessage, extractResponseData } from '@/utils/api'

const props = defineProps({
  showHeader: {
    type: Boolean,
    default: true
  },
  timezone: {
    type: String,
    default: ''
  },
  currency: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:timezone', 'update:currency'])

ChartJS.register(
  ArcElement,
  CategoryScale,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip
)

const createOverviewIcon = (pathDefinition) => ({
  render() {
    return h(
      'svg',
      {
        class: 'h-4 w-4',
        fill: 'none',
        stroke: 'currentColor',
        viewBox: '0 0 24 24'
      },
      [
        h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'stroke-width': '2',
          d: pathDefinition
        })
      ]
    )
  }
})

const OverviewBarChartIcon = createOverviewIcon('M8 13v7m4-12v12m4-8v8M6 20h12')
const OverviewClockIcon = createOverviewIcon('M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z')
const OverviewTrendIcon = createOverviewIcon('M3 17l6-6 4 4 8-8')
const OverviewPeakIcon = createOverviewIcon('M5 12l4 4L19 6')

const { t } = useI18n()

const loading = ref(false)
const overviewLoaded = ref(false)
const error = ref('')
const defaultCurrency = ref('CNY')
const searchQuery = ref('')
const groupByProvider = ref(true)
const expandedProviders = ref({})
const defaultTimezone = ref(OPERATIONS_DEFAULT_TIMEZONE)
const selectedTrendRange = ref('month')

const selectedCurrency = computed({
  get: () => props.currency || defaultCurrency.value,
  set: (value) => {
    defaultCurrency.value = value
    emit('update:currency', value)
  }
})

const selectedTimezone = computed({
  get: () => props.timezone || defaultTimezone.value,
  set: (value) => {
    defaultTimezone.value = value
    emit('update:timezone', value)
  }
})

const timezones = OPERATIONS_TIMEZONES
const currencies = OPERATIONS_CURRENCIES

const overview = ref(createFallbackOverview())

function createFallbackOverview() {
  return {
    summary: {
      estimated_total: cloudBillingOverviewSummary.estimatedTotal,
      current_consumed: cloudBillingOverviewSummary.currentConsumed,
      daily_average: cloudBillingOverviewSummary.dailyAverage,
      peak_cost: cloudBillingOverviewSummary.peakCost,
      peak_date: cloudBillingOverviewSummary.peakDate,
      trend: cloudBillingOverviewSummary.trend
    },
    currency_breakdown: cloudBillingOverviewCurrencyBreakdown,
    financial_health: {
      total_funds: cloudBillingOverviewFinancialHealth.totalFunds,
      total_days: cloudBillingOverviewFinancialHealth.totalDays,
      bottleneck: cloudBillingOverviewFinancialHealth.bottleneck,
      recharge_alerts: cloudBillingOverviewFinancialHealth.rechargeAlerts
    },
    accounts: cloudBillingOverviewAccounts.map((item) => ({
      id: item.id,
      name: item.name,
      provider: item.provider,
      provider_type: item.providerType || '',
      notes: item.notes || '',
      category: item.category,
      cost: item.cost,
      percentage: item.percentage,
      change: item.change,
      risk: item.risk,
      balance: item.balance,
      balance_currency: item.balanceCurrency || '',
      credit_limit: item.creditLimit || null,
      credit_limit_currency: item.creditLimitCurrency || '',
      display_funds: item.displayFunds || item.creditLimit || item.balance,
      display_funds_currency: item.displayFundsCurrency || item.creditLimitCurrency || item.balanceCurrency || '',
      days_remaining: item.daysRemaining,
      type: item.type,
      usage_rate: item.usageRate || null,
      account_id: item.accountId || '',
      trend: item.trend
    })),
    exchange_rate: 7.15,
    rate_source_label: 'Internal baseline rate',
    rate_source_url: '',
    rate_collected_at: new Date().toISOString()
  }
}

const summaryCards = computed(() => [
  {
    key: 'estimated',
    label: t('cloudBilling.billing.overviewEstimatedTotal'),
    value: formatValue(overview.value.summary.estimated_total),
    icon: OverviewBarChartIcon
  },
  {
    key: 'consumed',
    label: t('cloudBilling.billing.overviewConsumed'),
    value: formatValue(overview.value.summary.current_consumed),
    icon: OverviewClockIcon
  },
  {
    key: 'daily',
    label: t('cloudBilling.billing.overviewDailyAverage'),
    value: formatValue(overview.value.summary.daily_average),
    icon: OverviewTrendIcon
  },
  {
    key: 'peak',
    label: t('cloudBilling.billing.overviewPeakCost'),
    value: formatValue(overview.value.summary.peak_cost),
    subValue: `${t('cloudBilling.billing.overviewPeakDate')}: ${overview.value.summary.peak_date || '-'}`,
    icon: OverviewPeakIcon
  }
])

const trendRanges = ['today', 'week', 'month', 'year']

const currentTrend = computed(() => {
  const trendRangesMap = overview.value.summary?.trend_ranges || {}
  return trendRangesMap[selectedTrendRange.value] || overview.value.summary?.trend || []
})

const trendChartData = computed(() => ({
  labels: currentTrend.value.map((item) => item.date),
  datasets: [
    {
      label: 'CNY',
      data: currentTrend.value.map((item) => item.cny),
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.10)',
      fill: true,
      tension: 0.36,
      pointRadius: 0
    },
    {
      label: 'USD',
      data: currentTrend.value.map((item) => item.usd),
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99, 102, 241, 0.10)',
      fill: true,
      tension: 0.36,
      pointRadius: 0
    }
  ]
}))

const trendChartRenderKey = computed(() => {
  const labels = currentTrend.value.map((item) => item.date).join('|')
  return `${selectedTrendRange.value}:${labels}`
})

const trendChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: {
      position: 'top',
      align: 'end',
      labels: {
        usePointStyle: true,
        boxWidth: 8,
        color: '#52525b'
      }
    },
    tooltip: {
      backgroundColor: '#ffffff',
      titleColor: '#18181b',
      bodyColor: '#3f3f46',
      borderColor: '#e4e4e7',
      borderWidth: 1,
      padding: 12
    }
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: '#a1a1aa', maxTicksLimit: 10 }
    },
    y: {
      beginAtZero: true,
      grid: { color: '#f4f4f5' },
      ticks: {
        color: '#a1a1aa',
        callback: (value) => `${selectedCurrency.value === 'USD' ? '$' : '¥'}${value}`
      }
    }
  }
}))

const quotaTrendAccounts = computed(() =>
  [...(overview.value.accounts || [])]
    .sort((a, b) => a.days_remaining - b.days_remaining || b.cost - a.cost)
    .slice(0, 5)
)

const quotaTrendLabels = computed(() => {
  const firstAccount = quotaTrendAccounts.value[0]
  return (firstAccount?.trend || []).map((item) => item.date)
})

const quotaTrendColors = ['#10b981', '#2563eb', '#f59e0b', '#ef4444', '#8b5cf6']

const quotaTrendChartData = computed(() => ({
  labels: quotaTrendLabels.value,
  datasets: quotaTrendAccounts.value.map((account, index) => ({
    label: account.name,
    data: (account.trend || []).map((item) => Number(item.value || 0)),
    borderColor: quotaTrendColors[index % quotaTrendColors.length],
    backgroundColor: 'transparent',
    tension: 0.36,
    pointRadius: 0,
    pointHoverRadius: 4,
    borderWidth: 2
  }))
}))

const quotaTrendChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: {
      position: 'top',
      align: 'end',
      labels: {
        usePointStyle: true,
        boxWidth: 8,
        color: '#6b7280',
        font: {
          size: 10
        }
      }
    },
    tooltip: {
      backgroundColor: '#ffffff',
      titleColor: '#111827',
      bodyColor: '#374151',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      padding: 12,
      callbacks: {
        label: (context) => `${context.dataset.label}: ${formatValue(context.parsed.y)}`
      }
    }
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: '#9ca3af', maxTicksLimit: 10, font: { size: 10 } }
    },
    y: {
      grid: { color: '#e5e7eb' },
      ticks: {
        color: '#9ca3af',
        font: { size: 10 },
        callback: (value) => {
          const numericValue = Number(value || 0)
          if (selectedCurrency.value === 'USD') {
            return `$${Math.round(numericValue / 1000)}k`
          }
          return `¥${Math.round(numericValue / 1000)}k`
        }
      }
    }
  }
}))

const currencyChartData = computed(() => ({
  labels: (overview.value.currency_breakdown || []).map((item) => item.code),
  datasets: [
    {
      data: (overview.value.currency_breakdown || []).map((item) => item.value),
      backgroundColor: (overview.value.currency_breakdown || []).map((item) => item.color),
      borderWidth: 0
    }
  ]
}))

const currencyChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '68%',
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#18181b'
    }
  }
}

const filteredAccounts = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) {
    return overview.value.accounts || []
  }
  return (overview.value.accounts || []).filter((item) => {
    return (
      item.name.toLowerCase().includes(query) ||
      item.provider.toLowerCase().includes(query) ||
      String(item.account_id || '').toLowerCase().includes(query)
    )
  })
})

const groupedRows = computed(() => {
  if (!groupByProvider.value) {
    return [
      {
        name: t('cloudBilling.billing.overviewAllAccounts'),
        rows: filteredAccounts.value,
        totalCost: filteredAccounts.value.reduce((sum, item) => sum + Number(item.cost || 0), 0),
        totalBalance: filteredAccounts.value.reduce((sum, item) => sum + Number(item.balance || 0), 0)
      }
    ]
  }

  const grouped = new Map()
  filteredAccounts.value.forEach((item) => {
    if (!grouped.has(item.provider)) {
      grouped.set(item.provider, [])
    }
    grouped.get(item.provider).push(item)
  })

  return Array.from(grouped.entries()).map(([name, rows]) => ({
    name,
    rows,
    totalCost: rows.reduce((sum, item) => sum + Number(item.cost || 0), 0),
    totalBalance: rows.reduce((sum, item) => sum + Number(item.balance || 0), 0)
  }))
})

const prepaidAccounts = computed(() =>
  (overview.value.accounts || []).filter((item) => item.type === 'prepaid').slice(0, 6)
)

const postpaidAccounts = computed(() =>
  (overview.value.accounts || []).filter((item) => item.type === 'postpaid').slice(0, 6)
)

const providerIcons = {
  aws: awsIcon,
  azure: azureIcon,
  huawei: huaweiCloudIcon,
  'huawei-intl': huaweiCloudIcon,
  tencentcloud: tencentCloudIcon,
  alibaba: alibabaCloudIcon,
  volcengine: volcengineIcon,
  baidu: baiduCloudIcon,
  zhipu: zhipuIcon
}

function daysToRisk(daysRemaining) {
  if (daysRemaining <= 10) return 'high'
  if (daysRemaining <= 30) return 'medium'
  return 'low'
}

function riskLabel(risk) {
  if (risk === 'high') return t('cloudBilling.billing.overviewRiskHigh')
  if (risk === 'medium') return t('cloudBilling.billing.overviewRiskMedium')
  return t('cloudBilling.billing.overviewRiskLow')
}

function riskTextClass(risk) {
  if (risk === 'high') return 'text-rose-600'
  if (risk === 'medium') return 'text-amber-600'
  return 'text-emerald-600'
}

function riskDotClass(risk) {
  if (risk === 'high') return 'bg-rose-500'
  if (risk === 'medium') return 'bg-amber-500'
  return 'bg-emerald-500'
}

function riskBadgeClass(risk) {
  if (risk === 'high') return 'bg-rose-50 text-rose-700'
  if (risk === 'medium') return 'bg-amber-50 text-amber-700'
  return 'bg-emerald-50 text-emerald-700'
}

function riskBarClass(risk) {
  if (risk === 'high') return 'bg-rose-500'
  if (risk === 'medium') return 'bg-amber-500'
  return 'bg-emerald-500'
}

function formatValue(value) {
  const numericValue = Number(value || 0)
  if (selectedCurrency.value === 'USD') {
    return `$${(numericValue / Number(overview.value.exchange_rate || 7.15)).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`
  }
  return `¥${numericValue.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`
}

function formatAccountValue(value, currency) {
  const numericValue = Number(value || 0)
  const normalizedCurrency = String(currency || '').toUpperCase()
  if (normalizedCurrency === 'USD') {
    return `$${numericValue.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`
  }
  if (normalizedCurrency === 'CNY') {
    return `¥${numericValue.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`
  }
  return formatValue(numericValue)
}

function showBalance(account) {
  return Number(account.balance || 0) > 0
}

function paymentTypeLabel(type) {
  if (type === 'prepaid') return t('cloudBilling.billing.overviewTypePrepaid')
  if (type === 'postpaid') return t('cloudBilling.billing.overviewTypePostpaid')
  return type || '-'
}

function providerIcon(account) {
  const providerType = String(account.provider_type || '').trim().toLowerCase()
  if (providerType && providerIcons[providerType]) {
    return providerIcons[providerType]
  }

  const providerName = `${account.provider || ''} ${account.name || ''}`.toLowerCase()
  if (providerName.includes('aws')) return providerIcons.aws
  if (providerName.includes('azure')) return providerIcons.azure
  if (providerName.includes('华为') || providerName.includes('huawei')) return providerIcons['huawei-intl']
  if (providerName.includes('腾讯') || providerName.includes('tencent')) return providerIcons.tencentcloud
  if (providerName.includes('阿里') || providerName.includes('alibaba')) return providerIcons.alibaba
  if (providerName.includes('火山') || providerName.includes('volc')) return providerIcons.volcengine
  if (providerName.includes('百度') || providerName.includes('baidu')) return providerIcons.baidu
  if (providerName.includes('智谱') || providerName.includes('zhipu')) return providerIcons.zhipu
  return ''
}

function providerFallbackLetter(account) {
  return String(account.provider || account.name || '?').trim().charAt(0) || '?'
}

function showProviderLabel(account) {
  const provider = String(account.provider || '').trim().toLowerCase()
  const name = String(account.name || '').trim().toLowerCase()
  return Boolean(provider) && provider !== name
}

function csvCell(value) {
  const normalized = String(value ?? '')
  return `"${normalized.replaceAll('"', '""')}"`
}

function exportAccountsCsv() {
  const headers = [
    t('cloudBilling.billing.provider'),
    t('cloudBilling.billing.accountId'),
    t('cloudBilling.billing.overviewPaymentType'),
    t('cloudBilling.billing.cost'),
    t('cloudBilling.billing.balance'),
    t('cloudBilling.billing.overviewCreditLimit'),
    t('cloudBilling.billing.overviewDaysRemaining'),
    t('cloudBilling.billing.overviewRiskStatus'),
    t('cloudBilling.billing.overviewNotes')
  ]

  const rows = filteredAccounts.value.map((account) => [
    account.provider || account.name || '',
    account.account_id || '',
    paymentTypeLabel(account.type),
    formatValue(account.cost),
    showBalance(account) ? formatAccountValue(account.balance, account.balance_currency) : '',
    account.credit_limit ? formatAccountValue(account.credit_limit, account.credit_limit_currency) : '',
    `${account.days_remaining}${t('cloudBilling.billing.overviewDaysShort')}`,
    riskLabel(account.risk),
    account.notes || ''
  ])

  const csvContent = [headers, ...rows]
    .map((row) => row.map(csvCell).join(','))
    .join('\n')

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `operations-accounts-${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function formatBreakdownValue(item) {
  if (item.code === 'USD') {
    return `$${Number(item.original_value || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`
  }
  return `¥${Number(item.value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`
}

function formatTime(isoString) {
  if (!isoString) return '-'
  try {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: selectedTimezone.value
    }).format(new Date(isoString))
  } catch {
    return isoString
  }
}

function capitalizeRange(value) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function sparklinePoints(trend) {
  const values = (trend || []).map((item) => Number(item.value || 0))
  const max = Math.max(...values, 1)
  const min = Math.min(...values, 0)
  const range = Math.max(max - min, 1)
  return values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * 100
      const y = 28 - ((value - min) / range) * 24
      return `${x},${y}`
    })
    .join(' ')
}

function toggleProvider(name) {
  expandedProviders.value = {
    ...expandedProviders.value,
    [name]: expandedProviders.value[name] === false
  }
}

function visibleGroupRows(group) {
  if (!groupByProvider.value) {
    return group.rows
  }
  return expandedProviders.value[group.name] === false ? [] : group.rows
}

async function loadOverview() {
  loading.value = true
  error.value = ''
  try {
    const response = await cloudBillingApi.getOverview({
      timezone: selectedTimezone.value,
    })
    const data = extractResponseData(response)
    overview.value = {
      ...createFallbackOverview(),
      ...data,
      summary: {
        ...createFallbackOverview().summary,
        ...(data?.summary || {})
      },
      financial_health: {
        ...createFallbackOverview().financial_health,
        ...(data?.financial_health || {})
      },
      currency_breakdown: data?.currency_breakdown || createFallbackOverview().currency_breakdown,
      accounts: data?.accounts || createFallbackOverview().accounts
    }
  } catch (err) {
    overview.value = createFallbackOverview()
    error.value = extractErrorMessage(err, t('common.error'))
  } finally {
    overviewLoaded.value = true
    loading.value = false
  }
}

defineExpose({ reload: loadOverview })

onMounted(() => {
  loadOverview()
})

watch(
  () => selectedTimezone.value,
  (value, previousValue) => {
    if (!overviewLoaded.value || !value || value === previousValue) {
      return
    }
    loadOverview()
  }
)
</script>

<style scoped>
.table-head {
  @apply px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400;
}
</style>
