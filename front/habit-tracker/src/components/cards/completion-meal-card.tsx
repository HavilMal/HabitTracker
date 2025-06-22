import {useForm, useWatch} from "react-hook-form"
import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Select, SelectTrigger, SelectValue, SelectContent, SelectItem,} from "@/components/ui/select"
import {Form, FormField, FormItem, FormLabel, FormControl, FormMessage} from "@/components/ui/form"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {FormDatePicker} from "@/components/form-date-picker.tsx";
import {cn, getLastDays, toDateString} from "@/lib/utils.ts";

const mealSchema = z.object({
	id: z.number(),
	name: z.string(),
})

const mealsSchema = z.object({
	amount: z.array(mealSchema),
	date: z.string(),
})

type Meal = { id: number, name: string };

function getMeals(): Meal[] {
	return (
		[
			{id: 1, name: "Potato"},
			{id: 2, name: "Salad"},
			{id: 3, name: "Carrot"},
		]
	)
}

function getPreviousMeals(): Map<string, Meal[]> {
	return (
		new Map([
			["2025-06-20", [
				{id: 1, name: "Potato"},
				{id: 2, name: "Carrot"},
			]],
			["2025-06-19", [
				{id: 2, name: "Carrot"},
				{id: 3, name: "Salad"},
			]],
			["2025-06-18", []],
			["2025-06-17", []],
			["2025-06-16", []],
			["2025-06-15", []],
			["2025-06-14", []],
		])
	)
}


export function CompletionMealCard({numberOfDays = 7, className}: { numberOfDays?: number, className?: string }) {
	const meals = getMeals();
	const previousMeals = getPreviousMeals();
	const lastWeekDays = getLastDays(numberOfDays).map(toDateString);
	const labels = lastWeekDays.map(s => s.split("-")[2])

	const form = useForm<z.infer<typeof mealsSchema>>({
		resolver: zodResolver(mealsSchema),
		defaultValues: {
			amount: previousMeals.get(lastWeekDays[0]),
			date: lastWeekDays[0],
		},
	})

	useWatch({
		control: form.control,
		name: "date",
	})

	const onSubmit = (data: z.infer<typeof mealsSchema>) => {
		console.log(data)
	}

	function renderTable() {
		if (form.getValues("value").length === 0) {
			return (
				<div className="flex flex-1 justify-center items-center">
					<p>No meals</p>
				</div>
			)
		} else {
			return (
				<Table>
					<TableHeader>
						<TableHead>Name</TableHead>
						<TableHead>kcal</TableHead>
						<TableHead>Protein</TableHead>
						<TableHead></TableHead>
					</TableHeader>
					<TableBody>
						{
							form.getValues("value").map((value, i) => (
								<TableRow key={i}>
									<TableCell>{value.name}</TableCell>
									<TableCell>value</TableCell>
									<TableCell>value</TableCell>
									<TableCell>
										<Button variant="destructive" type="button" onClick={() => {
											const currentMeals = form.getValues("value");
											const updatedMeals = currentMeals.filter((_, index) => index !== i);
											form.setValue("value", updatedMeals);
											form.handleSubmit(onSubmit)();
										}}>Delete</Button>
									</TableCell>
								</TableRow>
							))
						}
					</TableBody>
				</Table>
			)
		}
	}


	return (
		<Card className={cn("flex flex-1 space-y-4", className)}>
			<CardHeader>
				<CardTitle>Add a Meal</CardTitle>
				<CardDescription>description</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6 justify-center">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<div className="flex flex-1 justify-center items-center">
							<FormField
								control={form.control}
								name={"date"}
								render={({field}) => (
									<FormDatePicker labels={labels} dates={lastWeekDays} value={form.getValues("date")} onChange={
										(value) => {
											field.onChange(value)

											const newValue = previousMeals.get(value)

											if (newValue) {
												form.setValue("value", newValue)
											}
										}
									}
									/>
								)}
							/>
						</div>
						<FormField
							control={form.control}
							name="value"
							render={({field}) => (
								<FormItem>
									<FormLabel>Select Meal</FormLabel>
									<Select onValueChange={(value) => {
										const daysMeals = previousMeals.get(form.getValues("date"));
										field.onChange(daysMeals ? [...daysMeals, meals[Number(value)]] : [meals[Number(value)]]);
									}}>
										<FormControl>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Choose a meal"/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{meals.map((meal, i) => (
												<SelectItem key={i} value={i.toString()}>
													{meal.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage/>
								</FormItem>
							)}
						/>
						<Button type="submit" className="w-full">Add Meal</Button>

						{renderTable()}
					</form>
				</Form>
			</CardContent>
		</Card>
	)
}
