import api from './api'

export const qualityService = {
  getAll: (params) => api.get('/quality-controls', { params }),
  getOne: (id) => api.get(`/quality-controls/${id}`),
  create: (data) => api.post('/quality-controls', data),
  update: (id, data) => api.patch(`/quality-controls/${id}`, data),
  delete: (id) => api.delete(`/quality-controls/${id}`),
  getStats: () => api.get('/quality-controls/stats'),
}
