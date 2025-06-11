import React, { useState } from 'react';

const API = 'http://localhost:5000/empresas';

function EmpresaForm() {
  const [form, setForm] = useState({
    nombre: '',
    rut: '',
    giro: '',
    direccion: '',
    correo: ''
  });

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      alert("✅ Empresa creada correctamente");
      setForm({ nombre: '', rut: '', giro: '', direccion: '', correo: '' });
    } else {
      alert("❌ Error al crear empresa");
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
