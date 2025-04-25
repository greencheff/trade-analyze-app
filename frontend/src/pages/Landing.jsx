import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <header className="bg-white shadow">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          {/* Logo */}
          <div className="text-2xl font-bold text-indigo-800">
            Trade Analyzer
          </div>

          {/* Menü (ortada) */}
          <nav className="hidden md:flex space-x-8 text-gray-700">
            <Link to="/" className="hover:text-indigo-800">Ana Sayfa</Link>
            <Link to="/auth" className="hover:text-indigo-800">Giriş Yap</Link>
          </nav>

          {/* CTA */}
          <Link
            to="/subscription"
            className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
          >
            7 Gün Ücretsiz Dene
          </Link>

          {/* Mobil menü butonu (opsiyonel) */}
          <button className="md:hidden text-gray-700">
            {/* hamburger icon */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-grow flex items-center justify-center text-center px-6">
        <div className="max-w-xl">
          <h1 className="text-5xl font-extrabold mb-4 text-gray-900">
            Gerçek Zamanlı Trade Analizinde Yeni Dönem
          </h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Pozisyonlarını anında değerlendir, hatalarını anında düzelt. Hemen başla, profesyonel analist cebinde!
          </p>
          <Link
            to="/subscription"
            className="inline-block bg-indigo-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-900 transition"
          >
            Paketleri Gör
          </Link>
        </div>
      </section>

      {/* Özellikler */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Özelliklerimiz</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 border rounded-lg hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">RSI Analizi</h3>
              <p className="text-gray-600">Aşırı alım/satım seviyelerini anında tespit edin.</p>
            </div>
            <div className="p-6 border rounded-lg hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">MACD &amp; EMA</h3>
              <p className="text-gray-600">Trend dönüşlerini ve momentumu güçlü bir şekilde izleyin.</p>
            </div>
            <div className="p-6 border rounded-lg hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">Formasyon &amp; Mum Çubuğu</h3>
              <p className="text-gray-600">Formasyon ve mum yapılarıyla desteklenen sinyaller.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Kullanıcılarımız Ne Diyor?</h2>
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

      {/* Abonelik Planları */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">Abonelik Planları</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Trial', desc: '7 gün ücretsiz', price: '0 TL', highlight: false },
              { name: 'Basic', desc: '3 strateji, 30 analiz', price: '249 TL', highlight: true },
              { name: 'Pro', desc: '10 strateji, limitsiz analiz', price: '799 TL', highlight: false },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`p-6 rounded-lg border ${
                  plan.highlight ? 'border-indigo-800 shadow-lg' : 'border-gray-200'
                }`}
              >
                <h3 className="text-2xl font-semibold mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.desc}</p>
                <p className="text-4xl font-bold mb-6">{plan.price}</p>
                <Link
                  to="/subscription"
                  className={`px-6 py-2 rounded-md font-medium transition ${
                    plan.highlight
                      ? 'bg-indigo-800 text-white hover:bg-indigo-900'
                      : 'bg-white text-indigo-800 border border-indigo-800 hover:bg-indigo-50'
                  }`}
                >
                  {plan.highlight ? 'En Popüler' : 'Seç'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-800 text-white py-6">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} Trade Analyzer. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  )
}
