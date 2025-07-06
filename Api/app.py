from flask import Flask, request, jsonify
from models import db, Empresa, Factura, Usuario
from config import Config
from servicios.libredte import enviar_dte
from flask_cors import CORS
from datetime import datetime


app = Flask(__name__)

app.config.from_object(Config)
CORS(app)
db.init_app(app)
with app.app_context():
    db.create_all()
from flask import request, jsonify
from werkzeug.security import generate_password_hash

@app.route('/register', methods=['POST'])
def reg():
    data = request.json  # Obtener los datos enviados por el cliente

    # Crear el nuevo usuario con los datos enviados
    nuevo_usuario = Usuario(
        razon=data['razon'],
        giro=data['giro'],
        correo=data['correo'],
        rut=data['rut']
    )

    # Encriptar la contraseña antes de guardarla
    nuevo_usuario.set_password(data['clave'])

    try:
        # Guardar el nuevo usuario en la base de datos
        db.session.add(nuevo_usuario)
        db.session.commit()

        # Respuesta exitosa
        return jsonify({"message": "Usuario registrado correctamente"}), 201
    except Exception as e:
        db.session.rollback()  # Deshacer cambios si algo falla
        return jsonify({"error": str(e)}), 400


@app.route('/login', methods=['POST'])
def log():
    data = request.json
    rut = data.get('rut')
    clave = data.get('clave')

    # Buscar al usuario en la base de datos por su rut
    usuario = Usuario.query.filter_by(rut=rut).first()

    if usuario and usuario.check_password(clave):  # Verificamos la contraseña
        return jsonify({
            'message': 'Credenciales correctas',
            'Nombre': usuario.razon
        }), 200  # Respuesta exitosa
    else:
        return jsonify({'message': 'Credenciales incorrectas'}), 400  # Respuesta de error


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
    #resultado_dte = enviar_dte(
    ##    data_empresa={
    #        "rut": empresa.rut,
    #        "nombre": empresa.nombre,
    #        "giro": empresa.giro,
    #        "direccion": empresa.direccion
    #    },
    #    data_cliente=cliente,
    #    productos=productos
    #)

    #if 'estado' not in resultado_dte or resultado_dte['estado'] != 0:
    #    return jsonify({
    #        "error": "Error al generar la factura electrónica",
    #        "detalle": resultado_dte
    #    }), 400

    # Guardar factura localmente
    nueva_factura = Factura(
        empresa_id=data['empresa_id'],
        valor_neto=valor_neto,
        valor_con_iva=total,
        productos=str(productos),
        fecha=datetime.now()
    )
    db.session.add(nueva_factura)
    db.session.commit()

    return jsonify({
        "mensaje": "Factura creada y enviada correctamente",
        "id": nueva_factura.id,
        "valor_con_iva": total,
        #"libredte": resultado_dte
    }), 201
@app.route('/empresas/buscar', methods=['POST'])
def buscar_empresa_por_rut():
    data = request.json
    rut = data.get('rut')

    if not rut:
        return jsonify({'error': 'Debe proporcionar un RUT'}), 400

    empresa = Empresa.query.filter_by(rut=rut).first()

    if not empresa:
        return jsonify({'error': 'Empresa no encontrada'}), 404

    return jsonify({
        'id': empresa.id,
        'nombre': empresa.nombre,
        'rut': empresa.rut,
        'giro': empresa.giro,
        'direccion': empresa.direccion,
        'correo': empresa.correo
    })





if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # crear tablas al iniciar la app
    app.run(debug=True)

