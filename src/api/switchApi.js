import api from './index'

export const fetchSwitches = (params = {}) => {
  return api.get('/switches', { params })
}

export const createSwitch = (switchData) => {
  return api.post('/switches', switchData)
}

export const updateSwitchStatus = (id, status) => {
  return api.patch(`/switches/${id}/status`, { status })
}