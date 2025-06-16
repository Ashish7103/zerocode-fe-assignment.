import React, { createContext, useContext, useState, useEffect } from 'react'
import jwt_decode from 'jwt-decode'

interface User {
  email: string
  id?: string
  name?: string
}

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  loading: boolean
  error: string | null
  token: string | null
}

interface JWTPayload {
  email: string
  name?: string
  exp: number
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      try {
        const decoded = jwt_decode<JWTPayload>(storedToken)
        const currentTime = Date.now() / 1000

        if (decoded.exp > currentTime) {
          setToken(storedToken)
          setIsAuthenticated(true)
          setUser({ email: decoded.email, name: decoded.name })
        } else {
          localStorage.removeItem('token')
        }
      } catch (err) {
        localStorage.removeItem('token')
      }
    }
  }, [])

  const handleApiResponse = async (response: Response) => {
    if (!response.ok) {
      let errorMessage = 'An error occurred'
      try {
        const errorData = await response.json()
        errorMessage = errorData.message || `Error: ${response.status} ${response.statusText}`
      } catch (e) {
        errorMessage = `Network error: ${response.status} ${response.statusText}`
      }
      throw new Error(errorMessage)
    }

    const text = await response.text()
    if (!text) {
      throw new Error('Empty response received from server')
    }

    try {
      return JSON.parse(text)
    } catch (e) {
      throw new Error('Invalid JSON response from server')
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      
      // For development/testing purposes
      // Simulate successful login
      const mockToken = 'mock_jwt_token'
      localStorage.setItem('token', mockToken)
      setToken(mockToken)
      setIsAuthenticated(true)
      setUser({ email, name: 'Test User' })
      
      /* Uncomment when API is ready
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await handleApiResponse(response)
      
      if (!data.token) {
        throw new Error('No token received from server')
      }

      localStorage.setItem('token', data.token)
      
      const decoded = jwt_decode<JWTPayload>(data.token)
      setToken(data.token)
      setIsAuthenticated(true)
      setUser({ email: decoded.email, name: decoded.name })
      */
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during login'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const register = async (email: string, password: string, name: string) => {
    try {
      setLoading(true)
      setError(null)
      
      // For development/testing purposes
      // Simulate successful registration
      const mockToken = 'mock_jwt_token'
      localStorage.setItem('token', mockToken)
      setToken(mockToken)
      setIsAuthenticated(true)
      setUser({ email, name })
      
      /* Uncomment when API is ready
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      })

      const data = await handleApiResponse(response)
      
      if (!data.token) {
        throw new Error('Registration successful but no token received')
      }

      localStorage.setItem('token', data.token)
      
      const decoded = jwt_decode<JWTPayload>(data.token)
      setToken(data.token)
      setIsAuthenticated(true)
      setUser({ email: decoded.email, name: decoded.name })
      */
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setIsAuthenticated(false)
    setUser(null)
    setError(null)
  }

  return (
    <AuthContext.Provider value={ { 
      isAuthenticated, 
      user, 
      login, 
      register, 
      logout,
      loading,
      error,
      token
    } }>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}