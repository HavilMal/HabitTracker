import {
	Card,
	CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card.tsx"
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/components/ui/form.tsx";
import z from "zod";
import {useForm, useWatch} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Check, ChevronLeft, ChevronRight} from "lucide-react";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group.tsx";
import {Toggle} from "@/components/ui/toggle.tsx";
import type {BoolHabit, MeasureHabit, WaterHabit} from "@/hooks/habit-provider.tsx";
import {Slider} from "@/components/ui/slider.tsx";
import {useEffect} from "react";
import {useBreadcrumbs} from "@/hooks/breadcrumbs-provider.tsx";


function getLastDays(numberOfDays: number): Date[] {
	const list = [];
	for (let i = numberOfDays - 1; i >= 0; i--) {
		const date = new Date();
		date.setDate(date.getDate() - i);
		list.push(date);
	}

	return list;
}

function getLastValues(days: Date[]): Map<string, number> {
	const map = new Map<string, number>();
	for (let day of days) {
		map.set(day.toDateString(), 11);
	}

	return map;
}

function BoolFrom({form, data}: { form: any, data: BoolHabit }) {
	return (
		<FormField
			control={form.control}
			name="value"
			render={() => (
				<FormItem className="flex flex-row flex-1 h-full justify-center items-center gap-6">
					<h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
						{form.getValues("value") ? "Completed!" : "Not completed"}
					</h3>
					<FormControl>
						<Toggle type="submit" variant="outline" className="aspect-square flex h-1/4"
						        onPressedChange={(value) => form.setValue("value", value)}>
							<Check/>
						</Toggle>
					</FormControl>
				</FormItem>
			)}
		/>
	)
}


function MeasureForm({form, data}: { form: any, data: MeasureHabit }) {
	return (
		<div className="flex flex-col flex-1 h-full">
			<FormField
				control={form.control}
				name="value"
				render={({field}) => (
					<div className="flex flex-col flex-1 h-full gap-3">
						<FormDescription className="text-center">Your target is {data.target_value} {data.unit}</FormDescription>
						<FormItem className="flex flex-row flex-1">
							<div className="flex h-full w-1/4 justify-center items-center">
								<Button variant="outline" className="aspect-square rounded-full"
								        onClick={() => form.setValue("value", Math.max(form.getValues().value as number - 1, 0))}>
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
								<FormMessage/>
							</FormItem>
							<div className="flex h-full w-1/4 justify-center items-center">
								<Button variant="outline" className="aspect-square rounded-full"
								        onClick={() => form.setValue("value", form.getValues().value as number + 1)}>
									<ChevronRight/>
								</Button>
							</div>
						</FormItem>
					</div>
				)}
			/>
			<h1 className="text-center text-xl lg:text-3xl">{data.unit}</h1>
		</div>
	)
}

function WaterForm({form, data}: { form: any, data: WaterHabit }) {
	const cups = useWatch({
		control: form.control,
		name: "value",
		defaultValue: form.getValues("value")
	});

	return (
		<div className="flex flex-col flex-1 h-full justify-center items-center gap-6">
			<FormField
				control={form.control}
				name="value"
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
	)
}


export default function CompletionCard({numberOfDays = 7, data}: {
	numberOfDays?: number,
	data: BoolHabit | MeasureHabit | WaterHabit
}) {
	const {setBreadcrumbs} = useBreadcrumbs()

	useEffect(() => {
		setBreadcrumbs(["Habit", data.name])
	}, []);

	const lastWeekDays = getLastDays(numberOfDays);
	const lastWeekValues = getLastValues(lastWeekDays);

	const formSchema = z.object({
		date: z.date(),
		value: data.type === "habit_bool" ? z.boolean() : z.number(),
	})

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			value: data.type === "habit_bool" ? false : lastWeekValues.get(lastWeekDays[0].toDateString()),
			date: lastWeekDays[0],
		},
		mode: "onChange",
	})

	function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values)
	}


	function renderForm() {
		switch (data.type) {
			case "habit_bool":
				return <BoolFrom form={form} data={data as BoolHabit}/>
			case "habit_measure":
				return <MeasureForm form={form} data={data as MeasureHabit}/>
			case "habit_water":
				return <WaterForm form={form} data={data as WaterHabit}/>
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


					<CardContent className="flex flex-1 justify-center items-center">
						<FormField
							control={form.control}
							name="date"
							render={({field}) => (
								<RadioGroup
									onValueChange={(stringValue) => {
										const selectedDate = lastWeekDays.find(
											(day) => day.toDateString() === stringValue
										)
										if (selectedDate) {
											field.onChange(selectedDate)

											const newValue = lastWeekValues.get(selectedDate.toDateString())

											if (newValue) {
												form.setValue("value", newValue)
											}
										}
									}}
									defaultValue={lastWeekDays[lastWeekDays.length - 1].toDateString()}
									className="bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]"
								>
									{
										lastWeekDays.map((day, i) => (
											<FormItem className="flex flex-row w-full h-full">
												<FormControl>
													<RadioGroupItem value={day.toDateString()}
													                id={day.toDateString()}
													                key={i}
													                className="peer sr-only"
													/>
												</FormControl>
												<FormLabel
													htmlFor={day.toDateString()}
													className="peer-data-[state=checked]:bg-background dark:peer-data-[state=checked]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:peer-data-[state=checked]:border-input dark:peer-data-[state=checked]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 peer-data-[state=checked]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
												>
													{day.getDate().toString()}
												</FormLabel>
											</FormItem>
										))
									}
								</RadioGroup>
							)}
						/>
					</CardContent>
					<CardContent className="flex flex-col w-full h-full gap-4">
						{renderForm()}
					</CardContent>
					{data.type === "habit_bool" ?
						<></> :
						<CardFooter className="gap-6">
							<FormControl>
								<Button className="flex-1 w-full" type="submit">Submit</Button>
							</FormControl>
							<FormControl>
								<Button className="flex-1 w-full" type="submit" variant="destructive">Delete</Button>
							</FormControl>
						</CardFooter>
					}
				</Card>
			</form>
		</Form>
	)
}