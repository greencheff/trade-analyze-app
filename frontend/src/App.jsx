// frontend/src/App.jsx
import React from 'react'
import Router from './router'
import { AuthProvider } from './context/AuthContext'

export default function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  )
}
