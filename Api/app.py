from flask import Flask, request, jsonify
from models import db, Empresa, Factura
from config import Config
from servicios.libredte import enviar_dte



app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)

@app.before_first_request
def create_tables():
    db.create_all()

@app.route('/empresas', methods=['POST'])
def crear_empresa():
    data = request.json
    nueva_empresa = Empresa(
        nombre=data['nombre'],
        rut=data['rut'],
        giro=data.get('giro'),
        direccion=data.get('direccion'),
        correo=data.get('correo')
    )
    db.session.add(nueva_empresa)
    db.session.commit()
    return jsonify({"mensaje": "Empresa creada", "id": nueva_empresa.id}), 201

@app.route('/facturas', methods=['POST'])
def crear_factura():
    data = request.json
    valor_neto = float(data['valor_neto'])
    iva = round(valor_neto * 0.19, 2)
    total = round(valor_neto + iva, 2)

    # Buscar la empresa emisora
    empresa = Empresa.query.get(data['empresa_id'])
    if not empresa:
        return jsonify({"error": "Empresa no encontrada"}), 404

    # Datos del cliente (receptor)
    cliente = {
        "rut": data['cliente_rut'],
        "nombre": data['cliente_nombre'],
        "direccion": data['cliente_direccion']
    }

    # Detalle de productos
    productos = data.get('productos', [])

    # Enviar a LibreDTE
    resultado_dte = enviar_dte(
        data_empresa={
            "rut": empresa.rut,
            "nombre": empresa.nombre,
            "giro": empresa.giro,
            "direccion": empresa.direccion
        },
        data_cliente=cliente,
        productos=productos
    )

    if 'estado' not in resultado_dte or resultado_dte['estado'] != 0:
        return jsonify({
            "error": "Error al generar la factura electrónica",
            "detalle": resultado_dte
        }), 400

    # Guardar factura localmente
    nueva_factura = Factura(
        empresa_id=data['empresa_id'],
        valor_neto=valor_neto,
        valor_con_iva=total,
        productos=str(productos)
    )
    db.session.add(nueva_factura)
    db.session.commit()

    return jsonify({
        "mensaje": "Factura creada y enviada correctamente",
        "id": nueva_factura.id,
        "valor_con_iva": total,
        "libredte": resultado_dte
    }), 201

if __name__ == '__main__':
    app.run(debug=True)