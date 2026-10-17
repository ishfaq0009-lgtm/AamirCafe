import axios from 'axios'

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor — attach token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('amir_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (err) => Promise.reject(err)
)

// Response interceptor
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('amir_token')
      localStorage.removeItem('amir_user')
    }
    return Promise.reject(err)
  }
)

export default api