from flask import Flask, request, jsonify
from models import db, Empresa, Factura
from config import Config

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
    nueva_factura = Factura(
        empresa_id=data['empresa_id'],
        valor_neto=data['valor_neto'],
        valor_con_iva=data['valor_con_iva'],
        productos=data.get('productos')
    )
    db.session.add(nueva_factura)
    db.session.commit()
    return jsonify({"mensaje": "Factura creada", "id": nueva_factura.id}), 201

if __name__ == '__main__':
    app.run(debug=True)