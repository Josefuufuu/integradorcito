import React from 'react';
import PropTypes from 'prop-types';
import { FiX } from 'react-icons/fi';
import './Modal.css';

export default function Modal({ isOpen, open, onClose, title, children }) {
  const visible = typeof isOpen === 'boolean' ? isOpen : open;

  if (!visible) {
    return null;
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal-content" onClick={(event) => event.stopPropagation()}>
        <header className="modal-header">
          <h2>{title}</h2>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Cerrar">
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

Modal.propTypes = {
  isOpen: PropTypes.bool,
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node,
};

Modal.defaultProps = {
  isOpen: undefined,
  open: undefined,
  title: undefined,
  children: null,
};
