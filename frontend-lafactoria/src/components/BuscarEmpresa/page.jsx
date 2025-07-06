import React, { useState } from 'react';
import Cookies from 'js-cookie';
const API = process.env.REACT_APP_API;

function BuscarEmpresa() {
  const [rut, setRut] = useState('');
  const [resultado, setResultado] = useState(null);
  const token = Cookies.get('access_token');
  if (!token) {
        // Si no hay token, redirige al login o muestra un error
    setError('No estás autenticado. Por favor, inicia sesión.');
    return;
  }
  const buscarEmpresa = async () => {
    const res = await fetch(`${API}/empresas/buscar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
       },
      
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
