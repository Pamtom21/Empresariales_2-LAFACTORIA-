import React, { useState, useEffect } from 'react';

const API = process.env.REACT_APP_API;

function FacturaForm() {
  const [empresas, setEmpresas] = useState([]);
  const [form, setForm] = useState({
    empresa_id: '',
    valor_neto: '',
    producto: ''
  });

  useEffect(() => {
    fetch(`${API}/empresas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(data => setEmpresas(data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productosParsed = [{ nombre: form.producto }];

    const res = await fetch(`${API}/facturas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        empresa_id: form.empresa_id,
        valor_neto: form.valor_neto,
        productos: productosParsed
      })
    });

    if (res.ok) {
      const data = await res.json();
      alert(`✅ Factura creada. Valor con IVA: $${data.valor_con_iva}`);
      setForm({ empresa_id: '', valor_neto: '', producto: '' });
    } else {
      alert("❌ Error al crear factura");
    }
  };


  return (
    <div className="card p-4 shadow-sm mb-5" style={{ maxWidth: '500px', margin: 'auto' }}>
      <h2 className="mb-4 text-center fw-bold text-primary">Nueva Factura</h2>
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
            min="0"
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
            min="0"
            value={form.valor_con_iva}
            readOnly
          />
        </div>


            
        <div className="mb-4">
          <label className="form-label">Nombre del Producto</label>
          <input
            className="form-control"
            name="producto"
            placeholder="Ej: Monitor LG"
            value={form.producto}
            onChange={handleChange}
            required
          />
        </div>

        <button className="btn btn-success w-100" type="submit">
          💾 Generar Factura
        </button>
      </form>
    </div>
  );
}

export default FacturaForm;
