from dataclasses import dataclass

from app.constants import *


@dataclass
class Food:
    """Class representing any type of food"""
    name: str
    calories: float  # kcal per 100g
    carb: float  # g per 100g
    prot: float  # g per 100g
    fat: float  # g per 100g

    def get_nutrients_for(self, grams: float) -> dict[str, float]:
        """Returns info about total nutrients of the food"""
        factor: float = grams / 100.0
        return {
            CALORIES: self.calories * factor,
            CARB: self.carb * factor,
            PROT: self.prot * factor,
            FAT: self.fat * factor
        }
