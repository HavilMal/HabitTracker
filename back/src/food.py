from dataclasses import dataclass


@dataclass
class Food():
    '''Class representing any type of food'''
    name:      str
    calories:  float   # kcal per 100g
    carb:      float   # g per 100g
    prot:      float   # g per 100g
    fats:      float   # g per 100g
    
    def get_nutrients_for(self, grams: float) -> dict[str, float]:
        factor: float = grams / 100.0
        return {
            'calories': self.calories * factor,
            'carb':     self.carb * factor,
            'prot':     self.prot * factor,
            'fat':      self.fats * factor
        }
