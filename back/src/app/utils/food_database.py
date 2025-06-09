import requests

from back.src.app.constants import *


def fetch_product(query: str) -> dict | None:
    url    = DB_URL
    params = {
        'search_terms':  query,
        'search_simple': 1,
        'action':        'process',
        'json':          1
    }

    response = requests.get(url, params=params)
    data     = response.json()

    if (data.get('products')):
        product = data['products'][0]
        nutr    = product.get('nutriments', {})
        return {
            'name':   nutr.get('product_name', 'Unknown'),
            CALORIES: nutr.get(DB_CALORIES, 0),
            CARB:     nutr.get(DB_CARB, 0),
            PROT:     nutr.get(DB_PROT, 0), 
        }

    return None