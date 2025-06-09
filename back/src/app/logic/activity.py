from datetime import datetime, timedelta
from typing import Optional

class Activity:
    def __init__(
            self,
            exercise_type: str = "Exercise",
            duration: timedelta = timedelta(),
            calories: float = 0.0,
            date: Optional[datetime] = None
    ) -> None:
        self.exercise_type: str = exercise_type
        self.duration: timedelta = duration
        self.calories_burnt: float = calories
        # data uprawiania ćwiczeń domyślnie dzisiejsza
        self.date: datetime = date if date else datetime.now()

    def __str__(self) -> str:
        return (f"Uprawiano {self.exercise_type} przez {self.duration} i spalono {self.calories_burnt:.1f} kcal. "
                f"Dodano {self.date.strftime('%Y-%m-%d %H:%M')}")

    def __repr__(self) -> str:
        return (f"Activity(exercise_type='{self.exercise_type}', "
                f"duration={self.duration}, "
                f"calories={self.calories_burnt}, "
                f"date=datetime({self.date.year}, {self.date.month}, {self.date.day}, "
                f"{self.date.hour}, {self.date.minute}))")

    @property
    def calories_burnt_per_minute(self) -> float:
        duration_minutes = self.duration.total_seconds() / 60
        if duration_minutes == 0:
            return 0.0
        return self.calories_burnt / duration_minutes
