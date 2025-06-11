from flask_sqlalchemy import SQLAlchemy
import uuid

db = SQLAlchemy()

class Empresa(db.Model):
    __tablename__ = 'empresa'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    nombre = db.Column(db.String(255), nullable=False)
    rut = db.Column(db.String(20), unique=True, nullable=False)
    giro = db.Column(db.String(255), nullable=True)
    direccion = db.Column(db.String(255), nullable=True)
    correo = db.Column(db.String(255), nullable=True)

    facturas = db.relationship('Factura', backref='empresa', lazy=True)

    def __repr__(self):
        return f'<Empresa {self.nombre}>'


class Factura(db.Model):
    __tablename__ = 'factura'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    empresa_id = db.Column(db.String(36), db.ForeignKey('empresa.id'), nullable=False)
    valor_neto = db.Column(db.Float, nullable=False)
    valor_con_iva = db.Column(db.Float, nullable=False)
    productos = db.Column(db.JSON, nullable=True)  # Podrías usar JSON si lo prefieres
    fecha = db.Column(db.DateTime, nullable=False)

    def __repr__(self):
        return f'<Factura {self.id}>'
