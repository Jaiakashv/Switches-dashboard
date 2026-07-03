import api from './index'

export const fetchSwitches = () => {
  return api.get('/switches')
}

export const createSwitch = (switchData) => {
  return api.post('/switches', switchData)
}

export const updateSwitchStatus = (id, status) => {
  return api.patch(`/switches/${id}/status`, { status })
}