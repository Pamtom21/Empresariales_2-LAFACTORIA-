import React, { useState } from 'react';
import { Card, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Compras({ carrito }) {
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const total = carrito.reduce((sum, prod) => sum + prod.precio, 0);

  const handlePagar = () => {
    setMensaje('Redireccionando a la página de pagos...');
    setTimeout(() => {
      navigate('/dashboard/pago');
    }, 2000);
  };

  return (
    <Card className="shadow p-4">
      <h3 className="mb-4">Carrito de Compras</h3>

      {mensaje && <Alert variant="info">{mensaje}</Alert>}

      {carrito.length === 0 ? (
        <p>No hay productos en el carrito.</p>
      ) : (
        <>
          <ul className="list-group mb-4">
            {carrito.map((p, i) => (
              <li key={i} className="list-group-item d-flex justify-content-between">
                <span>{p.nombre}</span>
                <strong>${p.precio}</strong>
              </li>
            ))}
            <li className="list-group-item d-flex justify-content-between bg-light">
              <span><strong>Total</strong></span>
              <strong>${total}</strong>
            </li>
          </ul>

          <Button variant="success" className="w-100" onClick={handlePagar}>
            Pagar Ahora
          </Button>
        </>
      )}
    </Card>
  );
}

export default Compras;
