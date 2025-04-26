// frontend/src/components/FeedbackList.jsx

export default function FeedbackList({ items }) {
  if (!items.length) {
    return <p className="text-gray-500 text-center mt-4">Henüz analiz yapılmadı.</p>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      {items.map((item, idx) => (
        <div key={idx} className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-bold text-indigo-600 mb-2">{item.symbol} ({item.interval})</h2>
          <p className="text-sm mb-1"><strong>RSI:</strong> {item.rsi}</p>
          <p className="text-sm mb-1"><strong>MACD:</strong> {item.macd}</p>
          <p className={`mt-2 font-semibold ${item.feedback.includes('Sinyali') ? 'text-green-600' : 'text-yellow-600'}`}>
            {item.feedback}
          </p>
        </div>
      ))}
    </div>
  )
}
