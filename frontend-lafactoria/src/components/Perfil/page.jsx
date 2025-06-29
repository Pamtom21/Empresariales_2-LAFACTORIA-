import React from 'react';
import { Card, Row, Col, Image, Button } from 'react-bootstrap';


function Perfil() {
  return (
    <Card className="shadow p-4">
      <Row>
        <Col md={4} className="text-center">
          <Image src="https://via.placeholder.com/150" roundedCircle fluid />
          <h4 className="mt-3">Nombre del Usuario</h4>
          <p className="text-muted">usuario@correo.com</p>
          <Button variant="outline-primary">Editar Perfil</Button>
        </Col>
        <Col md={8}>
          <h5 className="mb-3">Detalles del Perfil</h5>
          <p><strong>Empresa:</strong> LaFactoria Ltda.</p>
          <p><strong>Giro:</strong> Servicios de Software</p>
          <p><strong>RUT:</strong> 12.345.678-9</p>
          <p><strong>Correo:</strong> usuario@correo.com</p>
        </Col>
      </Row>
    </Card>
  );
}

export default Perfil;
