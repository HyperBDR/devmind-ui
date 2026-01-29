import { format } from 'date-fns'

/**
 * Format cost with currency symbol
 * @param {number|null|undefined} cost - The cost value
 * @param {string} currency - Currency code (default: 'CNY')
 * @returns {string} Formatted cost string
 */
export function formatCost(cost, currency = 'CNY') {
  if (cost === null || cost === undefined) return '-'
  const symbol = currency === 'CNY' ? '¥' : '$'
  return `${symbol}${Number(cost).toFixed(2)}`
}

/**
 * Format percentage change
 * @param {number|null|undefined} change - The percentage change value
 * @returns {string} Formatted change string with sign
 */
export function formatChange(change) {
  if (change === null || change === undefined) return '-'
  const sign = change >= 0 ? '+' : ''
  return `${sign}${Number(change).toFixed(2)}%`
}

/**
 * Format date string to readable format
 * @param {string|Date} dateString - Date string or Date object
 * @param {string} pattern - Date format pattern (default: 'yyyy-MM-dd HH:mm')
 * @returns {string} Formatted date string
 */
export function formatDate(dateString, pattern = 'yyyy-MM-dd HH:mm') {
  if (!dateString) return '-'
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString
    return format(date, pattern)
  } catch {
    return dateString
  }
}

/**
 * Get CSS class for change value (positive/negative)
 * @param {number|null|undefined} change - The change value
 * @param {string} defaultClass - Default class when change is null/undefined (default: 'text-gray-500')
 * @param {boolean} includeFontMedium - Whether to include 'font-medium' class (default: false)
 * @returns {string} CSS class string
 */
export function getChangeClass(change, defaultClass = 'text-gray-500', includeFontMedium = false) {
  if (change === null || change === undefined) return defaultClass
  const baseClass = change >= 0 ? 'text-red-600' : 'text-green-600'
  return includeFontMedium ? `${baseClass} font-medium` : baseClass
}
