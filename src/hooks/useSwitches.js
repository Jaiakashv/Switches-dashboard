import { useState, useEffect, useCallback } from 'react'
import { fetchSwitches, updateSwitchStatus } from '../api/switchApi'

export const useSwitches = () => {
  const [switches, setSwitches] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [total, setTotal] = useState(0)

  const loadSwitches = useCallback(async (paginationParams = {}) => {
    setIsLoading(true)
    setError('')
    try {
      const response = await fetchSwitches(paginationParams)
      console.log('API Response:', response)
      // Axios interceptor returns response.data, so response is already the backend response object
      setSwitches(response.data || response || [])
      setTotal(response.total || 0)
    } catch (err) {
      console.error('API Error:', err)
      setError(err.message || 'Failed to load switches.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleStatusChange = async (deviceId, status) => {
    setActionError('')
    try {
      const updatedSwitch = await updateSwitchStatus(deviceId, status)
      setSwitches((current) => 
        current.map((device) => device.id === deviceId ? updatedSwitch : device)
      )
      return true
    } catch (err) {
      setActionError(err.message || 'Failed to update status.')
      return false
    }
  }

  return { switches, isLoading, error, actionError, handleStatusChange, reload: loadSwitches, total }
}
