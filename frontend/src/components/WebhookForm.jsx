import { useState } from 'react'

export default function WebhookForm() {
  const [symbol, setSymbol] = useState('BTCUSDT')
  const [interval, setInterval] = useState('1m')
  const [candles, setCandles] = useState(
    '[{"open":100,"high":110,"low":90,"close":105,"volume":1500}]'
  )
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const payload = { 
        symbol, 
        interval, 
        candles: JSON.parse(candles) 
      }
      const resp = await fetch('https://trade-analyze-backend.onrender.com/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!resp.ok) throw new Error('Sunucu hatası')
      const data = await resp.json()
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Symbol</label>
          <input
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Interval</label>
          <input
            value={interval}
            onChange={(e) => setInterval(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Candles (JSON)</label>
          <textarea
            rows={6}
            value={candles}
            onChange={(e) => setCandles(e.target.value)}
            className="w-full border p-2 rounded font-mono text-sm"
          />
        </div>

        {error && <div className="text-red-600 mb-2">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? 'Analiz Ediliyor...' : 'Analiz Et'}
        </button>
      </form>

      {result && (
        <div className="mt-6 p-4 bg-gray-100 rounded shadow space-y-2">
          <h3 className="text-xl font-bold mb-2">📈 Analiz Raporu</h3>

          <div><b>Symbol:</b> {result.symbol}</div>
          <div><b>Interval:</b> {result.interval}</div>
          <div><b>Veri Sayısı:</b> {result.candles_count}</div>

          <hr className="my-2" />

          <div><b>Ortalama Kapanış:</b> {result.average_close}</div>
          <div><b>Ortalama Hacim:</b> {result.average_volume}</div>
          <div><b>En Yüksek Fiyat:</b> {result.highest_price}</div>
          <div><b>En Düşük Fiyat:</b> {result.lowest_price}</div>

          <hr className="my-2" />

          <div><b>📊 Trend Yönü:</b> {result.trend_direction}</div>
          <div><b>📈 Trend Gücü:</b> {result.trend_strength_percent} %</div>
        </div>
      )}
    </div>
  )
}
