from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy
import uuid

db = SQLAlchemy()

class Empresas(db.Model):
    __tablename__ = 'empresa'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    nombre = db.Column(db.String(255), nullable=False)
    rut = db.Column(db.String(20), unique=True, nullable=False)
    giro = db.Column(db.String(255), nullable=True)
    direccion = db.Column(db.String(255), nullable=True)
    correo = db.Column(db.String(255), nullable=True)

    # Relación con Factura: Una empresa puede tener muchas facturas
    facturas = db.relationship('Factura', backref='empresa', lazy=True)

    # Relación muchos a uno con Usuario (Cada empresa pertenece a un usuario)
    usuario_id = db.Column(db.String(36), db.ForeignKey('usuario.id'), nullable=False)

    def __repr__(self):
        return f'<Empresa {self.nombre}>'


class Factura(db.Model):
    __tablename__ = 'factura'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    empresa_id = db.Column(db.String(36), db.ForeignKey('empresa.id'), nullable=False)
    valor_neto = db.Column(db.Float, nullable=False)
    valor_con_iva = db.Column(db.Float, nullable=False)
    productos = db.Column(db.JSON, nullable=True)  # Aquí podrías usar JSON para almacenar detalles de productos
    fecha = db.Column(db.DateTime, nullable=False)

    def __repr__(self):
        return f'<Factura {self.id}>'
class Usuario(db.Model):
    __tablename__ = 'usuario'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    razon = db.Column(db.String(255), nullable=False)
    giro = db.Column(db.String(255), nullable=False)
    correo = db.Column(db.String(255), unique=True, nullable=False)
    rut = db.Column(db.String(255), unique=True, nullable=False)
    clave = db.Column(db.String(255), nullable=False)

    # Relación uno a muchos con Empresa (Un usuario puede tener muchas empresas)
    empresas = db.relationship('Empresa', backref='usuario', lazy=True)

    # Método para encriptar la contraseña antes de guardarla en la base de datos
    def set_password(self, password):
        self.clave = generate_password_hash(password)

    # Método para verificar si la contraseña ingresada es correcta
    def check_password(self, password):
        return check_password_hash(self.clave, password)

    def __repr__(self):
        return f'<Usuario {self.Razon}>'
    
class Pago(db.Model):
    __tablename__ = 'pago'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    metodo = db.Column(db.String(50), nullable=False)
    numero_tarjeta = db.Column(db.String(20), nullable=True)
    vencimiento = db.Column(db.String(10), nullable=True)
    cvv = db.Column(db.String(4), nullable=True)
    fecha = db.Column(db.DateTime, nullable=False)
    monto_total = db.Column(db.Float, nullable=False)

    def __repr__(self):
        return f'<Pago {self.id} - {self.metodo}>'



