
import React, { useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [symbol, setSymbol] = useState("");
  const [interval, setInterval] = useState("1m");
  const [selectedIndicator, setSelectedIndicator] = useState("");
  const [result, setResult] = useState(null);

  const handleIndicatorAnalysis = async () => {
    if (!selectedIndicator) {
      alert("Lütfen bir indikatör seçin!");
      return;
    }
    try {
      const response = await axios.post("https://trade-analyze-backend.onrender.com/api/indicator", {
        symbol,
        interval,
        indicator: selectedIndicator,
      });
      setResult(response.data);
    } catch (error) {
      console.error(error);
      alert("İndikatör analizi sırasında hata oluştu.");
    }
  };

  const handleAnalysis = async () => {
    try {
      const response = await axios.post("https://trade-analyze-backend.onrender.com/api/analyze", {
        symbol,
        interval,
      });
      setResult(response.data);
    } catch (error) {
      console.error(error);
      alert("Analiz yapılırken hata oluştu.");
    }
  };

  const indicatorOptions = [
    "average_close",
    "average_volume",
    "calculate_accumulation_distribution",
    "calculate_advance_decline_ratio",
    "calculate_adx",
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard</h2>
      <div>
        <h3>İndikatör Seçimi</h3>
        <select
          value={selectedIndicator}
          onChange={(e) => setSelectedIndicator(e.target.value)}
        >
          <option value="">Bir indikatör seçin</option>
          {indicatorOptions.map((indicator) => (
            <option key={indicator} value={indicator}>
              {indicator}
            </option>
          ))}
        </select>
        <button onClick={handleIndicatorAnalysis}>Seçili İndikatörü Analiz Et</button>
      </div>

      <div style={{ marginTop: "30px" }}>
        <h3>Analiz Başlat</h3>
        <input
          type="text"
          placeholder="BTCUSDT gibi"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        />
        <select
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
        >
          <option value="1m">1 Dakika</option>
          <option value="5m">5 Dakika</option>
          <option value="1h">1 Saat</option>
        </select>
        <button onClick={handleAnalysis}>Analiz Et</button>
      </div>

      {result && (
        <div style={{ marginTop: "30px" }}>
          <h3>Sonuç</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
