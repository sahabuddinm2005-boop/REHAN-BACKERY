import { createContext, useContext, useState, useEffect } from 'react'
import { login as apiLogin, register as apiRegister } from '../api/api'

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  }, [user])

  const login = async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiLogin(email, password)
      if (response.success) {
        setUser(response.user)
        return { success: true }
      } else {
        setError(response.message || 'Login failed')
        return { success: false, message: response.message }
      }
    } catch (err) {
      const message = err.message || 'Login failed'
      setError(message)
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiRegister(userData)
      if (response.success) {
        return { success: true }
      } else {
        setError(response.message || 'Registration failed')
        return { success: false, message: response.message }
      }
    } catch (err) {
      const message = err.message || 'Registration failed'
      setError(message)
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  const updateUser = (updatedUser) => {
    setUser(updatedUser)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('cart')
  }

  const isAdmin = user?.role === 'admin'
  const isDelivery = user?.role === 'delivery'
  const isAuthenticated = !!user

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    isAdmin,
    isDelivery,
    isAuthenticated,
    clearError: () => setError(null)
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
