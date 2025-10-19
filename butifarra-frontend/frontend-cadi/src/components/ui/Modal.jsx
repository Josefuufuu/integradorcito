import React from 'react';
import { FiX } from 'react-icons/fi';
import './Modal.css';

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) {
    return null; // Si no está abierto, no renderices nada
  }

  return (
    // El fondo oscuro semitransparente
    <div className="modal-overlay" onClick={onClose}>
      {/* El contenedor blanco de la ventana */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <FiX />
          </button>
        </header>
        <main className="modal-body">
          {children}
        </main>
      </div>
    </div>
  );
}