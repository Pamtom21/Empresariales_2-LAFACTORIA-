import React, { useState, useEffect } from 'react';

const API_FACTURAS = `${process.env.REACT_APP_API}/facturas`;


function FacturaForm() {
  const [empresas, setEmpresas] = useState([]);
  const [form, setForm] = useState({
    empresa_id: '',
    valor_neto: '',
    cliente_rut: '',
    cliente_nombre: '',
    cliente_direccion: '',
    producto_nombre: ''
  });


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productosParsed = [
    {
      nombre: form.producto_nombre,
      precio: parseFloat(form.valor_neto)
    }
  ];


    const payload = {
      empresa_id: form.empresa_id,
      valor_neto: parseFloat(form.valor_neto),
      cliente_rut: form.cliente_rut,
      cliente_nombre: form.cliente_nombre,
      cliente_direccion: form.cliente_direccion,
      productos: productosParsed
    };

    console.log("Payload que se envía:", payload);
    const res = await fetch(API_FACTURAS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const json = await res.json();
      alert(`✅ Factura creada: ${json.mensaje}`);
      setForm({
        empresa_id: '',
        valor_neto: '',
        cliente_rut: '',
        cliente_nombre: '',
        cliente_direccion: '',
        producto_nombre: ''
      });
    } else {
      const err = await res.json();
      alert(`❌ Error al crear factura:\n${err.error || 'Revisar campos'}`);
    }
  };

  return (
    <div className="card p-4 shadow-sm mb-4">
      <h2 className="mb-3">Crear Factura</h2>
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
            value={form.valor_neto}
            onChange={handleChange}
            required
          />
        </div>

        {/* Cliente */}
        <div className="mb-3">
          <label className="form-label">RUT del Cliente</label>
          <input
            type="text"
            className="form-control"
            name="cliente_rut"
            value={form.cliente_rut}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Nombre del Cliente</label>
          <input
            type="text"
            className="form-control"
            name="cliente_nombre"
            value={form.cliente_nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Dirección del Cliente</label>
          <input
            type="text"
            className="form-control"
            name="cliente_direccion"
            value={form.cliente_direccion}
            onChange={handleChange}
            required
          />
        </div>

        {/* Productos */}
        {/* Nombre del Producto */}
        <div className="mb-3">
          <label className="form-label">Nombre del Producto</label>
          <input
            type="text"
            className="form-control"
            name="producto_nombre"
            placeholder="Ej: Servicio de Asesoría"
            value={form.producto_nombre}
            onChange={handleChange}
            required
          />
        </div>


        <button type="submit" className="btn btn-success w-100">Generar Factura</button>
      </form>
    </div>
  );
}

export default FacturaForm;
