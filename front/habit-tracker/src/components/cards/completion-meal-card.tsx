import {
	type FieldArray,
	type FieldArrayMethodProps,
	useFieldArray,
	useForm,
	type UseFormReturn,
	useWatch
} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Form, FormField, FormItem, FormLabel, FormControl, FormMessage} from "@/components/ui/form"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {FormDatePicker} from "@/components/form-date-picker.tsx";
import {compareDateStrings, getLastDays, toDateString} from "@/lib/utils.ts";
import {type MealHabit, useHabits} from "@/hooks/habit-provider.tsx";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import {foodSchema, mealsSchema, type FoodSchema, type MealsSchema} from "@/lib/from-schemas.ts";
import {FoodFormField} from "@/components/forms/fields.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useState} from "react";
import {onSubmit} from "@/lib/form-submit.ts";


type AppendType = (value: (FieldArray<MealsSchema, "foods"> | FieldArray<MealsSchema, "foods">[]), options?: FieldArrayMethodProps) => void;

function AddIngredient({handleSubmit, foodForm, append, disabled=false}: {
	handleSubmit: () => Promise<void>,
	foodForm: UseFormReturn<FoodSchema>,
	append: AppendType,
	disabled: boolean,
}) {
	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" className="w-full" disabled={disabled}>Add ingredient</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<Form {...foodForm}>
					<form onSubmit={
						foodForm.handleSubmit(foodValues => {
								append(foodValues);
								foodForm.reset();
								setOpen(false);
								handleSubmit();
							}
						)
					}>
						<DialogHeader>
							<DialogTitle>Add ingredient</DialogTitle>
							<DialogDescription>
								Enter name and nutritional values of ingredient you are adding
							</DialogDescription>
						</DialogHeader>
						<div className="grid gap-6 py-6">
							<FormField
								control={foodForm.control}
								name={"name"}
								render={({field}) => (
									<FormItem className="gap-2">
										<FormLabel>Name</FormLabel>
										<FormItem>
											<FormControl>
												<Input {...field} placeholder="name" autoComplete={"off"}/>
											</FormControl>
											<FormMessage/>
										</FormItem>
									</FormItem>
								)}
							/>
							<FoodFormField form={foodForm} fieldName="calories" fieldLabel="Calories"/>
							<FoodFormField form={foodForm} fieldName="carb" fieldLabel="Carbohydrates"/>
							<FoodFormField form={foodForm} fieldName="fat" fieldLabel="Fat"/>
							<FoodFormField form={foodForm} fieldName="prot" fieldLabel="Proteins"/>
							<FoodFormField form={foodForm} fieldName="grams" fieldLabel="Weight (g)"/>
						</div>
						<DialogFooter>
							<DialogClose asChild>
								<Button variant="outline" className="flex flex-1">Cancel</Button>
							</DialogClose>
							<Button type="submit" className="flex flex-1">Submit</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}


function FoodTable({form, handleSubmit}: { form: UseFormReturn<MealsSchema>, handleSubmit: () => void }) {
	return (
		<Table>
			<TableHeader>
				<TableHead>Name</TableHead>
				<TableHead>kcal</TableHead>
				<TableHead>Protein</TableHead>
				<TableHead>Carbohydrates</TableHead>
				<TableHead>Fat</TableHead>
				<TableHead>Weight (g)</TableHead>
				<TableHead></TableHead>
			</TableHeader>
			<TableBody>
				{
					form.getValues("foods").map((value, i) => (
						<TableRow key={i}>
							<TableCell>{value.name}</TableCell>
							<TableCell>{value.calories}</TableCell>
							<TableCell>{value.prot}</TableCell>
							<TableCell>{value.carb}</TableCell>
							<TableCell>{value.fat}</TableCell>
							<TableCell>{value.grams}</TableCell>
							<TableCell>
								<Button variant="destructive" type="button" onClick={() => {
									const currentMeals = form.getValues("foods");
									const updatedMeals = currentMeals.filter((_, index) => index !== i);
									form.setValue("foods", updatedMeals);
									handleSubmit();
								}}>Delete</Button>
							</TableCell>
						</TableRow>
					))
				}
			</TableBody>
		</Table>
	)
}


export function CompletionMealCard({numberOfDays = 7, data}: { numberOfDays?: number, data: MealHabit }) {
	const lastWeekDays = getLastDays(numberOfDays).map(toDateString);
	const currentDay = lastWeekDays[lastWeekDays.length - 1];
	const currentMeasurement = data.measurements.find(val => compareDateStrings(val.meal_date, currentDay))
	const labels = lastWeekDays.map(s => s.split("-")[2])
	const {refreshHabits} = useHabits();

	const form = useForm<MealsSchema>({
		resolver: zodResolver(mealsSchema),
		defaultValues: {
			created_at: currentDay,
			name: currentMeasurement?.name || "",
			foods: currentMeasurement?.foods || [],
		},
	})

	form.getValues()

	const {append} = useFieldArray({
		control: form.control,
		name: "foods",
	})

	const foodForm = useForm<FoodSchema>({
		resolver: zodResolver(foodSchema),
		defaultValues: {
			name: "",
			calories: 0,
			carb: 0,
			prot: 0,
			fat: 0,
			grams: 0,
		}
	})

	useWatch({
		control: form.control,
		name: "created_at",
	})

	useWatch({
		control: form.control,
		name: "name",
	})



	return (
		<Card className="flex flex-1 space-y-4">
			<CardHeader>
				<CardTitle>Add a Meal</CardTitle>
				<CardDescription>description</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-1 flex-col space-y-6 justify-center">
				<Form {...form}>
					<form className="flex flex-1 flex-col space-y-6 items-center">
						<FormField
							control={form.control}
							name={"created_at"}
							render={() => (
								<FormDatePicker labels={labels} dates={lastWeekDays} value={form.getValues("created_at")} onChange={
									(value) => {
										const selected = data.measurements.find(val => compareDateStrings(val.meal_date, value));

										form.reset({
											created_at: value,
											foods: selected?.foods || [],
										})
									}
								}
								/>
							)}
						/>
						<FormField
							control={form.control}
							name={"name"}
							render={({field}) => (
								<FormItem className="w-full gap-2">
									<FormLabel>Name</FormLabel>
									<FormItem>
										<FormControl>
											<Input {...field} placeholder="name" autoComplete={"off"}/>
										</FormControl>
										<FormMessage/>
									</FormItem>
								</FormItem>
							)}
						/>
						<FoodTable form={form} handleSubmit={form.handleSubmit(values => onSubmit(
							values, data, form, refreshHabits, "habit/entry", "Failed to delete ingredient", "Could not connect to the server"
						))}/>
					</form>
				</Form>
				<AddIngredient foodForm={foodForm} append={append} disabled={form.getValues("name") === undefined || form.getValues("name")?.length === 0} handleSubmit={form.handleSubmit(values => onSubmit(
					values, data, form, refreshHabits, "habit/entry", "Failed to save ingredient", "Could not connect to the server"
				), e => console.log(e))}
				/>
			</CardContent>
		</Card>
	)
}
