import { Link } from 'react-router-dom';
export default function Landing() {
  return (<div className="p-8 max-w-4xl mx-auto">
    <header className="flex justify-between items-center mb-12">
      <h1 className="text-3xl font-bold">Trade Analyzer</h1>
      <Link to="/auth" className="bg-orange-500 text-white px-4 py-2 rounded">7 Gün Ücretsiz Dene</Link>
    </header>
    <section className="text-center mb-16">
      <h2 className="text-2xl mb-4">Gerçek Zamanda Trade Analizinde Yeni Dönem</h2>
      <p>Pozisyonlarını anında değerlendiriş, hatalarını anında düzelt.</p>
    </section>
    <section className="grid grid-cols-3 gap-6 mb-16">
      {['RSI','MACD','EMA'].map(f=> <div key={f} className="bg-white p-6 rounded shadow"><h3 className="font-semibold mb-2">{f}</h3><p>Detaylı açıklama burada.</p></div>)}
    </section>
    <section className="text-center">
      <Link to="/subscription" className="bg-blue-600 text-white px-6 py-3 rounded">Paketrı Gör</Link>
    </section>
  </div>);
}
