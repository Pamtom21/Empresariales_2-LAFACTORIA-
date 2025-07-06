# config.py
import os
from dotenv import load_dotenv

load_dotenv()  # Carga el archivo .env

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
        # Configuración del JWT
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'una_clave_secreta_segura')  # Usa un valor seguro
    JWT_ACCESS_TOKEN_EXPIRES = 3600  # Tiempo de expiración del token (en segundos, 1 hora)
