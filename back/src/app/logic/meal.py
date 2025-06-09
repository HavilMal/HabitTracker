from food        import Food
from dataclasses import dataclass
import constants as c


@dataclass
class Meal():
    '''Class representing a meal'''
    name:  str        = ''
    foods: list[tuple[Food, float]] = []

    def get_total_nutrients(self) -> dict[str, float]:
        '''Returns info about total nutrients in the meal'''
        return {
            c.CALORIES: self.get_total_calories(),
            c.CARB:     self.get_total_carbs(),
            c.PROT:     self.get_total_prot(),
            c.FAT:      self.get_total_fat()
        }
        
    def get_total_calories(self) -> float:
        '''Returns total amount of calories'''
        return sum(food.get_nutrients_for(g)[c.CALORIES] for food, g in self.foods)
    
    def get_total_carbs(self) -> float:
        '''Returns total grams of carbohydrates'''
        return sum(food.get_nutrients_for(g)[c.CARB] for food, g in self.foods)
    
    def get_total_prot(self) -> float:
        '''Returns total grams of protein'''
        return sum(food.get_nutrients_for(g)[c.PROT] for food, g in self.foods)
    
    def get_total_fat(self) -> float:
        '''Returns total grams of fat'''
        return sum(food.get_nutrients_for(g)[c.FAT] for food, g in self.foods)
    
    def get_carb_exchangers(self) -> float:
        '''Returns carbohydrate exchangers (for diabetics)'''
        return self.get_total_carbs() / 10
    
    def get_protfat_exchangers(self) -> float:
        '''Returns fat-protein exchangers (for diabetics)'''
        fat_kcal:  float = self.get_total_fat() * 9
        prot_kcal: float = self.get_total_prot() * 4
        return (fat_kcal + prot_kcal) / 100
    
    def add_food(self, food: Food, grams: float):
        '''Adds food to the meal'''
        self.foods.append((food, grams))
