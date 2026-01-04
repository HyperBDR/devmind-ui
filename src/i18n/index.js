import { createI18n } from 'vue-i18n'

import en from '../locales/en.json'
import zhCN from '../locales/zh-CN.json'

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
  return (stored === 'zh-CN' || stored === 'en') ? stored : 'en'
}

// Create Vue i18n instance
const i18n = createI18n({
  legacy: false,
  locale: getStoredLanguage(),
  fallbackLocale: 'en',
  messages: {
    en: en,
    'zh-CN': zhCN
  }
})

export default i18n
