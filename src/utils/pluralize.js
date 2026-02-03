/**
 * Склонение слов в зависимости от числа
 * @param {number} count - число
 * @param {[string, string, string]} forms - [один, два, много]
 * @returns {string}
 */
export function pluralize(count, forms) {
  const abs = Math.abs(count) % 100
  const lastDigit = abs % 10

  if (abs > 10 && abs < 20) return forms[2]
  if (lastDigit > 1 && lastDigit < 5) return forms[1]
  if (lastDigit === 1) return forms[0]
  return forms[2]
}

export const PRODUCT_FORMS = ['товар', 'товара', 'товаров']

/**
 * Форматирование количества товаров
 * @param {number} count
 * @returns {string} "5 товаров"
 */
export function formatProductCount(count) {
  return `${count} ${pluralize(count, PRODUCT_FORMS)}`
}
