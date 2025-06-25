import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card.tsx"
import {Form, FormControl, FormField, FormItem,} from "@/components/ui/form.tsx";
import z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Check, X} from "lucide-react";
import {Toggle} from "@/components/ui/toggle.tsx";
import {type BoolHabit, useHabits} from "@/hooks/habit-provider.tsx";
import {FormDatePicker} from "@/components/form-date-picker.tsx";
import {toDateString, compareDateStrings, getLastDays, daysBetween} from "@/lib/utils.ts";
import {onSubmit} from "@/lib/form-submit.ts";


const formSchema = z.object({
	date: z.string(),
	value: z.boolean(),
})

export default function CompletionBoolCard({ data}: {
	data: BoolHabit,
}) {
	const n = Math.min(7, daysBetween(data.start_date))
	const lastWeekDays = getLastDays(n).map(toDateString);
	const currentDay = lastWeekDays[lastWeekDays.length - 1];
	const currentMeasurement = data.completed_days.find(val => compareDateStrings(val, currentDay))
	const labels = lastWeekDays.map(s => s.split("-")[2])
	const {refreshHabits} = useHabits();




	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			value: currentMeasurement !== undefined,
			date: currentDay,
		},
	})

	return (
		<Form {...form}>
			<form className="flex flex-1 flex-col" onSubmit={form.handleSubmit((values => onSubmit(
			values, data, form, refreshHabits, "habit/entry", "Failed to save progress", "Could not connect to the server"
		)))}>
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
										<Toggle type="submit" variant="outline" className="aspect-square flex h-1/4"
										        defaultPressed={field.value}
										        onPressedChange={(value) => form.setValue("value", value)} pressed={field.value}>
											{field.value ? <Check/> : <X/>}
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
