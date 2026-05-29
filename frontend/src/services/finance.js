import api from './api'

export const financeService = {
  getStats:  ()       => api.get('/finance/stats'),
  getOrders: (params) => api.get('/finance/orders', { params }),
}
