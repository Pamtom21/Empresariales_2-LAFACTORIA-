import React from 'react';
import { Card, Form, Button } from 'react-bootstrap';

function Configuracion() {
  return (
    <Card className="shadow p-4">
      <h4>Configuración de la Cuenta</h4>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Correo</Form.Label>
          <Form.Control type="email" placeholder="usuario@correo.com" disabled />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Contraseña nueva</Form.Label>
          <Form.Control type="password" placeholder="********" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Confirmar contraseña</Form.Label>
          <Form.Control type="password" placeholder="********" />
        </Form.Group>
        <Button variant="success">Guardar cambios</Button>
      </Form>
    </Card>
  );
}

export default Configuracion;
