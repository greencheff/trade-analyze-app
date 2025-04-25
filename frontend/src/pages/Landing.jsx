import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Navbar */}
      <header className="bg-white shadow">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <h1 className="text-2xl font-bold text-indigo-800">Trade Analyzer</h1>
          <nav className="space-x-4">
            <Link to="/" className="text-gray-700 hover:text-indigo-800">Ana Sayfa</Link>
            <Link to="/auth" className="text-gray-700 hover:text-indigo-800">Giriş Yap</Link>
            <Link to="/subscription" className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600">
              7 Gün Ücretsiz Dene
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-grow flex items-center justify-center text-center px-6">
        <div className="max-w-2xl">
          <h2 className="text-4xl font-extrabold mb-4 text-gray-800">Gerçek Zamanlı Trade Analizinde Yeni Dönem</h2>
          <p className="text-gray-600 mb-6">
            Pozisyonlarını anında değerlendir, hatalarını anında düzelt. Hemen başla, profesyonel analist cebinde!
          </p>
          <Link
            to="/subscription"
            className="inline-block bg-indigo-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-900"
          >
            Paketleri Gör
          </Link>
        </div>
      </section>

      {/* Özellikler */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-bold text-center mb-12">Özelliklerimiz</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 border rounded-lg">
              <h4 className="text-xl font-semibold mb-2">RSI Analizi</h4>
              <p className="text-gray-600">Aşırı alım/satım seviyelerini anında tespit edin.</p>
            </div>
            <div className="text-center p-6 border rounded-lg">
              <h4 className="text-xl font-semibold mb-2">MACD & EMA</h4>
              <p className="text-gray-600">Trend dönüşlerini ve momentumu güçlü bir şekilde izleyin.</p>
            </div>
            <div className="text-center p-6 border rounded-lg">
              <h4 className="text-xl font-semibold mb-2">Formasyon & Mum Çubuğu</h4>
              <p className="text-gray-600">Teknik formasyon ve mum değil, gerçek zamanlı tespit.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-8">Kullanıcılarımız Ne Diyor?</h3>
          <div className="space-y-8">
            <blockquote className="bg-white p-6 rounded-lg shadow">
              <p className="italic text-gray-700">
                “Trade Analyzer’ı kullanmaya başladıktan sonra sinyallerimi %30 daha doğru alır oldum. Kesinlikle tavsiye ederim!”
              </p>
              <cite className="block mt-4 font-semibold">— Ahmet T.</cite>
            </blockquote>
            <blockquote className="bg-white p-6 rounded-lg shadow">
              <p className="italic text-gray-700">
                “Gerçek zamanlı geri bildirimler hem hızlı hem de çok açıklayıcı. İş yükümü büyük oranda azalttı.”
              </p>
              <cite className="block mt-4 font-semibold">— Ece Y.</cite>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Paketler */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-8">Abonelik Planları</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Trial', desc: '7 gün ücretsiz', price: '0 TL' },
              { name: 'Basic', desc: '3 strateji, 30 analiz', price: '249 TL' },
              { name: 'Pro', desc: '10 strateji, limitsiz analiz', price: '799 TL' },
            ].map((plan) => (
              <div key={plan.name} className="p-6 border rounded-lg">
                <h4 className="text-2xl font-semibold mb-2">{plan.name}</h4>
                <p className="text-gray-600 mb-4">{plan.desc}</p>
                <p className="text-3xl font-bold mb-6">{plan.price}</p>
                <Link
                  to="/subscription"
                  className="inline-block bg-indigo-800 text-white px-4 py-2 rounded hover:bg-indigo-900"
                >
                  Seç
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-800 text-white py-6">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; {new Date().getFullYear()} Trade Analyzer. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}
