import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/axios.js'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore user from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('amir_user')
      if (stored) setUser(JSON.parse(stored))
    } catch (e) {
      localStorage.removeItem('amir_user')
    } finally {
      setLoading(false)
    }
  }, [])

  const login = async (email, password, role) => {
    const res = await api.post('/user/login', { email, password, role })
    if (res.data.success) {
      const userData = res.data.user || res.data.data || { email, role }
      setUser(userData)
      localStorage.setItem('amir_user', JSON.stringify(userData))
    }
    return res.data
  }

  const signup = async (payload) => {
    const res = await api.post('/user/userRegistr', payload)
    if (res.data.success) {
      const userData = res.data.user || res.data.data || {
        name: payload.name,
        email: payload.email,
        role: payload.role,
      }
      setUser(userData)
      localStorage.setItem('amir_user', JSON.stringify(userData))
    }
    return res.data
  }

  // ⭐ Update the stored user object (after profile edits)
  const updateUser = (patch) => {
    setUser((prev) => {
      const next = { ...(prev || {}), ...patch }
      localStorage.setItem('amir_user', JSON.stringify(next))
      return next
    })
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('amir_user')
    localStorage.removeItem('amir_token')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        updateUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}