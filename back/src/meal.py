from food        import Food
from dataclasses import dataclass


@dataclass
class Meal():
    '''Class representing a meal'''
    name:  str        = ''
    foods: list[tuple[Food, float]] = []

    def get_total_nutrients(self) -> dict[str, float]:
        total: dict[str, float] = {
            'calories': 0.0,
            'carb':     0.0,
            'prot':     0.0,
            'fat':      0.0
        }
        for food, grams in self.foods:
            nutrients = food.get_nutrients_for(grams)
            for key in total:
                total[key] += nutrients[key]
        return total
    
    def add_food(self, food: Food, grams: float):
        self.foods.append((food, grams))
