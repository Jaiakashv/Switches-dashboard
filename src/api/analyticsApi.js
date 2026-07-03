import api from './index'

export const fetchAnalytics = () => {
  return api.get('/analytics')
}
