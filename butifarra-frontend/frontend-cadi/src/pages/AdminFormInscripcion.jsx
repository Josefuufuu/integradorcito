import React, { useState } from "react";

export default function AdminFormInscripcion() {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    taller: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es obligatorio";
    if (!formData.correo.includes("@")) newErrors.correo = "Correo inválido";
    if (!formData.taller) newErrors.taller = "Selecciona un taller";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      alert("✅ Inscripción registrada con éxito!");
      setFormData({ nombre: "", correo: "", taller: "" });
      setErrors({});
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Encabezado */}
      <header className="bg-indigo-700 text-white py-4 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-6">
          {/* Logo (puede ser una imagen o solo texto por ahora) */}
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold">🎓 CADI</span>
          </div>
          <h1 className="text-xl font-semibold">Panel de Administrador</h1>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex justify-center items-center py-10">
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">
            Formulario de Inscripción
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Nombre */}
            <div>
              <label className="block font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ingresa tu nombre"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre}</p>}
            </div>

            {/* Correo */}
            <div>
              <label className="block font-medium text-gray-700">Correo</label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                placeholder="ejemplo@correo.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              {errors.correo && <p className="text-red-500 text-sm">{errors.correo}</p>}
            </div>

            {/* Taller */}
            <div>
              <label className="block font-medium text-gray-700">Selecciona un taller</label>
              <select
                name="taller"
                value={formData.taller}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">-- Selecciona --</option>
                <option value="arte">🎨 Arte</option>
                <option value="deporte">⚽ Deporte</option>
                <option value="musica">🎶 Música</option>
              </select>
              {errors.taller && <p className="text-red-500 text-sm">{errors.taller}</p>}
            </div>

            {/* Botón */}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Enviar inscripción
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
