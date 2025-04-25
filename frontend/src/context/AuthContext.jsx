import React, { createContext, useState, useEffect, useContext } from 'react'

// Create the context with default values
export const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
})

// AuthProvider bileşeni
export function AuthProvider({ children }) {
  // LocalStorage'dan kullanıcıyı al
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('tradeAnalyzerUser')) || null
    } catch {
      return null
    }
  })

  // Kullanıcı değiştikçe localStorage'a yaz
  useEffect(() => {
    if (user) {
      localStorage.setItem('tradeAnalyzerUser', JSON.stringify(user))
    } else {
      localStorage.removeItem('tradeAnalyzerUser')
    }
  }, [user])

  // Login
  const login = (username) => {
    setUser({ username })
  }

  // Logout
  const logout = () => {
    setUser(null)
  }

  // Context değeri
  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// useAuth helper'ı – kolay erişim için
export function useAuth() {
  return useContext(AuthContext)
}
