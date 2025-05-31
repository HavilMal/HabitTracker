from datetime import datetime
from abc import ABC, abstractmethod


class Habit(ABC):
    def __init__(self) -> None:
        self.date: datetime = datetime.now()

    @property
    @abstractmethod
    def summary(self) -> str:
        pass


class DrinkingWater(Habit):
    def __init__(self) -> None:
        super().__init__()
        # szklanki według mnie powinny mieć 250 mililitrów
        self.glasses_of_water: int = 0
        self.daily_goal: int = 8

    def __str__(self) -> str:
        return f"User drank {self.glasses_of_water} glasses out of {self.daily_goal}."

    def __repr__(self):
        return f"Drinking water( glasses_of_water= {self.glasses_of_water}, daily_goal= {self.daily_goal})"

    def drink(self, drink_number: int = 1) -> None:
        self.glasses_of_water += drink_number

    def

    @property
    def summary(self) -> str:
        return "Number of glasses of water drank"

    @property
    def is_completed(self) -> bool:
        return self.glasses_of_water >= self.daily_goal
