// frontend/src/context/AuthContext.jsx

import React, { createContext, useState, useEffect } from 'react'

// Create the context with default values
export const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
})

export function AuthProvider({ children }) {
  // Initialize user state from localStorage (persists across reloads)
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('tradeAnalyzerUser')) || null
    } catch {
      return null
    }
  })

  // when user state changes, sync to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('tradeAnalyzerUser', JSON.stringify(user))
    } else {
      localStorage.removeItem('tradeAnalyzerUser')
    }
  }, [user])

  // login: set the user (you could extend this to call an API and store a token)
  const login = (username) => {
    setUser({ username })
  }

  // logout: clear the user
  const logout = () => {
    setUser(null)
  }

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
