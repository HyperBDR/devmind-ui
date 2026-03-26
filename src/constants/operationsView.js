import { getLocalizedTimezones } from '@/utils/timezones'

const preferredTimezoneValues = [
  'Asia/Shanghai',
  'UTC',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Europe/London',
  'Europe/Frankfurt',
  'America/Los_Angeles',
  'America/New_York',
]

const browserLanguage =
  typeof navigator !== 'undefined' && navigator.language
    ? navigator.language
    : 'en'

const localizedTimezones = getLocalizedTimezones(browserLanguage)
const timezoneMap = new Map(
  localizedTimezones.map((item) => [item.value, item])
)

export const OPERATIONS_TIMEZONES = [
  ...preferredTimezoneValues
    .map((value) => timezoneMap.get(value))
    .filter(Boolean),
  ...localizedTimezones.filter(
    (item) => !preferredTimezoneValues.includes(item.value)
  ),
]

export const OPERATIONS_CURRENCIES = ['CNY', 'USD']
