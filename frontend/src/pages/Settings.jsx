import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';

export default function Settings() {
  const { user } = useContext(AuthContext);
  const [tvKey, setTvKey] = useState('');

  useEffect(() => {
    // TODO: Kullanıcı ayarlarını API’dan çek
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => setTvKey(data.tradingview_api_key))
      .catch(() => {});
  }, []);

  const handleSave = () => {
    // TODO: Ayarları API’ya kaydet
    fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tradingview_api_key: tvKey }),
    });
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Ayarlar</h1>
      <div className="bg-white p-6 rounded shadow max-w-md">
        <label className="block mb-2">TradingView API Key</label>
        <input
          type="text"
          value={tvKey}
          onChange={(e) => setTvKey(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />
        <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded">
          Kaydet
        </button>
      </div>
    </div>
  );
}
