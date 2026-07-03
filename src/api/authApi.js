import api from './index'
import axios from 'axios'

// Localhost instance for welcome email
const localApi = axios.create({
  baseURL: 'http://localhost:3000/api',
})

export const login = (email, password) => {
  return api.post('/auth/login', { email, password })
}

export const register = (name, email, password) => {
  return api.post('/auth/register', { name, email, password })
}

export const sendWelcomeEmail = (email, name) => {
  return localApi.post('/auth/send-welcome-email', { email, name })
}

export const getMe = () => {
  return api.get('/auth/me')
}

export const changePassword = (currentPassword, newPassword) => {
  return api.patch('/auth/password', { currentPassword, newPassword })
}
