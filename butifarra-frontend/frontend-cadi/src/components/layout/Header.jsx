import React from 'react';
import { FiBell, FiUser } from 'react-icons/fi';

export default function Header() {
  return (
    <header className="main-header">
      {/* Este div vacío empuja los iconos a la derecha. si se necesita añadir un titulo */}
      <div /> 
      
      <div className="header-actions">
        <button className="header-icon-btn">
          <FiBell />
        </button>
        <button className="header-icon-btn">
          <FiUser />
        </button>
      </div>
    </header>
  );
}