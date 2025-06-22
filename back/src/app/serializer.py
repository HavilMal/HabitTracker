from flask.json.provider import DefaultJSONProvider
from datetime import date, datetime


class CustomJSONProvider(DefaultJSONProvider):
    def default(self, obj):
        if isinstance(obj, (date, datetime)):
            return obj.isoformat()
        try:
            return list(iter(obj))
        except TypeError:
            pass
        return super().default(obj)
