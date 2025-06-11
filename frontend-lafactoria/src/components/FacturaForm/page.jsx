import React, { useState, useEffect } from 'react';

const API_FACTURAS = 'http://localhost:5000/facturas';
const API_EMPRESAS = 'http://localhost:5000/empresas';

function FacturaForm() {
  const [empresas, setEmpresas] = useState([]);
  const [form, setForm] = useState({
    empresa_id: '',
    valor_neto: '',
    valor_con_iva: '',
    productos: ''
  });

  useEffect(() => {
  fetch('http://localhost:5000/empresas/list', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  })
    .then(res => res.json())
    .then(data => setEmpresas(data));
}, []);


  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let productosParsed = null;
    try {
      productosParsed = JSON.parse(form.productos || '[]');
    } catch (err) {
      return alert("❌ El campo productos debe ser un JSON válido.");
    }

    const res = await fetch(API_FACTURAS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, productos: productosParsed })
    });

    if (res.ok) {
      alert("✅ Factura creada correctamente");
      setForm({ empresa_id: '', valor_neto: '', valor_con_iva: '', productos: '' });
    } else {
      alert("❌ Error al crear factura");
    }
  };

  return (
    <div className="card p-4 shadow-sm mb-4">
      <h2 className="mb-3">Crear Factura</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Empresa</label>
          <select
            className="form-select"
            name="empresa_id"
            value={form.empresa_id}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona una empresa</option>
            {empresas.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.nombre}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Valor Neto</label>
          <input
            className="form-control"
            name="valor_neto"
            type="number"
            value={form.valor_neto}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Valor con IVA</label>
          <input
            className="form-control"
            name="valor_con_iva"
            type="number"
            value={form.valor_con_iva}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Productos (JSON)</label>
          <textarea
            className="form-control"
            name="productos"
            placeholder='[{"nombre": "prod1", "precio": 1000}]'
            value={form.productos}
            onChange={handleChange}
          />
        </div>

        <button className="btn btn-success" type="submit">Generar Factura</button>
      </form>
    </div>
  );
}

export default FacturaForm;
