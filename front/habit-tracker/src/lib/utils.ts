import {clsx, type ClassValue} from 'clsx'
import {twMerge} from 'tailwind-merge'

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

export function max(array: number[]) {
	return array.reduce((max, curr) =>
		curr > max ? curr : max
	);
}

export type Stats = {
	[key: string]: {
		date: string,
		percentage: number
	}[]
}

export type History = {
	history: [string, number][],
}

export async function fetchHabitStats<T extends Stats | History>({id, endpoint = "get-habit-stats"}: {
	id?: number,
	endpoint?: string
}): Promise<T> {
	const url = new URL(import.meta.env.VITE_API_URL + endpoint);
	if (id !== undefined) {
		url.searchParams.set("habit_id", id.toString());
	}
	const res = await fetch(url.toString(), {
		credentials: "include",
		mode: "cors",
		method: "GET",
		headers: {
			"Content-Type": "application/json; charset=utf-8",
		},
	});

	if (!res.ok) {
		throw new Error('Failed to fetch stats');
	}

	return res.json();
}

export function capitalize(val: string) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}



export function daysBetween(date1: string) {
	const oneDayMs = 1000 * 60 * 60 * 24; // milliseconds in a day
	const d1 = new Date(date1);
	const d2 = new Date();

	const diffInMs = Math.abs(d2 - d1); // get absolute difference
	return Math.ceil(diffInMs / oneDayMs);
}