import { useState, useEffect } from 'react';

export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // TODO: Gerçek API uç noktasına yönlendir
    fetch('/api/history')
      .then((res) => res.json())
      .then((data) => setHistory(data))
      .catch(() => {});
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Geçmiş İşlemler</h1>
      <div className="bg-white p-4 rounded shadow">
        {history.length ? (
          <ul className="space-y-2">
            {history.map((item) => (
              <li key={item.id} className="border-b pb-2 mb-2">
                <p><strong>{item.symbol}</strong> - {item.interval}</p>
                <p>Özet: {item.summary} | Score: {item.score}</p>
                <p className="text-sm text-gray-500">
                  {new Date(item.created_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Henüz geçmiş işleminiz yok.</p>
        )}
      </div>
    </div>
  );
}
