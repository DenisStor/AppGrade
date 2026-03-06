/**
 * API-сервис для отправки форм
 */

async function postRequest(body) {
  const res = await fetch('/api/requests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Ошибка отправки')
  }
  return res.json()
}

export const api = {
  async submitOrder({ name, phone, items }) {
    const comment = items
      ?.map(i => `${i.name || `#${i.productId}`} × ${i.quantity}`)
      .join('; ')
    return postRequest({ type: 'order', name, phone, comment })
  },

  async submitQuickBuy({ name, phone, productName, variantInfo, productId }) {
    return postRequest({
      type: 'quick_buy',
      name,
      phone,
      product_name: productName,
      variant_info: variantInfo,
      product_id: productId,
    })
  },

  async submitContactForm({ name, phone }) {
    return postRequest({ type: 'contact', name, phone })
  },

  async submitNotify({ name, phone, productName, variantInfo, productId }) {
    return postRequest({
      type: 'stock_notify',
      name,
      phone,
      product_name: productName,
      variant_info: variantInfo,
      product_id: productId,
    })
  },

  async submitRepairRequest({ name, phone, device, problem }) {
    return postRequest({
      type: 'repair',
      name,
      phone,
      product_name: device,
      comment: problem,
    })
  },
}
