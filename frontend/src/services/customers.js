import api from './api'

export const customersService = {
  getAll:  (params) => api.get('/customers', { params }),
  getOne:  (id)    => api.get(`/customers/${id}`),
  getList: ()      => api.get('/customers/all'),   // dropdown için sayfalama yok
  create:  (data)  => api.post('/customers', data),
  update:  (id, data) => api.put(`/customers/${id}`, data),
  delete:  (id)    => api.delete(`/customers/${id}`),
}
