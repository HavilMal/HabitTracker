import {
	useFieldArray,
	useForm,
	type UseFormReturn,
	useWatch
} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription} from "@/components/ui/form"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {FormDatePicker} from "@/components/form-date-picker.tsx";
import {compareDateStrings, daysBetween, getLastDays, toDateString} from "@/lib/utils.ts";
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
import {useEffect, useState} from "react";
import {onSubmit} from "@/lib/form-submit.ts";
import SearchBar from "@/components/search-bar.tsx";

const dataUnitName = {
	"prot": "proteins",
	"carb": "carbohydrates",
	"fat": "fats",
	"calories": "calories",
}


function AddIngredient({handleSubmit, foodForm, disabled = false, className, children, onOpen}: {
	children: string,
	className?: string,
	handleSubmit: () => void,
	foodForm: UseFormReturn<FoodSchema>,
	disabled: boolean,
	onOpen?: () => void,
}) {
	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (open && onOpen !== undefined) {
			onOpen();
		}
	}, [open]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" className={className} disabled={disabled}>{children}</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<Form {...foodForm}>
					<form onSubmit={foodForm.handleSubmit(() => {
						setOpen(false);
						handleSubmit();
					})
					}>
						<DialogHeader>
							<DialogTitle>{children}</DialogTitle>
							<DialogDescription>
								Enter name and nutritional values of ingredient
							</DialogDescription>
						</DialogHeader>
						<div className="grid gap-6 py-6">
							<SearchBar form={foodForm}/>
							<FormField
								control={foodForm.control}
								name={"product_name"}
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
							<FoodFormField form={foodForm} fieldName="carbs" fieldLabel="Carbohydrates"/>
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


function FoodTable({form, foodForm, handleDelete, handleEdit}: {
	form: UseFormReturn<MealsSchema>,
	foodForm: UseFormReturn<FoodSchema>
	handleDelete: (i: number) => void,
	handleEdit: (i: number) => void
}) {
	return (
		<div className="flex flex-col h-[250px] w-full">
			<div className="flex-1 overflow-auto min-h-0">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>kcal</TableHead>
							<TableHead>Protein</TableHead>
							<TableHead>Carbohydrates</TableHead>
							<TableHead>Fat</TableHead>
							<TableHead>Weight (g)</TableHead>
							<TableHead></TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{
							form.getValues("foods").map((value, i) => (
								<TableRow key={i}>
									<TableCell>{value.product_name}</TableCell>
									<TableCell>{value.calories}</TableCell>
									<TableCell>{value.prot}</TableCell>
									<TableCell>{value.carbs}</TableCell>
									<TableCell>{value.fat}</TableCell>
									<TableCell>{value.grams}</TableCell>
									<TableCell className="w-8 justify-between">
										<Button variant="destructive" type="button" className="mr-6" onClick={() => handleDelete(i)}>
											Delete
										</Button>

										<AddIngredient foodForm={foodForm} disabled={false}
										               onOpen={() => foodForm.reset(form.getValues("foods")[i])}
										               handleSubmit={() => handleEdit(i)}>
											Edit
										</AddIngredient>
									</TableCell>
								</TableRow>
							))
						}
					</TableBody>
				</Table>
			</div>
		</div>
	)
}


export function CompletionMealCard({
	                                   data
                                   }: {
	data
		:
		MealHabit
}) {
	const n = Math.min(7, daysBetween(data.start_date))
	const lastWeekDays = getLastDays(n).map(toDateString);
	const currentDay = lastWeekDays[lastWeekDays.length - 1];
	const currentMeasurement = data.measurements.find(val => compareDateStrings(val.meal_date, currentDay))
	const labels = lastWeekDays.map(s => s.split("-")[2])
	const {refreshHabits} = useHabits();

	const form = useForm<MealsSchema>({
		resolver: zodResolver(mealsSchema),
		defaultValues: {
			created_at: currentDay,
			name: currentMeasurement?.name || "",
			foods: currentMeasurement?.foods.map(([food, grams]) => ({
				product_name: food.name,
				calories: food.calories,
				carbs: food.carb,
				prot: food.prot,
				fat: food.fat,
				grams: grams,
			})) || [],
		},
	})


	form.getValues()

	const {append, update, remove} = useFieldArray({
		control: form.control,
		name: "foods",
	})

	const foodForm = useForm<FoodSchema>({
		resolver: zodResolver(foodSchema),
		defaultValues: {
			product_name: "",
			calories: 0,
			carbs: 0,
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
		<Card className="flex flex-1 space-y-4 min-h-[250px]">
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
											name: selected?.name || "",
											foods: selected?.foods.map(([food, grams]) => ({
												product_name: food.name,
												calories: food.calories,
												carbs: food.carb,
												prot: food.prot,
												fat: food.fat,
												grams: grams,
											})) || [],
										})
									}
								}
								/>
							)}
						/>
						<FormDescription>Your target
							is {data.target_type.replace("_", " ")} {data.target_value} {dataUnitName[data.target_data_unit]}</FormDescription>
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
						<FoodTable form={form} foodForm={foodForm}
						           handleDelete={(i) => {
							           remove(i)
							           form.handleSubmit(values => onSubmit(
								           values, data, form, refreshHabits, "habit/entry", "Failed to delete ingredient", "Could not connect to the server"
							           ))();
						           }}
						           handleEdit={async (i) => {
							           await foodForm.handleSubmit(foodValues => {
								           update(i, foodValues);
								           foodForm.reset();
							           })();
							           console.log(form.getValues("foods"))
							           await form.handleSubmit(values => {
								           onSubmit(values, data, form, refreshHabits, "habit/entry", "Failed to save ingredient", "Could not connect to the server");
							           }, e => console.log(e))();
						           }}/>
					</form>
				</Form>
				<AddIngredient foodForm={foodForm} className="w-full"
				               disabled={form.getValues("name") === undefined || form.getValues("name")?.length === 0}
				               handleSubmit={async () => {
					               await foodForm.handleSubmit(foodValues => {
						               append(foodValues);
						               foodForm.reset();
					               })();
					               console.log(form.getValues())
					               await form.handleSubmit(values => {
						               onSubmit(values, data, form, refreshHabits, "habit/entry", "Failed to save ingredient", "Could not connect to the server");
					               }, e => console.log(e))();
				               }}>
					Add ingredient
				</AddIngredient>
			</CardContent>
		</Card>
	)
}
