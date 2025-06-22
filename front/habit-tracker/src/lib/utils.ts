import {clsx, type ClassValue} from 'clsx'
import {twMerge} from 'tailwind-merge'
import type {Completion} from "@/components/cards/lineplot-card.tsx";
import type {
	ActivityHabit,
	BoolHabit,
	Habit,
	MealHabit,
	MeasureHabit,
	Measurement,
	WaterHabit
} from "@/hooks/habit-provider.tsx";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function getLastDays(numberOfDays: number): Date[] {
	const list = [];
	for (let i = numberOfDays - 1; i >= 0; i--) {
		const date = new Date();
		date.setDate(date.getDate() - i);
		list.push(date);
	}

	return list;
}

export function toDateString(date: Date): string {
	return date.toISOString().split('T')[0];
}


export function compareDateStrings(d1: string, d2: string) {
	return d1.split("T")[0] === d2.split("T")[0];
}

export function generateCompletionData(data: BoolHabit | MeasureHabit | WaterHabit | ActivityHabit | MealHabit) {
	switch (data.type) {
		case "bool":
			return generateCompletionDataBool(data.start_date, data.completed_days);
		case "measure":
		case "water":
			return generateCompletionDataAmount(data.start_date, data.measurements);
		default:
			return []
	}
}

function generateCompletionDataBool(
	startDate: string,
	markedDates: string[],
): Completion[] {
	const result: Completion[] = [];
	const start = new Date(startDate);
	const today = new Date();

	today.setHours(0, 0, 0, 0);

	const markedSet = new Set(markedDates.map(date => new Date(date).toISOString().slice(0, 10)));

	const current = new Date(start);
	while (current <= today) {
		const dateStr = current.toISOString().slice(0, 10);
		result.push({date: dateStr, completion: markedSet.has(dateStr) ? 100 : 0});

		current.setDate(current.getDate() + 1);
	}

	return result;
}


function generateCompletionDataAmount(
	startDate: string,
	markedDates: Measurement[],
): Completion[] {
	const result: Completion[] = [];
	const start = new Date(startDate);
	const today = new Date();

	today.setHours(0, 0, 0, 0);

	const dateToAmount = new Map<string, number>();
	markedDates.forEach(m => {
		const dateStr = new Date(m.date).toISOString().slice(0, 10);
		dateToAmount.set(dateStr, m.amount);
	});

	const current = new Date(start);
	while (current <= today) {
		const dateStr = current.toISOString().slice(0, 10);
		result.push({
			date: dateStr,
			completion: dateToAmount.get(dateStr) ?? 0,
		});

		current.setDate(current.getDate() + 1);
	}

	return result;
}
