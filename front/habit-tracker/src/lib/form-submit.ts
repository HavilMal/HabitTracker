import {type Habit} from "@/hooks/habit-provider.tsx"
import type {FieldValues, UseFormReturn} from "react-hook-form";
import {toast} from "sonner";

export async function onSubmit<T, K extends Habit, J extends FieldValues>(values: T, data: K, form: UseFormReturn<J>, refreshHabits: () => void, endpoint: string, message: string, description: string) {
	try {
		const response = await fetch(import.meta.env.VITE_API_URL + endpoint,
			{
				credentials: "include",
				mode: "cors",
				method: "POST",
				headers: {
					"Access-Control-Allow-Origin": import.meta.env.VITE_API_URL,
					"Content-Type": "application/json; charset=utf-8",
				},
				body: JSON.stringify({...values, type: data.type, habit_id: data.id}),
			})

		if (response.ok) {
			refreshHabits();
		} else {
			form.reset();
			toast.error(message)
		}
	} catch (e) {
		form.reset();
		toast.error(message, {description: description});
	}
}
