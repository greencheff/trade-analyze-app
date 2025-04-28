// src/components/IndicatorDropdown.jsx

import React, { useState } from 'react';

const IndicatorDropdown = ({ indicatorValues, onAnalyze }) => {
  const [selectedIndicator, setSelectedIndicator] = useState('');

  const handleSelectChange = (e) => {
    setSelectedIndicator(e.target.value);
  };

  const handleAnalyzeClick = () => {
    if (selectedIndicator) {
      onAnalyze(selectedIndicator);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">İndikatör Seçimi</h2>

      {/* Dropdown Menüsü */}
      <select
        className="border p-2 rounded w-full mb-4"
        onChange={handleSelectChange}
        value={selectedIndicator}
      >
        <option value="">Bir İndikatör Seçiniz</option>
        {Object.keys(indicatorValues).map((indicatorName) => (
          <option key={indicatorName} value={indicatorName}>
            {indicatorName}
          </option>
        ))}
      </select>

      {/* Analiz Et Butonu */}
      <button
        className={`w-full p-2 rounded text-white ${
          selectedIndicator ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
        }`}
        onClick={handleAnalyzeClick}
        disabled={!selectedIndicator}
      >
        Analiz Et
      </button>
    </div>
  );
};

export default IndicatorDropdown;
