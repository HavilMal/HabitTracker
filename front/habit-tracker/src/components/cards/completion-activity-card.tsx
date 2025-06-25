import {useForm, useWatch} from "react-hook-form"
import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Form, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {FormDatePicker} from "@/components/form-date-picker.tsx";
import {compareDateStrings, daysBetween, getLastDays, toDateString} from "@/lib/utils.ts";
import {NumberInput} from "@/components/number-form-input.tsx";
import {type ActivityHabit, useHabits} from "@/hooks/habit-provider.tsx";
import {onSubmit} from "@/lib/form-submit.ts";

const activitySchema = z.object({
	id: z.number(),
	activity_datetime: z.string(),
	amount: z.number(),
	duration_seconds: z.number(),
	calories: z.number(),
})

export function CompletionActivityCard({ data}: { data: ActivityHabit }) {
	const n = Math.min(7, daysBetween(data.start_date))
	const lastWeekDays = getLastDays(n).map(toDateString);
	const currentDay = lastWeekDays[lastWeekDays.length - 1];
	const currentMeasurement = data.measurements.find(val => compareDateStrings(val.activity_datetime, currentDay))
	const labels = lastWeekDays.map(s => s.split("-")[2])
	const {refreshHabits} = useHabits()


	const form = useForm<z.infer<typeof activitySchema>>({
		resolver: zodResolver(activitySchema),
		defaultValues: {
			id: data.id,
			activity_datetime: currentDay,
			amount: currentMeasurement?.amount || 0,
			duration_seconds: currentMeasurement?.duration || 0,
			calories: currentMeasurement?.calories || 0,
		},
	})


	useWatch({
		control: form.control,
		name: "activity_datetime",
	})

	return (
		<Form {...form}>
			<form className="flex flex-1" onSubmit={form.handleSubmit((values => onSubmit(
				values, data, form, refreshHabits, "habit/entry", "Failed to save progress", "Could not connect to the server"
			)))}>
				<Card className="flex flex-1">
					<CardHeader>
						<CardTitle>Track your daily progress</CardTitle>
						<CardDescription>Enter what you did</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6 justify-center mb-auto">
						<div className="flex flex-1 justify-center items-center">
							<FormField
								control={form.control}
								name={"activity_datetime"}
								render={() => (
									<FormDatePicker labels={labels} dates={lastWeekDays} value={form.getValues("activity_datetime")}
									                onChange={
										                (value) => {
											                const selected = data.measurements.find(val => compareDateStrings(val.activity_datetime, value));
											                form.reset({
												                id: data.id,
												                activity_datetime: value,
												                amount: selected?.amount || 0,
												                duration_seconds: selected?.duration || 0,
												                calories: selected?.calories || 0,
											                })
										                }
									                }/>
								)}
							/>
						</div>
						<FormDescription className="text-center">Your target is {data.target_value} {data.unit}</FormDescription>
						<FormField
							control={form.control}
							name="amount"
							render={({field}) => (
								<FormItem>
									<FormLabel>Enter {data.unit}</FormLabel>
									<NumberInput field={field} placeholder="amount"/>
									<FormMessage/>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="duration_seconds"
							render={({field}) => (
								<FormItem>
									<FormLabel>Enter duration</FormLabel>
									<NumberInput field={field} placeholder="duration"/>
									<FormMessage/>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="calories"
							render={({field}) => (
								<FormItem>
									<FormLabel>Enter calories</FormLabel>
									<NumberInput field={field} placeholder="calories"/>
									<FormMessage/>
								</FormItem>
							)}
						/>
					</CardContent>
					<CardFooter className="gap-6">
						<Button className="flex-1 w-full" type="submit">Submit</Button>
						<Button className="flex-1 w-full" type="submit" variant="destructive">Delete</Button>
					</CardFooter>
				</Card>
			</form>
		</Form>
	)
}
