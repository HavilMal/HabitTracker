from dataclasses import dataclass
import datetime
import abc
from back.src.app.logic.meal import Meal
from collections import defaultdict


class Habit(metaclass=abc.ABCMeta):
    def __init__(self, name: str, start_date: datetime.date, notes: str = ''):
        self.name: str = name
        self.start_date: datetime.date = start_date
        self.notes: str = notes

    @abc.abstractmethod
    def get_history(self):
        ...

    @staticmethod
    def get_dates(start_date, end_date):
        return [start_date + datetime.timedelta(days=x) for x in range((end_date - start_date).days + 1)]


class HabitBool(Habit):
    def __init__(self, name: str, start_date: datetime.date, freq_type: str, freq_value: int, notes: str = ''):
        super().__init__(name, start_date, notes)
        self.freq_type: str = freq_type  # only 'every_n_days' I think, 'n times a week' did not make sense a little bit with streaks
        self.freq_value: int = freq_value
        self.completed_days: list[datetime.date] = []

    def mark_completed(self, completion_date: datetime.date):
        if completion_date not in self.completed_days:
            self.completed_days.append(completion_date)

    def get_history(self) -> list[tuple[str, int]]:
        """
        returns history of completion of habit - starting from start_date of habit to today's date
        """
        all_dates: list[datetime.date] = self.get_dates(self.start_date, datetime.date.today())
        history: list[tuple[str, int]] = []
        completed_days_set = set(self.completed_days)
        auto_completed_days_after = 0

        for date in all_dates:
            if date in completed_days_set:
                history.append((date.isoformat(), 1))
                auto_completed_days_after = self.freq_value - 1
            elif auto_completed_days_after > 0:
                history.append((date.isoformat(), 1))
                auto_completed_days_after -= 1
            else:
                history.append((date.isoformat(), 0))

        return history

    def get_longest_streak(self) -> tuple[str, str, int]:
        """
        returns tuple[start_date, end_date, number_of_days] - longest streak
        """
        history = self.get_history()

        current_streak = 0
        start_date = ''
        end_date = ''

        longest_streak = 0
        start_date_longest = ''
        end_date_longest = ''

        for entry in history:
            if entry[1] == 1:
                if current_streak == 0:
                    start_date = entry[0]
                current_streak += 1
                end_date = entry[0]

            if entry[1] == 0:
                if current_streak > longest_streak:
                    longest_streak = current_streak
                    start_date_longest = start_date
                    end_date_longest = end_date
                current_streak = 0

        if current_streak > longest_streak:
            longest_streak = current_streak
            start_date_longest = start_date
            end_date_longest = end_date

        return start_date_longest, end_date_longest, longest_streak


@dataclass
class MeasurementFloat:
    date: datetime.date
    amount: float


class HabitMeasure(Habit):
    def __init__(self, name: str, start_date: datetime.date, freq_type: str, unit: str, target_value: float, target_type: str, notes: str = ''):
        super().__init__(name, start_date, notes)
        self.freq_type: str = freq_type  # 'daily' or 'weekly'
        self.unit: str = unit
        self.target_value: float = target_value
        self.target_type: str = target_type  # 'at_least' or 'at_most'
        self.measurements: list[MeasurementFloat] = []

    def add_measurement(self, measure_date: datetime.date, amount: float):
        self.measurements.append(MeasurementFloat(measure_date, amount))

    def _check_target(self, total_amount: float,) -> int:
        if self.target_type == 'at_least':
            return 1 if total_amount >= self.target_value else 0
        elif self.target_type == 'at_most':
            return 1 if total_amount <= self.target_value else 0
        else:
            return 0

    def get_history(self) -> list[tuple[str, int]]:
        """
        returns history of completion of habit - starting from start_date of habit to today's date
        """
        all_dates: list[datetime.date] = self.get_dates(self.start_date, datetime.date.today())
        history: list[tuple[str, int]] = []

        measurements_by_day = defaultdict(list)
        for m in self.measurements:
            measurements_by_day[m.date].append(m.amount)

        if self.freq_type == 'daily':
            for date in all_dates:
                daily_measurement = measurements_by_day.get(date, [])
                if daily_measurement:
                    total_amount = sum(daily_measurement)
                    history.append((date.isoformat(), self._check_target(total_amount)))
                else:
                    history.append((date.isoformat(), 0))
        else:
            weekly_totals = defaultdict(float)
            for date, amounts in measurements_by_day.items():
                week_start = date -datetime.timedelta(days=date.weekday())
                weekly_totals[week_start] += sum(amounts)

            week_status = {}
            for week_start, total in weekly_totals.items():
                week_status[week_start] = self._check_target(total)

            for date in all_dates:
                week_start = date -datetime.timedelta(days=date.weekday())
                history.append((date.isoformat(), week_status.get(week_start, 0)))

@dataclass()
class MeasurementInt:
    date: datetime.date
    amount: int


class HabitDrinkingWater(Habit):
    def __init__(self, name: str, start_date: datetime.date, target_value: int, notes: str = ''):
        super().__init__(name, start_date, notes)
        self.target_value: int = target_value
        self.measurements: list[MeasurementInt] = []

    def add_measurement(self, measure_date: datetime.date, amount: int):
        self.measurements.append(MeasurementInt(measure_date, amount))

    def get_history(self) -> list[dict[str, str | float]]:
        # todo to change to match HabitBool
        return [{'date': m.date.isoformat(), 'amount': m.amount} for m in sorted(self.measurements, key=lambda x: x.date)]


@dataclass
class MeasurementActivity:
    activity_datetime: datetime.datetime
    amount: float
    duration: datetime.timedelta
    calories: float

    @property
    def calories_burnt_per_minute(self) -> float:
        duration_minutes = self.duration.total_seconds() / 60
        if duration_minutes == 0 or self.calories == 0:
            return 0.0
        return self.calories / duration_minutes


class HabitActivity(Habit):
    def __init__(self, name: str, start_date: datetime.date, freq_type: str, unit: str, target_value: float, notes: str = ''):
        super().__init__(name, start_date, notes)
        self.freq_type: str = freq_type  # 'daily' or 'weekly'
        self.unit: str = unit
        self.target_value: float = target_value
        self.measurements: list[MeasurementActivity] = []


class HabitMeal(Habit):
    def __init__(self, name: str, start_date: datetime.date, target_value: float, target_data_unit: str, target_type: str, notes: str = ''):
        super().__init__(name, start_date, notes)
        self.target_value: float = target_value
        self.target_data_unit: str = target_data_unit # 'prot', 'fat', 'carb', 'calories'
        self.target_type: str = target_type  # 'at_least' or 'at_most'
        self.measurements: list[Meal] = []
