# Documentación del Endpoint: Creación de Factura Electrónica

Este endpoint permite crear y enviar una factura electrónica asociada a una empresa, utilizando LibreDTE para la generación y timbrado del documento.

---

## Solicitud (Request)

El endpoint recibe un JSON con la siguiente estructura:

```json
{
  "empresa_id": "uuid-de-la-empresa",        // ID generado al crear empresa
  "valor_neto": 100000,                      // Valor sin IVA
  "cliente_rut": "11111111-1",               // RUT del cliente (Receptor)
  "cliente_nombre": "Juan Pérez",            // Nombre del cliente
  "cliente_direccion": "Calle Falsa 123",   // Dirección del cliente
  "productos": [                             // Lista de productos o servicios facturados
    {
      "NmbItem": "Desarrollo Web",          // Nombre del producto/servicio
      "QtyItem": 1,                         // Cantidad
      "PrcItem": 100000                     // Precio unitario
    }
  ]
}
en el caso de resivir bien los datos este respondera con esto
{
  "mensaje": "Factura creada y enviada correctamente",
  "id": "7df5a29c-12f3-4d39-a8a4-b891ae5e9b1c",  // ID interno en la base de datos
  "valor_con_iva": 119000.0,                      // Valor total con IVA calculado
  "libredte": {
    "estado": 0,
    "folio": 123,                                // Folio oficial asignado por el SII
    "pdf": "https://libredte.cl/dte/pdf/12345",  // URL para descargar PDF
    "xml": "https://libredte.cl/dte/xml/12345",  // URL para descargar XML
    "track_id": 6789012                          // ID de seguimiento de LibreDTE
  }
}
si falla esto 
{
  "error": "Error al generar la factura electrónica",
  "detalle": {
    "estado": 1,
    "error": "Rut del receptor inválido",
    ...
  }
}

pd esto espara la funcion crear_factura(): de la app.py 