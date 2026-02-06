/**
 * API-сервис для отправки форм
 * Заглушки для интеграции с бэкендом
 */

const API_DELAY = 500

export const api = {
  /**
   * Оформление заказа
   */
  async submitOrder(data) {
    // TODO: заменить заглушку на реальный API
    // console.log('[API] submitOrder:', data)
    await new Promise(resolve => setTimeout(resolve, API_DELAY))
    return { success: true, orderId: Date.now() }
  },

  /**
   * Быстрая покупка
   */
  async submitQuickBuy(data) {
    // TODO: заменить заглушку на реальный API
    // console.log('[API] submitQuickBuy:', data)
    await new Promise(resolve => setTimeout(resolve, API_DELAY))
    return { success: true, requestId: Date.now() }
  },

  /**
   * Отправка контактной формы
   */
  async submitContactForm(data) {
    // TODO: заменить заглушку на реальный API
    // console.log('[API] submitContactForm:', data)
    await new Promise(resolve => setTimeout(resolve, API_DELAY))
    return { success: true }
  },

  /**
   * Запись на ремонт
   */
  async submitRepairRequest(data) {
    // TODO: заменить заглушку на реальный API
    // console.log('[API] submitRepairRequest:', data)
    await new Promise(resolve => setTimeout(resolve, API_DELAY))
    return { success: true, requestId: Date.now() }
  },
}
