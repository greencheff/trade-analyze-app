import { useState, useEffect } from 'react'

export default function Toast({ message }) {
  const [show, setShow] = useState(true)
  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  if (!show) return null

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-3 rounded shadow-lg">
      {message}
    </div>
  )
}
