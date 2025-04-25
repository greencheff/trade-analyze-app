import { useState } from 'react'

export default function WebhookForm({ onResult }) {
  const [symbol, setSymbol] = useState('BTCUSDT')
  const [interval, setInterval] = useState('1m')
  const [candles, setCandles] = useState(
    '[{"open":0,"high":0,"low":0,"close":0,"volume":0}]'
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const payload = { symbol, interval, candles: JSON.parse(candles) }
      const resp = await fetch('/api/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!resp.ok) throw new Error('Sunucu hatası')
      const data = await resp.json()
      onResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">Symbol</label>
        <input
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">Interval</label>
        <input
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">
          Candles (JSON)
        </label>
        <textarea
          rows={4}
          value={candles}
          onChange={(e) => setCandles(e.target.value)}
          className="w-full border p-2 rounded font-mono text-sm"
        />
      </div>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? 'Gönderiliyor...' : 'Analiz Et'}
      </button>
    </form>
  )
}
