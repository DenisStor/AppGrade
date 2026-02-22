export function formatPhoneInput(value, prevValue = '') {
  const digits = value.replace(/\D/g, '')
  const prevDigits = prevValue.replace(/\D/g, '')

  let phone = digits
  if (phone.startsWith('7') || phone.startsWith('8')) {
    phone = phone.slice(1)
  }

  let prevPhone = prevDigits
  if (prevPhone.startsWith('7') || prevPhone.startsWith('8')) {
    prevPhone = prevPhone.slice(1)
  }

  // Удалён символ форматирования → удалить и цифру перед ним
  if (prevValue && phone.length === prevPhone.length && value.length < prevValue.length) {
    phone = phone.slice(0, -1)
  }

  phone = phone.slice(0, 10)

  let result = '+7'
  if (phone.length > 0) result += ` (${phone.slice(0, 3)}`
  if (phone.length >= 3) result += `) ${phone.slice(3, 6)}`
  if (phone.length >= 6) result += `-${phone.slice(6, 8)}`
  if (phone.length >= 8) result += `-${phone.slice(8, 10)}`

  return result
}
