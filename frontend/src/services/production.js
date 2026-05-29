import api from './api'

export const productionService = {
  getAll:  (params)     => api.get('/production-orders', { params }),
  getOne:  (id)         => api.get(`/production-orders/${id}`),
  create:  (data)       => api.post('/production-orders', data),
  update:  (id, data)   => api.put(`/production-orders/${id}`, data),
  delete:  (id)         => api.delete(`/production-orders/${id}`),

  // Vardiya logları
  getLogs:    (id)        => api.get(`/production-orders/${id}/logs`),
  createLog:  (id, data)  => api.post(`/production-orders/${id}/logs`, data),
  updateLog:  (id, logId, data) => api.put(`/production-orders/${id}/logs/${logId}`, data),
  deleteLog:  (id, logId) => api.delete(`/production-orders/${id}/logs/${logId}`),
}
