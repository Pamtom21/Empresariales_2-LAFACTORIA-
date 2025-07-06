from flask import Flask, request, jsonify
from models import db, Empresa, Factura, Usuario
from config import Config
from servicios.libredte import enviar_dte
from flask_cors import CORS
from datetime import datetime
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, JWTManager, set_access_cookies


app = Flask(__name__)

app.config.from_object(Config)
CORS(app,supports_credentials=True)
jwt = JWTManager(app)
db.init_app(app)
with app.app_context():
    db.create_all()

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


from flask_jwt_extended import create_access_token
from flask import make_response

@app.route('/login', methods=['POST'])
def log():
    data = request.json
    rut = data.get('rut')
    clave = data.get('clave')

    # Buscar al usuario en la base de datos por su rut
    usuario = Usuario.query.filter_by(rut=rut).first()

    if usuario and usuario.check_password(clave):  # Verificamos la contraseña
        # Generar el token de acceso
        access_token = create_access_token(identity=usuario.rut)

        # Crear la respuesta y agregar el token en la cookie
        response = make_response(jsonify({
            'message': 'Credenciales correctas',
            'Nombre': usuario.razon
        }))
        set_access_cookies(response, access_token, secure=True, httponly=True, samesite='Strict')

        return response, 200
    else:
        return jsonify({'message': 'Credenciales incorrectas'}), 400

@app.route('/empresas', methods=['POST'])
@jwt_required()  # Este decorador asegura que el usuario esté autenticado
def crear_empresa():
    try:
        data = request.json
        
        # Validar que los campos esenciales estén presentes
        if 'nombre' not in data or 'rut' not in data:
            return jsonify({"mensaje": "Faltan campos requeridos (nombre, rut)"}), 400
        
        # Obtener el usuario_id del token JWT
        usuario_id = get_jwt_identity()  # El ID del usuario autenticado
        
        # Verificar si el 'rut' ya existe en la base de datos
        if Empresa.query.filter_by(rut=data['rut']).first():
            return jsonify({"mensaje": "El rut ya está registrado"}), 400

        # Verificar si el usuario con el 'usuario_id' existe
        usuario = Usuario.query.get(usuario_id)
        if not usuario:
            return jsonify({"mensaje": "Usuario no encontrado"}), 400

        # Crear la nueva empresa
        nueva_empresa = Empresa(
            nombre=data['nombre'],
            rut=data['rut'],
            giro=data.get('giro'),  # Uso de .get() para campos opcionales
            direccion=data.get('direccion'),
            correo=data.get('correo'),
            usuario_id=usuario_id  # Asignación del usuario_id
        )

        # Añadir la empresa a la base de datos
        db.session.add(nueva_empresa)
        db.session.commit()

        # Responder con éxito
        return jsonify({"mensaje": "Empresa creada", "id": nueva_empresa.id}), 201
    
    except Exception as e:
        # Si ocurre un error, hacer rollback y devolver el error
        db.session.rollback()
        return jsonify({"mensaje": "Error al crear la empresa", "error": str(e)}), 500

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

@app.route('/procesar_carrito', methods=['POST'])
def procesar_carrito():
    data = request.json
    carrito = data.get('carrito', [])

    if not carrito:
        return jsonify({"error": "El carrito está vacío"}), 400

    total = sum(producto.get('precio', 0) for producto in carrito)

    print("Productos recibidos:")
    for p in carrito:
        print(f"- {p['nombre']} (${p['precio']})")

    print(f"Total: ${total}")

    return jsonify({
        "mensaje": "Carrito recibido correctamente",
        "total": total
    }), 200




if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # crear tablas al iniciar la app
    app.run(debug=True)

