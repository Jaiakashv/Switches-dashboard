import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
})

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle global errors (like 401 Unauthorized)
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // Clear token and redirect to login if unauthorized
        localStorage.removeItem('auth_token')
        // We will handle the redirect via AuthContext or a custom event
        window.dispatchEvent(new Event('auth_unauthorized'))
      }
      return Promise.reject(new Error(error.response.data.message || 'API Error'))
    } else if (error.request) {
      return Promise.reject(new Error('Network Error. Please check your connection.'))
    } else {
      return Promise.reject(error)
    }
  }
)

export default api
