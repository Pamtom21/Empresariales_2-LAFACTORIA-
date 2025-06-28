import React, { useState } from 'react';

const API = process.env.REACT_APP_API;

function BuscarEmpresa() {
  const [rut, setRut] = useState('');
  const [resultado, setResultado] = useState(null);

  const buscarEmpresa = async () => {
    const res = await fetch(`${API}/empresas/buscar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rut })
    });

    const data = await res.json();
    setResultado(data);
  };

  return (
    <div className="card p-4 shadow-sm">
      <h2>Buscar Empresa por RUT</h2>
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Ingresa RUT"
        value={rut}
        onChange={(e) => setRut(e.target.value)}
      />
      <button className="btn btn-primary mb-3" onClick={buscarEmpresa}>
        Buscar
      </button>

      {resultado && (
        <div>
          <h5>Resultado:</h5>
          <pre>{JSON.stringify(resultado, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default BuscarEmpresa;
