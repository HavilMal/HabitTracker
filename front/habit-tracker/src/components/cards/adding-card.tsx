import {Card, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {z} from "zod";
import {useForm, type UseFormReturn} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormField, FormItem, FormLabel, FormControl} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useNavigate} from "@tanstack/react-router";
import {Select, SelectTrigger, SelectItem, SelectContent, SelectValue} from "@/components/ui/select.tsx";
import {type Dispatch, type JSX, type SetStateAction, useEffect, useState} from "react";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {NumberInput} from "@/components/number-form-input.tsx";
import {useHabits} from "@/hooks/habit-provider.tsx";

const formSchema = z.object({
	name: z.string().min(1),
	type: z.enum(["bool", "measure", "water"]),
	freq_type: z.enum(["daily", "weekly", "monthly"]),
	freq_value: z.number(),
	notes: z.string().optional(),
	unit: z.string().optional(),
	target_value: z.number().optional(),
	target_type: z.string().optional(),
})


type FormSchema = z.infer<typeof formSchema>



function WaterHabitFields({form, children}: {
	form: UseFormReturn<z.infer<typeof formSchema>>,
	children?: JSX.Element | JSX.Element[]
}) {
	return (
		<div className="space-y-8">
			<FormField
				control={form.control}
				name="name"
				render={({field}) => (
					<FormItem className="gap-2">
						<FormLabel>Name</FormLabel>
						<FormItem>
							<FormControl>
								<Input placeholder="name" {...field} />
							</FormControl>
						</FormItem>
					</FormItem>
				)}
			/>

			{children ?
				children :
				<FormField
					control={form.control}
					name="target_value"
					render={({field}) => (
						<FormItem className="gap-2">
							<FormLabel>Target value</FormLabel>
							<FormItem>
								<FormControl>
									<NumberInput field={field} placeholder="value" {...field}/>
								</FormControl>
							</FormItem>
						</FormItem>
					)}
				/>
			}
			<FormField
				control={form.control}
				name="notes"
				render={({field}) => (
					<FormItem className="gap-2">
						<FormLabel>Notes</FormLabel>
						<FormItem>
							<FormControl>
								<Textarea placeholder="notes" {...field}/>
							</FormControl>
						</FormItem>
					</FormItem>
				)}
			/>
		</div>
	)
}

function BoolHabitFields({children, form}: {
	children?: JSX.Element | JSX.Element[],
	form: UseFormReturn<z.infer<typeof formSchema>>
}) {
	return (
		<WaterHabitFields form={form}>
			<FormField
				control={form.control}
				name="freq_type"
				render={({field}) => (
					<FormItem className="gap-2">
						<FormLabel>Frequency</FormLabel>
						<Select
							onValueChange={(value: FormSchema["freq_type"]) => {
								field.onChange(value);
							}}
							value={field.value}>
							<FormControl>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select the type of habit"/>
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								<SelectItem value="daily">Daily</SelectItem>
								<SelectItem value="weekly">Weekly</SelectItem>
								<SelectItem value="monthly">Monthly</SelectItem>
							</SelectContent>
						</Select>
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name="freq_value"
				render={({field}) => (
					<FormItem className="gap-2">
						<FormLabel>Frequency value</FormLabel>
						<FormItem>
							<FormControl>
								<NumberInput field={field} placeholder="value" {...field}/>
							</FormControl>
						</FormItem>
					</FormItem>
				)}
			/>
			<>
				{children}
			</>
		</WaterHabitFields>
	)
}

function MeasurementHabitFields({form}: { form: UseFormReturn<z.infer<typeof formSchema>> }) {
	return (
		<BoolHabitFields form={form}>
			<FormField
				control={form.control}
				name="target_type"
				render={({field}) => (
					<FormItem className="gap-2">
						<FormLabel>Target type</FormLabel>
						<Select
							onValueChange={(value: FormSchema["target_type"]) => {
								field.onChange(value);
							}}
							value={field.value}>
							<FormControl>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select the type of target"/>
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								<SelectItem value="positive">Positive</SelectItem>
								<SelectItem value="negative">Negative</SelectItem>
							</SelectContent>
						</Select>
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name="target_value"
				render={({field}) => (
					<FormItem className="gap-2">
						<FormLabel>Target value</FormLabel>
						<FormItem>
							<FormControl>
								<NumberInput field={field} placeholder="value" {...field}/>
							</FormControl>
						</FormItem>
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name="unit"
				render={({field}) => (
					<FormItem className="gap-2">
						<FormLabel>Unit</FormLabel>
						<FormItem>
							<FormControl>
								<Input placeholder="unit" {...field}/>
							</FormControl>
						</FormItem>
					</FormItem>
				)}
			/>
		</BoolHabitFields>
	)
}


// todo make them enums
function BoolHabitForm({setError}: { setError: Dispatch<SetStateAction<boolean>> }) {
	const navigate = useNavigate();
	const [habitType, setHabitType] = useState<FormSchema["type"]>("bool");
	const {refreshHabits} = useHabits();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			type: "bool",
			name: "",
			freq_type: "daily",
			freq_value: 0,
			target_type: "positive",
			target_value: 0,
			unit: "",
			notes: "",
		}
	});

	useEffect(() => {
		form.setValue("type", habitType);
		if (habitType === "bool") {
			form.setValue("unit", "")
			form.setValue("target_type", "")
			form.setValue("target_value", 0)
		}
	}, [habitType, form]);


	// todo navigate to previous page
	async function onSubmit(values: z.infer<typeof formSchema>) {
		const response = await fetch(import.meta.env.VITE_API_URL + "add-habit",
			{
				credentials: "include",
				mode: "cors",
				method: "POST",
				headers: {
					"Access-Control-Allow-Origin": import.meta.env.VITE_API_URL,
					"Content-Type": "application/json; charset=utf-8",
				},
				body: JSON.stringify(values),
			})

		if (response.ok) {
			refreshHabits();
			await navigate({to: "/dashboard"})
		} else {
			form.reset();
			setError(true)
		}
	}

	function renderForm() {
		switch (form.getValues("type")) {
			case "bool":
				return <BoolHabitFields form={form}/>
			case "measure":
				return <MeasurementHabitFields form={form}/>
			case "water":
				return <WaterHabitFields form={form}/>
			default:
				return <></>
		}
	}

	return (
		<Form {...form}>
			<form className="px-6 space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
				<FormField
					control={form.control}
					name="type"
					render={({field}) => (
						<FormItem className="gap-2">
							<FormLabel>Habit Type</FormLabel>
							<Select onValueChange={(value: FormSchema["type"]) => {
								field.onChange(value);
								setHabitType(value);
							}} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select the type of habit"/>
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="bool">Yes/No</SelectItem>
									<SelectItem value="measure">Measurement</SelectItem>
									<SelectItem value="water">Water</SelectItem>
								</SelectContent>
							</Select>
						</FormItem>
					)}
				/>
				{renderForm()}
				<FormItem>
					<FormControl>
						<Button type="submit">Add</Button>
					</FormControl>
				</FormItem>
			</form>
		</Form>
	)
}


export function AddingCard() {
	const [error, setError] = useState(false)

	return (
		<div className="flex flex-col gap-6">
			<Card>
				<CardHeader>
					<CardTitle>Add Habit</CardTitle>
				</CardHeader>
				<BoolHabitForm setError={setError}/>
			</Card>
			<div className="relative">
				{error && (
					<Alert variant="destructive" className="absolute">
						<AlertTitle>Failed to create habit</AlertTitle>
						<AlertDescription>Habit was not created try again.</AlertDescription>
					</Alert>
				)}
			</div>
		</div>
	)
}