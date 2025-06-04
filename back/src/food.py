from dataclasses import dataclass
import constants as c


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
            c.CALORIES: self.calories * factor,
            c.CARB:     self.carb * factor,
            c.PROT:     self.prot * factor,
            c.FAT:      self.fats * factor
        }
