import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (correo === 'admin@admin.com' && clave === '1234') {
      alert('Inicio de sesión exitoso ✅');
      navigate('/dashboard');
    } else {
      alert('Credenciales incorrectas ❌');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
      <div className="card p-4 shadow-sm" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="mb-3 text-center">Iniciar Sesión</h2>

        <p className="text-muted small text-center mb-2">
          <strong>Credenciales de prueba:</strong><br />
          Usuario: admin@admin.com<br />
          Clave: 1234
        </p>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Correo</label>
            <input
              type="email"
              className="form-control"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
              placeholder="admin@admin.com"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              required
              placeholder="1234"
            />
          </div>
          <button className="btn btn-primary w-100" type="submit">Ingresar</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
