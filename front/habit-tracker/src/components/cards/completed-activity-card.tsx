import {useForm, useWatch} from "react-hook-form"
import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Form, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {FormDatePicker} from "@/components/form-date-picker.tsx";
import {getLastDays, toDateString} from "@/lib/utils.ts";
import {NumberInput} from "@/components/number-form-input.tsx";

const activitySchema = z.object({
	id: z.number(),
	activity_datetime: z.string(),
	amount: z.number(),
	duration_seconds: z.number(),
	calories: z.number(),
})

type Activity = {
	activity_datetime: string,
	amount: number,
	duration_seconds: number,
	calories: number,
}

function getPreviousActivities(): Activity[] {
	return [
		{
			activity_datetime: "2025-06-15",
			amount: 102,
			duration_seconds: 360,
			calories: 50,
		},
		{
			activity_datetime: "2025-06-16",
			amount: 90,
			duration_seconds: 100,
			calories: 1298,
		}
	]
}


export function CompleteActivityCard({numberOfDays = 7}: { numberOfDays?: number }) {
	const previousActivities = getPreviousActivities();
	const lastWeekDays = getLastDays(numberOfDays).map(toDateString);
	const labels = lastWeekDays.map(s => s.split("-")[2])

	const form = useForm<z.infer<typeof activitySchema>>({
		resolver: zodResolver(activitySchema),
		defaultValues: {
			id: 1,
			activity_datetime: lastWeekDays[0],
			amount: previousActivities[0].amount,
			duration_seconds: previousActivities[0].duration_seconds,
			calories: previousActivities[0].calories,
		},
	})

	useWatch({
		control: form.control,
		name: "activity_datetime",
	})

	const onSubmit = (data: z.infer<typeof activitySchema>) => {
		console.log(data)
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-1">
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
								render={({field}) => (
									<FormDatePicker labels={labels} dates={lastWeekDays} value={form.getValues("activity_datetime")}
									                onChange={
										                (value) => {
											                const selected = previousActivities.find(a => a.activity_datetime === value);
											                if (selected !== undefined) {
												                field.onChange(value);
												                form.reset(
													                selected
												                )
											                }
										                }
									                }/>
								)}
							/>
						</div>
						<FormField
							control={form.control}
							name="amount"
							render={({field}) => (
								<FormItem>
									<FormLabel>Enter amount</FormLabel>
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
