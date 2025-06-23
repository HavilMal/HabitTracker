import datetime
from back.src.app.constants import *
from back.src.app.logic.habit import HabitBool


def test_habit_dates():
    habit = HabitBool('piwo', datetime.date(2025, 6, 10), EVERY_N_DAYS, 2)

    print(habit.get_dates(habit.start_date, datetime.date.today()))


def test_habit_completion():
    habit = HabitBool('piwo', datetime.date(2025, 6, 10), EVERY_N_DAYS, 3)

    habit.mark_completed(datetime.date(2025, 6, 11))
    habit.mark_completed(datetime.date(2025, 6, 17))

    print(habit.get_history())


def test_habit_streak():
    habit = HabitBool('piwo', datetime.date(2025, 6, 10), EVERY_N_DAYS, 1)

    habit.mark_completed(datetime.date(2025, 6, 16))
    habit.mark_completed(datetime.date(2025, 6, 18))
    habit.mark_completed(datetime.date(2025, 6, 19))
    habit.mark_completed(datetime.date(2025, 6, 20))

    print(habit.get_longest_streak())


def test_todo():
    habit = HabitBool('piwo', datetime.date(2025, 6, 10), EVERY_N_DAYS, 1)

    habit.mark_completed(datetime.date(2025, 6, 21))

    print(habit.to_do())


def test_stat_completion():
    habit = HabitBool('piwo', datetime.date(2025, 6, 14), EVERY_N_DAYS, 1)

    habit.mark_completed(datetime.date(2025, 6, 16))
    habit.mark_completed(datetime.date(2025, 6, 18))
    habit.mark_completed(datetime.date(2025, 6, 19))
    habit.mark_completed(datetime.date(2025, 6, 20))

    print(habit.get_completion_stats())



if __name__ == '__main__':
    # test_habit_dates()
    # test_habit_completion()
    # test_habit_streak()
    # test_todo()
    test_stat_completion()
