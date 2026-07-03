import { createContext, useState, useEffect, useCallback } from 'react'
import { getMe, login as apiLogin, register as apiRegister } from '../api/authApi'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      setLoading(false)
      return
    }
    
    try {
      const userData = await getMe()
      setUser(userData)
    } catch (error) {
      console.error('Failed to load user session', error)
      localStorage.removeItem('auth_token')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUser()

    const handleUnauthorized = () => {
      setUser(null)
      localStorage.removeItem('auth_token')
    }
    
    window.addEventListener('auth_unauthorized', handleUnauthorized)
    return () => window.removeEventListener('auth_unauthorized', handleUnauthorized)
  }, [loadUser])

  const login = async (email, password) => {
    const data = await apiLogin(email, password)
    localStorage.setItem('auth_token', data.token)
    setUser(data)
  }

  const register = async (name, email, password) => {
    const data = await apiRegister(name, email, password)
    localStorage.setItem('auth_token', data.token)
    setUser(data)
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
