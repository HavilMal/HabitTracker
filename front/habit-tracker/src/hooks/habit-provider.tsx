import {createContext, type JSX, useContext} from 'react';
import {useQuery, useQueryClient} from '@tanstack/react-query';


export type Habit = {
	id: number,
	type: "bool" | "measure" | "water" | "activity" | "meal",
	name: string,
	notes: string,
	start_date: string,
}

export type BoolHabit = Habit & {
	type: "bool"
	freq_type: "daily" | "weekly" | "monthly",
	freq_value: number,
	start_date: string,
	completed_days: string[],
}

export type Measurement = {
	amount: number,
	date: string,
}

export type MeasureHabit = Habit & {
	type: "measure"
	freq_type: "daily" | "weekly" | "monthly",
	target_type: "at_least" | "at_most",
	target_value: number,
	unit: string,
	measurements: Measurement[],
}

export type WaterHabit = Habit & {
	type: "water"
	start_date: string,
	target_value: number,
	measurements: Measurement[],
}

export type ActivityMeasurement = {
	activity_datetime: string,
	amount: number,
	calories: number,
	duration: number,
}

export type ActivityHabit = Habit & {
	type: "activity"
	target_value: number,
	freq_type: "daily" | "weekly" | "monthly",
	unit: string,
	measurements: ActivityMeasurement[],
}

export type MealHabit = Habit & {
	type: "meal"

}

export type Habits = {
	bool: BoolHabit[],
	measure: MeasureHabit[],
	water: WaterHabit[],
	activity: ActivityHabit[],
}


interface HabitsContext {
	habits: Habits;
	isLoading: boolean;
	refreshHabits: () => void;
}

const HabitsContext = createContext<HabitsContext | null>(null);

export const HabitsProvider = ({children}: { children?: JSX.Element | JSX.Element[] }) => {
		const queryClient = useQueryClient();

		async function fetchHabits() {
			const res = await fetch(import.meta.env.VITE_API_URL + "get-habits", {
				credentials: "include",
				mode: "cors",
				method: "GET",
				headers: {
					"Access-Control-Allow-Origin": import.meta.env.VITE_API_URL,
					"Content-Type": "application/json; charset=utf-8",
				},
			});
			if (!res.ok) {
				throw new Error('Failed to fetch habits');
			}

			return res.json();
		}

		const {data: habits, isLoading} = useQuery({
			queryKey: ['habits'],
			queryFn: fetchHabits,
			staleTime: 1000 * 60 * 5,
		});

		const refreshHabits = () => {
			queryClient.invalidateQueries({queryKey: ['habits']});
		};

		return (
			<HabitsContext.Provider value={{habits, isLoading, refreshHabits}}>
				{children}
			</HabitsContext.Provider>
		);
	}
;

export function useHabits() {
	const context = useContext(HabitsContext);
	if (!context) {
		throw new Error("useHabits must be used within HabitProvider");
	}
	return context;
}
