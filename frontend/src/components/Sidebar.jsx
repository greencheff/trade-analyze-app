import { NavLink } from 'react-router-dom'

export default function Sidebar() {
  const links = [
    { to: '/dashboard',    label: 'Dashboard' },
    { to: '/portfolio',    label: 'Portföy'    },
    { to: '/history',      label: 'Geçmiş'     },
    { to: '/settings',     label: 'Ayarlar'    },
    { to: '/subscription', label: 'Abonelik'   },
  ]

  return (
    <aside className="w-56 bg-white p-4 border-r h-full flex-shrink-0">
      <nav className="space-y-1">
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `block px-4 py-2 rounded transition-colors ${
                isActive
                  ? 'bg-indigo-100 text-indigo-800 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
