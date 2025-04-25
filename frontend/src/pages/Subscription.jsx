import { useState } from 'react';

export default function Subscription() {
  const [plans] = useState([
    { name: 'Trial', desc: '7 gün ücretsiz', price: '0 TL' },
    { name: 'Basic', desc: '3 strateji, 30 analiz', price: '249 TL' },
    { name: 'Pro', desc: '10 strateji, limitsiz analiz', price: '799 TL' },
  ]);
  const [selected, setSelected] = useState(null);

  const handleSubscribe = (plan) => {
    // TODO: Abonelik API’sine çağrı
    setSelected(plan.name);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Abonelik Planları</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`p-6 rounded shadow ${
              selected === plan.name ? 'border-2 border-blue-600' : 'border'
            } bg-white`}
          >
            <h2 className="text-xl font-semibold mb-2">{plan.name}</h2>
            <p className="mb-4">{plan.desc}</p>
            <p className="text-2xl font-bold mb-4">{plan.price}</p>
            <button
              onClick={() => handleSubscribe(plan)}
              className="w-full bg-green-500 text-white py-2 rounded"
            >
              {selected === plan.name ? 'Seçili' : 'Seç'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
