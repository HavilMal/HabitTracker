from datetime import datetime, timedelta


class Activity:
    def __init__(
            self,
            exercise_type: str = "Exercise",
            duration: timedelta = timedelta(),
            calories: float = 0.0,
            date: datetime = None
    ) -> None:
        self.exercise_type: str = exercise_type
        self.duration: timedelta = duration
        self.calories: float = calories
        self.date: datetime = date if date else datetime.now()

    def __str__(self) -> str:
        return (f"Uprawiano {self.exercise_type} przez {self.duration} i spalono {self.calories}. "
                f"Dodano {self.date.strftime('%Y-%m-%d %H:%M')}")

    def __repr__(self) -> str:
        return (f"Activity(exercise_type='{self.exercise_type}', "
                f"duration={self.duration}, "
                f"calories={self.calories}, "
                f"date=datetime({self.date.year}, {self.date.month}, {self.date.day}, "
                f"{self.date.hour}, {self.date.minute})")
