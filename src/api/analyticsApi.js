import api from './index'

export const fetchAnalytics = () => {
  return api.get('/analytics')
}

export const fetchCpuUsage = (range = '24h') => {
  return api.get('/analytics/cpu-usage', { params: { range } })
}
