import requests
import os

apy = os.getenv('API_KEY')
endpoind = os.getenv('LIBREDTE_ENDPOINT')

def enviar_dte(data_empresa, data_cliente, productos):
    headers = {
        'Authorization': f'Bearer {apy}',
        'Content-Type': 'application/json'
    }

    payload = {
        "dte": {
            "Encabezado": {
                "IdDoc": {
                    "TipoDTE": 33  # 33 = Factura electrónica
                },
                "Emisor": {
                    "RUTEmisor": data_empresa["rut"],
                    "RznSoc": data_empresa["nombre"],
                    "GiroEmis": data_empresa["giro"],
                    "DirOrigen": data_empresa["direccion"],
                    "CmnaOrigen": "Santiago"
                },
                "Receptor": {
                    "RUTRecep": data_cliente["rut"],
                    "RznSocRecep": data_cliente["nombre"],
                    "DirRecep": data_cliente["direccion"],
                    "CmnaRecep": "Santiago"
                }
            },
            "Detalle": productos  # Lista de productos
        }
    }

    response = requests.post(endpoind, headers=headers, json=payload)
    return response.json()
