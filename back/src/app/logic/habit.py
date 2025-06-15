from dataclasses import dataclass
from datetime import datetime, date, timedelta
import abc
from meal import Meal


class Habit(metaclass=abc.ABCMeta):
    def __init__(self, name: str, notes: str = ''):
        self.start_date: date = datetime.now().date()
        self.name: str = name
        self.notes: str = notes


class HabitBool(Habit):
    def __init__(self, name: str, freq_type: str, freq_value: int, notes: str = ''):
        super().__init__(name, notes)
        self.freq_type: str = freq_type  # 'n_times_per_week' or 'every_n_days'
        self.freq_value: int = freq_value
        self.completed_days: list[date] = []

    def mark_completed(self, completion_date: date):
        self.completed_days.append(completion_date)

    def get_history(self) -> list[str]:
        return [d.isoformat() for d in sorted(self.completed_days)]


@dataclass
class MeasurementFloat:
    date: date
    amount: float


class HabitMeasure(Habit):
    def __init__(self, name: str, freq_type: str, unit: str, target_value: float, target_type: str, notes: str = ''):
        super().__init__(name, notes)
        self.freq_type: str = freq_type  # 'daily' or 'weekly'
        self.unit: str = unit
        self.target_value: float = target_value
        self.target_type: str = target_type  # 'at_leat' or 'at_most'
        self.measurements: list[MeasurementFloat] = []

    def add_measurement(self, measure_date: date, amount: float):
        self.measurements.append(MeasurementFloat(measure_date, amount))

    def get_history(self) -> list[dict[str, str | float]]:
        return [{'date': m.date.isoformat(), 'amount': m.amount} for m in self.measurements]


@dataclass
class MeasurementInt:
    date: date
    amount: int


class HabitDrinkingWater(Habit):
    def __init__(self, name: str, target_value: int, notes: str = ''):
        super().__init__(name, notes)
        self.target_value: int = target_value
        self.measurements: list[MeasurementInt] = []

    def add_measurement(self, measure_date: date, amount: int):
        self.measurements.append(MeasurementInt(measure_date, amount))

    def get_history(self) -> list[dict[str, str | float]]:
        return [{'date': m.date.isoformat(), 'amount': m.amount} for m in sorted(self.measurements, key=lambda x: x.date)]


@dataclass
class MeasurementActivity:
    activity_datetime: datetime
    amount: float
    duration: timedelta
    calories: float

    @property
    def calories_burnt_per_minute(self) -> float:
        duration_minutes = self.duration.total_seconds() / 60
        if duration_minutes == 0 or self.calories == 0:
            return 0.0
        return self.calories / duration_minutes


class HabitActivity(Habit):
    def __init__(self, name: str, freq_type: str, unit: str, target_value: float, notes: str = ''):
        super().__init__(name, notes)
        self.freq_type: str = freq_type  # 'daily' or 'weekly'
        self.unit: str = unit
        self.target_value: float = target_value
        self.measurements: list[MeasurementActivity] = []


class HabitMeal(Habit):
    def __init__(self, name, target_value: float, target_data_unit: str, target_type: str, notes: str = ''):
        super().__init__(name, notes)
        self.target_value: float = target_value
        self.target_data_unit: str = target_data_unit # 'prot', 'fat', 'carb', 'calories'
        self.target_type: str = target_type  # 'at_leat' or 'at_most'
        self.measurements: list[Meal] = []
