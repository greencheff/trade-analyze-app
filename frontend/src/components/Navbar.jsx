import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { user, logout } = useContext(AuthContext)

  return (
    <header className="bg-white p-4 border-b flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <svg
          className="w-6 h-6 text-indigo-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5.121 17.804A13.937 13.937 0 0112 15c3.042 0 5.824.948 8.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <span className="font-semibold text-gray-700">
          Hoşgeldiniz{user ? `, ${user.username || user.email || ''}` : ''}
        </span>
      </div>
      <button
        onClick={logout}
        className="text-red-500 hover:text-red-700 font-medium"
      >
        Çıkış
      </button>
    </header>
  )
}
