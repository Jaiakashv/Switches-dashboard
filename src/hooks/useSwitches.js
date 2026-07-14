import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchSwitches, updateSwitchStatus, createSwitch } from '../api/switchApi'

export const useSwitches = (params = {}) => {
  const queryClient = useQueryClient()
  const [actionError, setActionError] = useState('')

  const { limit, offset, search } = params

  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['switches', { limit, offset, search }],
    queryFn: async () => {
      const response = await fetchSwitches({ limit, offset, search })
      return response
    },
  })

  const switches = data?.data || data || []
  const total = data?.total || 0

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateSwitchStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['switches'] })
    },
    onError: (err) => {
      setActionError(err.message || 'Failed to update status.')
    },
  })

  const addMutation = useMutation({
    mutationFn: (switchData) => createSwitch(switchData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['switches'] })
    },
    onError: (err) => {
      setActionError(err.message || 'Failed to add switch.')
    },
  })

  const handleStatusChange = async (deviceId, status) => {
    setActionError('')
    try {
      await statusMutation.mutateAsync({ id: deviceId, status })
      return true
    } catch (err) {
      return false
    }
  }

  const handleAddSwitch = async (switchData) => {
    setActionError('')
    try {
      await addMutation.mutateAsync(switchData)
      return true
    } catch (err) {
      return false
    }
  }

  const reload = () => {
    queryClient.invalidateQueries({ queryKey: ['switches'] })
  }

  return {
    switches,
    isLoading,
    error: error?.message || '',
    actionError,
    handleStatusChange,
    addSwitch: handleAddSwitch,
    reload,
    total,
  }
}
