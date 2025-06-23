import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card.tsx"
import { Form, FormControl, FormField, FormItem, } from "@/components/ui/form.tsx";
import z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Check, X} from "lucide-react";
import {Toggle} from "@/components/ui/toggle.tsx";
import {type BoolHabit, useHabits} from "@/hooks/habit-provider.tsx";
import {useEffect} from "react";
import {useBreadcrumbs} from "@/hooks/breadcrumbs-provider.tsx";
import {FormDatePicker} from "@/components/form-date-picker.tsx";
import {toDateString, compareDateStrings, getLastDays} from "@/lib/utils.ts";


const formSchema = z.object({
	date: z.string(),
	value: z.boolean(),
})

export default function CompletionBoolCard({numberOfDays = 7, data}: {
	numberOfDays?: number,
	data: BoolHabit,
}) {
	const {setBreadcrumbs} = useBreadcrumbs()
	const lastWeekDays = getLastDays(numberOfDays).map(toDateString);
	const currentDay = lastWeekDays[lastWeekDays.length - 1];
	const currentMeasurement = data.completed_days.find(val => compareDateStrings(val, currentDay))
	const labels = lastWeekDays.map(s => s.split("-")[2])
	const {refreshHabits} = useHabits();

	useEffect(() => {
		setBreadcrumbs(["Habit", data.name])
	}, []);


	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			value: currentMeasurement !== undefined,
			date: currentDay,
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const response = await fetch(import.meta.env.VITE_API_URL + "habit/entry",
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
			// setError(true)
		}
	}

	return (
		<Form {...form}>
			<form className="flex flex-1 flex-col" onSubmit={form.handleSubmit(onSubmit, (e) => {
				console.log(e);
				console.log(form.getValues())
			})}>
				<Card className="flex flex-1">

					<CardHeader>
						<CardTitle>Track your daily progress</CardTitle>
						<CardDescription>
							Select a day and mark your goal's status.
						</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col flex-1 justify-center items-center">
						<FormField
							control={form.control}
							name={"date"}
							render={() => (
								<FormDatePicker labels={labels} dates={lastWeekDays} value={form.getValues("date")}
								                onChange={
									                (value) => {
										                const selected = data.completed_days.find(val => compareDateStrings(val, value));
										                form.reset({
											                date: value,
											                value: selected !== undefined,
										                })
									                }
								                }/>
							)}/>
						<FormField
							control={form.control}
							name="value"
							render={({field}) => (
								<FormItem className="flex flex-row flex-1 h-full justify-center items-center gap-6">
									<h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
										{form.getValues("value") ? "Completed!" : "Not completed"}
									</h3>
									<FormControl>
										<Toggle type="submit" variant="outline" className="aspect-square flex h-1/4" defaultPressed={field.value}
										        onPressedChange={(value) => form.setValue("value", value)} pressed={field.value}>
											{field.value ? <Check/> : <X /> }
										</Toggle>
									</FormControl>
								</FormItem>
							)}
						/>
					</CardContent>
				</Card>
			</form>
		</Form>
	)
}
