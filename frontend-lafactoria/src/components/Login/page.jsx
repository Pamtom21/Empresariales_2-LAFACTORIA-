import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tab, Tabs, Form, Button, Card } from 'react-bootstrap';
import Cookies from 'js-cookie';

const API = process.env.REACT_APP_API;

function Login() {
  const [tab, setTab] = useState('login');
  const [rutLogin, setRutLogin] = useState('');
  const [clave, setClave] = useState('');
  const [razon, setRazon] = useState('');
  const [rut, setRut] = useState('');
  const [giro, setGiro] = useState('');
  const [correoReg, setCorreoReg] = useState('');
  const [claveReg, setClaveReg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const loginData = {
      rut: rutLogin,
      clave: clave,
    };

    try {
      const response = await fetch(`${API}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();
      console.log(result)

      if (response.ok) {
        // Guardamos el token en las cookies si el login es exitoso
        Cookies.set('access_token', result.token, {
          expires: 7, // El token expirará en 7 días
          secure: true,  // Asegura que se envíe solo a través de HTTPS
          sameSite: 'Strict',  // Protege contra CSRF
        });

        alert(`Bienvenido ${result.Nombre}`);
        navigate('/dashboard'); // Redirigir al dashboard
      } else {
        alert(result.message || 'Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Error al intentar iniciar sesión:', error);
      alert('Error de conexión, intenta de nuevo');
    }
  };


const handleRegister = async (e) => {
  e.preventDefault();

  const nuevaEmpresa = {
    razon: razon,
    rut : rut,
    giro : giro,
    correo: correoReg,
    clave: claveReg
  };

  // Enviar la solicitud POST al backend con los datos del registro
  try {
    const response = await fetch(`${API}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Asegúrate de que sea JSON
      },
      body: JSON.stringify(nuevaEmpresa), // Convierte los datos a JSON
    });

    if (response.ok) {
      // Si la respuesta es correcta, muestra mensaje
      const data = await response.json();
      alert(`Empresa "${razon}" registrada correctamente`);
      setTab('login');
    } else {
      // Si hay error en la respuesta
      alert('Error al registrar la empresa');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Hubo un problema al conectar con el servidor');
  }
};


  return (
    <div className="login-container">
      <div className="login-header">
        <h1>LaFactoria</h1>
      </div>

      <Card className="login-card shadow-lg">
        <Tabs activeKey={tab} onSelect={(k) => setTab(k)} className="mb-4" justify>
          <Tab eventKey="login" title="Iniciar Sesión">
            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3">
                <Form.Label>RUT</Form.Label>
                <Form.Control
                  type="text"
                  value={rutLogin}
                  onChange={(e) => setRutLogin(e.target.value)}
                  required
                  placeholder="21822676-0"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  value={clave}
                  onChange={(e) => setClave(e.target.value)}
                  required
                  placeholder="1234"
                />
              </Form.Group>
              <Button type="submit" variant="primary" className="w-100">Ingresar</Button>
              <p className="mt-3 text-muted text-center small">
                <strong>Credenciales de prueba:</strong><br />
                RUT: 21822676-0 | Clave: 1234
              </p>
            </Form>
          </Tab>

          <Tab eventKey="register" title="Registrar Empresa">
            <Form onSubmit={handleRegister}>
              <Form.Group className="mb-3">
                <Form.Label>Razón Social</Form.Label>
                <Form.Control
                  type="text"
                  value={razon}
                  onChange={(e) => setRazon(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>RUT</Form.Label>
                <Form.Control
                  type="text"
                  value={rut}
                  onChange={(e) => setRut(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Giro</Form.Label>
                <Form.Control
                  type="text"
                  value={giro}
                  onChange={(e) => setGiro(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Correo</Form.Label>
                <Form.Control
                  type="email"
                  value={correoReg}
                  onChange={(e) => setCorreoReg(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  value={claveReg}
                  onChange={(e) => setClaveReg(e.target.value)}
                  required
                />
              </Form.Group>
              <Button type="submit" variant="success" className="w-100">Registrar Empresa</Button>
            </Form>
          </Tab>
        </Tabs>
      </Card>
    </div>
  );
}

export default Login;
