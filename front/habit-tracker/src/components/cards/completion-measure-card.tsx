import {
	Card,
	CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card.tsx"
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Form, FormControl, FormDescription, FormField, FormItem, FormMessage} from "@/components/ui/form.tsx";
import z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {type MeasureHabit, useHabits} from "@/hooks/habit-provider.tsx";
import {FormDatePicker} from "@/components/form-date-picker.tsx";
import {toDateString, compareDateStrings, getLastDays, daysBetween} from "@/lib/utils.ts";
import {deleteEntry, onSubmit} from "@/lib/form-submit.ts";

const formSchema = z.object({
	date: z.string(),
	amount: z.number(),
})

export default function CompletionMeasureCard({ data}: {
	data: MeasureHabit,
}) {
	const n = Math.min(7, daysBetween(data.start_date))
	const lastWeekDays = getLastDays(n).map(toDateString);
	const currentDay = lastWeekDays[lastWeekDays.length - 1];
	const currentMeasurement = data.measurements.find(val => compareDateStrings(val.date, currentDay))
	const labels = lastWeekDays.map(s => s.split("-")[2])
	const {refreshHabits} = useHabits();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			date: currentDay,
			amount: currentMeasurement?.amount || 0,
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

					<CardContent className="flex flex-1 flex-col justify-center items-center space-y-8">
						<FormField
							control={form.control}
							name={"date"}
							render={() => (
								<FormDatePicker labels={labels} dates={lastWeekDays} value={form.getValues("date")}
								                onChange={
									                (value) => {
										                const selected = data.measurements.find(val => compareDateStrings(val.date, value));
										                form.reset({
											                date: value,
											                amount: selected?.amount || 0,
										                })
									                }
								                }/>
							)}/>
						<div className="flex flex-col flex-1 h-full">
							<FormField
								control={form.control}
								name="amount"
								render={({field}) => (
									<div className="flex flex-col flex-1 h-full gap-3">
										<FormDescription className="text-center">Your target
											is {data.target_type.replace("_", " ")} {data.target_value} {data.unit}</FormDescription>
										<FormItem className="flex flex-row flex-1">
											<div className="flex h-full w-1/4 justify-center items-center">
												<Button variant="outline" type="button" className="aspect-square rounded-full"
												        onClick={() => field.onChange(Math.max(field.value as number - 1, 0))}>
													<ChevronLeft/>
												</Button>
											</div>
											<FormItem className="flex flex-row h-full w-1/2">
												<FormControl className="flex flex-row w-full h-full justify-center items-center">
													<Input
														{...field} placeholder="Value" type="text" onChange={(e) => {
														const sanitized = e.target.value.replace(/[^0-9]/g, "");
														field.onChange(Number(sanitized));
													}}
														className="text-xl lg:text-8xl text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
													/>
												</FormControl>
											</FormItem>
											<div className="flex h-full w-1/4 justify-center items-center">
												<Button variant="outline" type="button" className="aspect-square rounded-full"
												        onClick={() => field.onChange(field.value as number + 1)}>
													<ChevronRight/>
												</Button>
											</div>
										</FormItem>
										<FormMessage/>
									</div>
								)}
							/>
						</div>
					</CardContent>
					<CardFooter className="gap-6">
						<FormControl>
							<Button className="flex-1 w-full" type="submit">Submit</Button>
						</FormControl>
						<FormControl>
							<Button className="flex-1 w-full" type="button" variant="destructive" onClick={() => deleteEntry(form.getValues("date"), data.type, refreshHabits)}>Delete</Button>
						</FormControl>
					</CardFooter>
				</Card>
			</form>
		</Form>
	)
}