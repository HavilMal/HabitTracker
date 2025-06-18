import datetime
from back.src.app.constants import *
from back.src.app.logic.habit import HabitBool

def test_habit_dates():
    habit = HabitBool('piwo', datetime.date(2025, 6, 10), EVERY_N_DAYS, 2)

    print(habit.get_dates(habit.start_date, datetime.date.today()))

    habit.mark_completed(datetime.date(2025, 6, 12))
    habit.mark_completed(datetime.date(2025, 6, 14))
    habit.mark_completed(datetime.date(2025, 6, 16))

    print(habit.get_history())

if __name__ == '__main__':
    test_habit_dates()
