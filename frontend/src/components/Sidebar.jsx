// src/components/Sidebar.jsx
import React from 'react';

const Sidebar = () => {
  return (
    <div className="sidebar bg-gray-800 text-white p-4 w-64">
      <h2 className="font-bold text-lg">Menu</h2>
      <ul>
        <li>Dashboard</li>
        <li>Settings</li>
        <li>Portfolio</li>
      </ul>
    </div>
  );
};

export default Sidebar;
