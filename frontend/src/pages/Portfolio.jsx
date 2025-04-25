import { useState, useEffect } from 'react';

export default function Portfolio() {
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    // TODO: Gerçek API uç noktasına yönlendir
    fetch('/api/portfolio')
      .then((res) => res.json())
      .then((data) => setPositions(data))
      .catch(() => {});
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Portföy</h1>
      <div className="bg-white p-4 rounded shadow">
        {positions.length ? (
          <ul className="space-y-2">
            {positions.map((pos) => (
              <li key={pos.id} className="flex justify-between">
                <span>{pos.symbol}</span>
                <span>{pos.quantity} adet</span>
                <span>Giriş fiyatı: {pos.entry_price}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Henüz portföyünüz güncellenmedi.</p>
        )}
      </div>
    </div>
  );
}
