import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
const API = process.env.REACT_APP_API;

function FacturaForm() {
  const [empresas, setEmpresas] = useState([]);
  const [form, setForm] = useState({
    empresa_id: '',
    valor_neto: '',
    producto: ''
  });
  const token = Cookies.get('access_token');
  useEffect(() => {
    fetch(`${API}/empresas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
       }
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
      headers: { 'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
       },
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
      const err = await res.json();
      alert(`❌ Error al crear factura:\n${err.error || 'Revisar campos'}`);
    }
  };


  return (
    <div className="card p-4 shadow-sm mb-5" style={{ maxWidth: '500px', margin: 'auto' }}>
      <h2 className="mb-4 text-center fw-bold text-primary">Nueva Factura</h2>
      <form onSubmit={handleSubmit}>

        {/* Buscar Empresa por RUT */}
        <div className="mb-3">
          <label className="form-label">RUT Empresa</label>
          <input
            type="text"
            className="form-control"
            name="buscar_rut"
            placeholder="Ej: 11111111-1"
            onChange={handleChange}
            onBlur={async () => {
              try {
                const res = await fetch(`${process.env.REACT_APP_API}/empresas/buscar`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ rut: form.buscar_rut })
                });

                if (!res.ok) throw await res.json();

                const empresa = await res.json();

                // Rellenar empresa y cliente automáticamente
                setEmpresas([empresa]);
                setForm(prev => ({
                  ...prev,
                  empresa_id: empresa.id,
                  cliente_rut: empresa.rut,
                  cliente_nombre: empresa.nombre,
                  cliente_direccion: empresa.direccion
                }));
              } catch (err) {
                alert(`❌ Empresa no encontrada:\n${err.error || 'RUT inválido'}`);
                setEmpresas([]);
                setForm(prev => ({
                  ...prev,
                  empresa_id: '',
                  cliente_rut: '',
                  cliente_nombre: '',
                  cliente_direccion: ''
                }));
              }
            }}
          />
        </div>



        {/* Valor Neto */}
        <div className="mb-3">
          <label className="form-label">Valor Neto</label>
          <input
            type="number"
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
          <label className="form-label">Nombre del Cliente</label>
          <input
            type="text"
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
