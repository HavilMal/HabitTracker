import {
	Card,
	CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card.tsx"
import {Button} from "@/components/ui/button.tsx";
import {Form, FormControl, FormDescription, FormField, FormItem, FormMessage} from "@/components/ui/form.tsx";
import z from "zod";
import {useForm, useWatch} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useHabits, type WaterHabit} from "@/hooks/habit-provider.tsx";
import {useEffect} from "react";
import {useBreadcrumbs} from "@/hooks/breadcrumbs-provider.tsx";
import {FormDatePicker} from "@/components/form-date-picker.tsx";
import {toDateString, compareDateStrings, getLastDays} from "@/lib/utils.ts";
import {Slider} from "@/components/ui/slider.tsx";

const formSchema = z.object({
	date: z.string(),
	amount: z.number(),
})

export default function CompletionWaterCard({numberOfDays = 7, data}: {
	numberOfDays?: number,
	data: WaterHabit,
}) {
	const {setBreadcrumbs} = useBreadcrumbs()
	const lastWeekDays = getLastDays(numberOfDays).map(toDateString);
	const currentDay = lastWeekDays[lastWeekDays.length - 1];
	const currentMeasurement = data.measurements.find(val => compareDateStrings(val.date, currentDay));
	const labels = lastWeekDays.map(s => s.split("-")[2]);
	const {refreshHabits} = useHabits();

	useEffect(() => {
		setBreadcrumbs(["Habit", data.name])
	}, []);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			date: currentDay,
			amount: currentMeasurement?.amount || 0,
		},
	})

	const cups = useWatch({
		control: form.control,
		name: "amount",
	});


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
			<form className="flex flex-1 flex-col" onSubmit={form.handleSubmit(onSubmit)}>
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
						<div className="flex flex-col flex-1 h-full w-full justify-center items-center gap-6">
							<FormField
								control={form.control}
								name="amount"
								render={({field}) => (
									<FormItem className="flex flex-col w-full gap-3">
										<FormDescription className="text-center">Your target is {data.target_value} cups</FormDescription>
										<Slider value={[cups]} onValueChange={(val) => {
											field.onChange(val[0]);
										}} max={20} step={1}/>
										<FormMessage/>
									</FormItem>
								)}
							/>
							<h1 className="text-center text-xl lg:text-3xl">{cups} cups</h1>
						</div>
					</CardContent>
					<CardFooter className="gap-6">
						<FormControl>
							<Button className="flex-1 w-full" type="submit">Submit</Button>
						</FormControl>
						<FormControl>
							<Button className="flex-1 w-full" type="submit" variant="destructive">Delete</Button>
						</FormControl>
					</CardFooter>
				</Card>
			</form>
		</Form>
	)
}