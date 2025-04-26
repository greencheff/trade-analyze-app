{analyzeResult.analysis && (
  <>
    <div className="grid grid-cols-3 gap-4 mt-6">
      {/* Özet Analiz */}
      <div className="col-span-3 md:col-span-2">
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-4">🔍 Özet Analiz</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <div className="text-gray-500 text-sm">Symbol</div>
              <div>{analyzeResult.symbol}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">Interval</div>
              <div>{analyzeResult.interval}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">Veri Sayısı</div>
              <div>{analyzeResult.candles_count}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">Ortalama Kapanış</div>
              <div>{analyzeResult.analysis.average_close}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">Ortalama Hacim</div>
              <div>{analyzeResult.analysis.average_volume}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">En Yüksek Fiyat</div>
              <div>{analyzeResult.analysis.highest_price}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">En Düşük Fiyat</div>
              <div>{analyzeResult.analysis.lowest_price}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">Trend Yönü</div>
              <div>{analyzeResult.analysis.trend_direction}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">Trend Gücü (%)</div>
              <div>{analyzeResult.analysis.trend_strength_percent} %</div>
            </div>
          </div>
        </div>
      </div>

      {/* İleri Düzey Analiz */}
      <div className="col-span-3 md:col-span-1 mt-6 md:mt-0">
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-4">⚡ İleri Düzey Analiz</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <div className="text-gray-500 text-sm">RSI Değeri</div>
              <div>{analyzeResult.analysis.rsi_value}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">EMA (14)</div>
              <div>{analyzeResult.analysis.ema_value}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">MACD</div>
              <div>{analyzeResult.analysis.macd_value}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">Stochastic %K</div>
              <div>{analyzeResult.analysis.stochastic_k_value}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">ADX Değeri</div>
              <div>{analyzeResult.analysis.adx_value}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
)}
