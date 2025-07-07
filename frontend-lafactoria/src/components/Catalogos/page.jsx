import React, { useState } from 'react';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import Cookies from 'js-cookie';
const API = process.env.REACT_APP_API;
function Catalogos({ productos, setProductos, agregarAlCarrito }) {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [imagenURL, setImagenURL] = useState('');
  const [imagenFile, setImagenFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [mensaje, setMensaje] = useState('');

  const handleImagenFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagenFile(file);
      setImagenURL('');
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleImagenURLChange = (e) => {
    const url = e.target.value;
    setImagenURL(url);
    setImagenFile(null);
    setPreview(url || null);
  };

const handleAgregar = async () => {
  if (!nombre || !precio) return;

  const token = Cookies.get('access_token'); // Asumiendo que guardas el JWT en localStorage
  if (!token) {
    setMensaje('⚠️ Usuario no autenticado');
    return;
  }

  const nuevoProducto = {
    nombre,
    precio: parseInt(precio),
    imagen: preview || null
  };

  try {
    const response = await fetch(`${API}/productos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(nuevoProducto),
    });

    if (response.ok) {
      const data = await response.json();
      setProductos([...productos, { ...nuevoProducto, id: Date.now() }]);
      setNombre('');
      setPrecio('');
      setImagenURL('');
      setImagenFile(null);
      setPreview(null);
      setMensaje('✅ Producto agregado exitosamente');
      setTimeout(() => setMensaje(''), 2000);
    } else {
      const error = await response.json();
      setMensaje(`❌ Error al guardar: ${error.error || 'Error desconocido'}`);
    }
  } catch (error) {
    console.error('Error al conectar con la API:', error);
    setMensaje('❌ Error de conexión con el servidor');
  }
};

  const handleAgregarAlCarrito = (producto) => {
    agregarAlCarrito(producto);
    setMensaje(`🛒 "${producto.nombre}" se ha añadido al carrito`);
    setTimeout(() => setMensaje(''), 2000);
  };

  return (
    <div>
      <h3 className="mb-4">Gestión de Catálogos</h3>

      {mensaje && (
        <Alert variant="success" className="text-center">
          {mensaje}
        </Alert>
      )}

      <Card className="mb-4 p-3">
        <Form>
          <Row className="mb-3">
            <Col>
              <Form.Control
                placeholder="Nombre del producto"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </Col>
            <Col>
              <Form.Control
                type="number"
                placeholder="Precio"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
              />
            </Col>
            <Col xs="auto">
              <Button onClick={handleAgregar}>Agregar Producto</Button>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Control
                type="text"
                placeholder="URL de imagen (opcional)"
                value={imagenURL}
                onChange={handleImagenURLChange}
              />
            </Col>
            <Col>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImagenFileChange}
              />
            </Col>
          </Row>

          {preview && (
            <div className="mt-3 text-center">
              <img
                src={preview}
                alt="Vista previa"
                style={{ maxWidth: '200px', borderRadius: '8px' }}
              />
            </div>
          )}
        </Form>
      </Card>

      <h4>Productos Registrados</h4>
      {productos.length === 0 ? (
        <p className="text-muted">Aún no hay productos.</p>
      ) : (
        productos.map((p) => (
          <Card key={p.id} className="mb-3 p-3 d-flex flex-row align-items-center">
            {p.imagen && (
              <img
                src={p.imagen}
                alt={p.nombre}
                style={{ maxWidth: '100px', marginRight: '20px', borderRadius: '8px' }}
              />
            )}
            <div className="flex-grow-1">
              <h5>{p.nombre}</h5>
              <p>Precio: ${p.precio}</p>
              <Button variant="success" onClick={() => handleAgregarAlCarrito(p)}>
                Añadir al carrito
              </Button>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}

export default Catalogos;
