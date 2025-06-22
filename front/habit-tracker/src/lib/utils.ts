import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

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

