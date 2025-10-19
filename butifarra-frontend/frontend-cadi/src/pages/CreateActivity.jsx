import React, { useState, useRef } from 'react';
import AppLayout from '../components/layout/AppLayout.jsx';

export default function CreateActivity() {
  const initialFormState = {
    titulo: '', tipo: '', fecha: '', lugar: '',
    hora_inicio: '', hora_fin: '', descripcion: '',
  };
  const [formData, setFormData] = useState(initialFormState);
  const [imagePreview, setImagePreview] = useState(null);
  const formRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const handleReset = () => {
    setFormData(initialFormState);
    setImagePreview(null);
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  return (
    <AppLayout>
      <div className="page-container" style={{ margin: 0, maxWidth: '100%', padding: 0 }}>
        <header className="page-header">
          <h1>Crear nueva actividad</h1>
          <p>Completa los detalles de la nueva actividad CADI</p>
        </header>
        <div className="create-activity-layout">
          <div className="form-column">
            <div className="form-card">
              <form id="create-activity-form" ref={formRef} className="form-grid">
                  
                  <div className="form-field">
                    <label htmlFor="titulo">Título de la actividad</label>
                    <input id="titulo" name="titulo" value={formData.titulo} onChange={handleInputChange} required 
                           placeholder="Ej. Torneo de Ajedrez" />
                  </div>
                  <div className="form-field">
                    <label htmlFor="tipo">Tipo / Categoría</label>
                    <select id="tipo" name="tipo" value={formData.tipo} onChange={handleInputChange} required>
                      <option value="">Selecciona...</option>
                      <option value="DEPORTE">Deporte</option>
                      <option value="CULTURA">Cultura</option>
                      <option value="SALUD">Salud/PSU</option>  
                      <option value="VOLUNTARIADO">Voluntariado</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label htmlFor="fecha">Fecha</label>
                    <input id="fecha" name="fecha" type="date" value={formData.fecha} onChange={handleInputChange} required />
                  </div>
                  <div className="form-field">
                    <label htmlFor="lugar">Lugar</label>
                    <input id="lugar" name="lugar" value={formData.lugar} onChange={handleInputChange} required 
                           placeholder="Ej. Coliseo / Salón 302-C" />
                  </div>
                  <div className="form-field">
                    <label htmlFor="hora_inicio">Hora de inicio</label>
                    <input id="hora_inicio" name="hora_inicio" type="time" value={formData.hora_inicio} onChange={handleInputChange} required />
                  </div>
                  <div className="form-field">
                    <label htmlFor="hora_fin">Hora de fin</label>
                    <input id="hora_fin" name="hora_fin" type="time" value={formData.hora_fin} onChange={handleInputChange} required />
                  </div>
                  <div className="form-field">
                    <label htmlFor="cupo">Cupos disponibles</label>
                    <input id="cupo" name="cupo" type="number" min="1" required 
                           placeholder="Ej. 30" />
                  </div>
                  <div className="form-field full-width">
                    <label htmlFor="descripcion">Descripción</label>
                    <textarea id="descripcion" name="descripcion" placeholder="Detalles, requisitos, materiales..." rows="4" required 
                              value={formData.descripcion} onChange={handleInputChange}></textarea>
                  </div>
                  <div className="form-field full-width">
                    <label htmlFor="portada">Imagen de portada (opcional)</label>
                    <input id="portada" name="portada" type="file" accept="image/*" onChange={handleImageChange} />
                  </div>

                  <div className="form-actions full-width">
                    <button type="button" className="btn btn-secondary" onClick={handleReset}>Limpiar</button>
                    <button type="submit" className="btn btn-primary">Crear actividad</button>
                  </div>
              </form>
            </div>
          </div>
          <div className="preview-column">
            <div className="activity-preview-card">
              <div className="preview-header">Vista Previa</div>
              <div className="preview-content">
                <div className="preview-image-container">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Vista previa" className="preview-image" />
                  ) : (
                    <div className="preview-image-placeholder"><span>📷</span></div>
                  )}
                </div>
                <h3 className="preview-title">{formData.titulo || '(Título)'}</h3>
                <div className="preview-tags">
                  {formData.tipo && <span className="preview-tag">{formData.tipo}</span>}
                </div>
                <ul className="preview-details">
                  <li>📍 {formData.lugar || '(Lugar)'}</li>
                  <li>🗓️ {formData.fecha || '(Fecha)'}</li>
                  <li>⏰ {formData.hora_inicio || '--:--'} - {formData.hora_fin || '--:--'}</li>
                </ul>
                {formData.descripcion && <p className="preview-description">{formData.descripcion}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}