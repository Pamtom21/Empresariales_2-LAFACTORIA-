import React, { useState } from 'react';

const API = process.env.REACT_APP_API;

function EmpresaForm() {
  const [form, setForm] = useState({
    nombre: '',
    rut: '',
    giro: '',
    direccion: '',
    correo: ''
  });

  const [error, setError] = useState('');
  
  // Manejo de cambios en los inputs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Validación de campos antes de enviar
  const validateForm = () => {
    if (!form.nombre || !form.rut || !form.usuario_id) {
      return 'Faltan campos obligatorios';
    }
    return null;
  };

  // Enviar formulario al servidor
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errorMessage = validateForm();
    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    try {
      // Supongo que el usuario_id se agrega a través del contexto o es capturado del usuario logueado
      const res = await fetch(`${API}/empresas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        alert("✅ Empresa creada correctamente");
        setForm({ nombre: '', rut: '', giro: '', direccion: '', correo: '' });
        setError('');
      } else {
        // Mostrar mensaje de error detallado del backend
        const data = await res.json();
        setError(data.mensaje || 'Error al crear empresa');
      }
    } catch (error) {
      setError('Error de conexión con el servidor');
    }
  };

  return (
    <div className="card p-4 shadow-sm mb-4">
      <h2 className="mb-3">Registrar Nueva Empresa</h2>
      <form onSubmit={handleSubmit}>
        {["nombre", "rut", "giro", "direccion", "correo"].map(field => (
          <div className="mb-3" key={field}>
            <label className="form-label text-capitalize">{field}</label>
            <input
              className="form-control"
              name={field}
              value={form[field]}
              placeholder={`Ingrese ${field}`}
              onChange={handleChange}
              required={["nombre", "rut"].includes(field)}
            />
          </div>
        ))}
        <button className="btn btn-primary" type="submit">Crear Empresa</button>
      </form>
    </div>
  );
}

export default EmpresaForm;
