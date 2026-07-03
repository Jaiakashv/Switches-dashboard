import api from './index'

export const fetchAlerts = () => {
  return api.get('/alerts')
}

export const generateMockAlert = () => {
  return api.post('/alerts')
}

export const acknowledgeAlert = (id) => {
  return api.patch(`/alerts/${id}/acknowledge`)
}
