import { useState, useEffect, useCallback } from 'react'
import { fetchSwitches, updateSwitchStatus } from '../api/switchApi'

export const useSwitches = () => {
  const [switches, setSwitches] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')

  const loadSwitches = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const data = await fetchSwitches()
      setSwitches(data)
    } catch (err) {
      setError(err.message || 'Failed to load switches.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSwitches()
  }, [loadSwitches])

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

  return { switches, isLoading, error, actionError, handleStatusChange, reload: loadSwitches }
}
