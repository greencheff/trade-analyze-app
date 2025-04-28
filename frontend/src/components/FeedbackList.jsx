export default function FeedbackList({ items }) {
  if (!items.length) {
    return <p className="text-gray-500 text-center mt-4">Henüz analiz yapılmadı.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      {items.map((item, idx) => (
        <div key={idx} className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-bold text-indigo-600 mb-2">
            {item.symbol} ({item.interval})
          </h2>
          <div className="text-gray-700 space-y-1 text-sm">
            <p><strong>Trend Yönü:</strong> {item.trendDirection} ({item.trendStrength}%)</p>
            <p><strong>RSI:</strong> {item.rsi}</p>
            <p><strong>MACD:</strong> {item.macd}</p>
            <p><strong>ADX:</strong> {item.adx}</p>
          </div>

          {/* Detaylı Analiz */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg text-gray-600 text-sm whitespace-pre-line">
            {item.detailedAnalysis || "Detaylı analiz bulunamadı."}
          </div>

          {/* Strateji Önerileri */}
          {item.strategies.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold text-md text-green-700 mb-2">Strateji Önerileri:</h3>
              <ul className="list-disc ml-5 space-y-1">
                {item.strategies.map((strategy, i) => (
                  <li key={i}>
                    <strong>{strategy.name}:</strong> {strategy.explanation}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
