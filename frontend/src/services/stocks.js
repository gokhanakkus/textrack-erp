import api from './api'

export const stocksService = {
  getAll: (params) => api.get('/stocks', { params }),
  getOne: (id) => api.get(`/stocks/${id}`),
  create: (data) => api.post('/stocks', data),
  update: (id, data) => api.put(`/stocks/${id}`, data),
  delete: (id) => api.delete(`/stocks/${id}`),
}
