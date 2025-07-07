import React, { useState } from 'react';
import { Card, Button, Alert, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const API = process.env.REACT_APP_API;

function Compras({ carrito }) {
  const [mensaje, setMensaje] = useState('');
  const [clienteRut, setClienteRut] = useState('');
  const [clienteNombre, setClienteNombre] = useState('');
  const [clienteDireccion, setClienteDireccion] = useState('');
  const navigate = useNavigate();
  const token = Cookies.get('access_token');

  const total = carrito.reduce((sum, prod) => sum + prod.precio, 0);

  // Buscar empresa receptora para obtener datos completos (opcional)
  const buscarEmpresaReceptora = async (rut) => {
    try {
      const res = await fetch(`${API}/empresas/buscar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rut }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Empresa no encontrada');
      }

      return await res.json();
    } catch (error) {
      setMensaje(`❌ Error buscando empresa receptora: ${error.message}`);
      return null;
    }
  };

  const handlePagar = async () => {
    setMensaje('');
    if (!token) {
      setMensaje('⚠️ Usuario no autenticado');
      return;
    }

    if (!clienteRut) {
      setMensaje('⚠️ Debes ingresar el RUT de la empresa receptora');
      return;
    }

    // Opcional: si quieres que busque los datos automáticamente:
    let empresaReceptora = null;
    if (!clienteNombre || !clienteDireccion) {
      empresaReceptora = await buscarEmpresaReceptora(clienteRut);
      if (!empresaReceptora) return;
    }

    // Usa los datos ingresados manualmente o los obtenidos por búsqueda
    const nombreClienteFinal = clienteNombre || (empresaReceptora && empresaReceptora.nombre) || '';
    const direccionClienteFinal = clienteDireccion || (empresaReceptora && empresaReceptora.direccion) || '';

    if (!nombreClienteFinal || !direccionClienteFinal) {
      setMensaje('⚠️ Debes proporcionar nombre y dirección del cliente receptor');
      return;
    }

    try {
      const productos = carrito.map((prod) => ({
        nombre: prod.nombre,
        precio: prod.precio,
      }));

      const resFactura = await fetch(`${API}/facturas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          valor_neto: total,
          productos,
          cliente_rut: clienteRut,
          cliente_nombre: nombreClienteFinal,
          cliente_direccion: direccionClienteFinal,
        }),
      });

      const resultado = await resFactura.json();

      if (resFactura.ok) {
        setMensaje(`✅ Factura creada. Total con IVA: $${resultado.valor_con_iva}`);
        setTimeout(() => {
          navigate('/dashboard/pago');
        }, 2000);
      } else {
        setMensaje(`❌ Error al generar factura: ${resultado.error || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error(error);
      setMensaje('❌ Error de conexión con el servidor');
    }
  };

  return (
    <div>
      <h3>Resumen de compra</h3>

      {mensaje && (
        <Alert variant="info" className="text-center">
          {mensaje}
        </Alert>
      )}

      <Form.Group className="mb-3">
        <Form.Label>RUT de la empresa receptora</Form.Label>
        <Form.Control
          type="text"
          placeholder="Ej: 12345678-9"
          value={clienteRut}
          onChange={(e) => setClienteRut(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Nombre empresa receptora</Form.Label>
        <Form.Control
          type="text"
          placeholder="Nombre de la empresa receptora"
          value={clienteNombre}
          onChange={(e) => setClienteNombre(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Dirección empresa receptora</Form.Label>
        <Form.Control
          type="text"
          placeholder="Dirección de la empresa receptora"
          value={clienteDireccion}
          onChange={(e) => setClienteDireccion(e.target.value)}
        />
      </Form.Group>

      {carrito.length === 0 ? (
        <p className="text-muted">Tu carrito está vacío.</p>
      ) : (
        <>
          {carrito.map((prod, i) => (
            <Card key={i} className="mb-2 p-3">
              <strong>{prod.nombre}</strong> — ${prod.precio}
            </Card>
          ))}

          <h4 className="mt-3">Total Neto: ${total}</h4>
          <Button variant="primary" className="mt-3" onClick={handlePagar}>
            Pagar y generar factura
          </Button>
        </>
      )}
    </div>
  );
}

export default Compras;


