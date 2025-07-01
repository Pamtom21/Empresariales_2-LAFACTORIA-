import React, { useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap';

function Pago() {
  const [metodo, setMetodo] = useState('');
  const [datos, setDatos] = useState({
    numero: '',
    vencimiento: '',
    cvv: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Pago procesado con ${metodo.toUpperCase()}`);
  };

  return (
    <Card className="shadow p-4">
      <h3 className="mb-4">Pago</h3>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Método de Pago</Form.Label>
          <Form.Select value={metodo} onChange={(e) => setMetodo(e.target.value)} required>
            <option value="">Selecciona una opción</option>
            <option value="debito">Débito</option>
            <option value="credito">Crédito</option>
            <option value="prepago">Tarjeta Prepago</option>
            <option value="paypal">PayPal</option>
          </Form.Select>
        </Form.Group>

        {metodo !== '' && metodo !== 'paypal' && (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Número de Tarjeta</Form.Label>
              <Form.Control
                type="text"
                placeholder="0000 0000 0000 0000"
                value={datos.numero}
                onChange={(e) => setDatos({ ...datos, numero: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fecha de Vencimiento</Form.Label>
              <Form.Control
                type="month"
                value={datos.vencimiento}
                onChange={(e) => setDatos({ ...datos, vencimiento: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>CVV</Form.Label>
              <Form.Control
                type="password"
                placeholder="123"
                maxLength="3"
                value={datos.cvv}
                onChange={(e) => setDatos({ ...datos, cvv: e.target.value })}
                required
              />
            </Form.Group>
          </>
        )}

        <Button variant="primary" type="submit" className="w-100" disabled={!metodo}>
          Confirmar Pago
        </Button>
      </Form>
    </Card>
  );
}

export default Pago;
