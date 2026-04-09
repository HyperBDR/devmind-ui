import { createI18n } from 'vue-i18n'

import en from '../locales/en.json'
import zhCN from '../locales/zh-CN.json'
import adminEn from '../admin/locales/en.json'
import adminZhCN from '../admin/locales/zh-CN.json'

const isPlainObject = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value)

const deepMergeMessages = (base, extra) => {
  const output = { ...base }

  Object.entries(extra).forEach(([key, value]) => {
    if (isPlainObject(value) && isPlainObject(output[key])) {
      output[key] = deepMergeMessages(output[key], value)
      return
    }
    output[key] = value
  })

  return output
}

// Get language from localStorage or default to 'en'
// If stored language is 'es' (Spanish), fallback to 'en' since Spanish is no longer supported
const getStoredLanguage = () => {
  const stored = localStorage.getItem('userLanguage')
  if (stored === 'es') {
    // Remove Spanish from localStorage and fallback to English
    localStorage.setItem('userLanguage', 'en')
    return 'en'
  }
  // Only allow 'en' or 'zh-CN', fallback to 'en' for any other value
  return stored === 'zh-CN' || stored === 'en' ? stored : 'en'
}

// Create Vue i18n instance
const i18n = createI18n({
  legacy: false,
  locale: getStoredLanguage(),
  fallbackLocale: 'en',
  messages: {
    en: deepMergeMessages(en, adminEn),
    'zh-CN': deepMergeMessages(zhCN, adminZhCN)
  }
})

export default i18n
