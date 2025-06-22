import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {useForm, type UseFormReturn} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod"
import {Form} from "@/components/ui/form.tsx";
import {useNavigate} from "@tanstack/react-router";
import {Select, SelectTrigger, SelectItem, SelectContent, SelectValue} from "@/components/ui/select.tsx";
import {type Dispatch, type SetStateAction, useState} from "react";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {
	schemas,
	type FormTypes,
	type BoolSchema,
	type MeasureSchema,
	type MealSchema,
	type WaterSchema, type ActivitySchema
} from "@/lib/from-schemas.ts";
import {BoolFields, MeasureFields, ActivityFields, WaterFields, MealFields} from "@/components/forms/bool-form.tsx";
import {useHabits} from "@/hooks/habit-provider.tsx";
import {FormItem, FormControl} from "@/components/ui/form.tsx";
import {Button} from "@/components/ui/button.tsx";


const formDefaults: Record<FormTypes, any> = {
	bool: {type: "bool", name: "", freq_type: "daily", freq_value: 0, notes: ""},
	measure: {type: "measure", name: "", freq_type: "daily", unit: "", target_value: 0, target_type: "", notes: ""},
	activity: {type: "activity", name: "", freq_type: "daily", unit: "", target_value: 0, notes: ""},
	meal: {type: "meal", name: "", target_value: 0, target_data_unit: "", target_type: "", notes: ""},
	water: {type: "water", name: "", target_value: 0, notes: ""},
};


function AddingForm({selectedType, setError}: { selectedType: FormTypes, setError: Dispatch<SetStateAction<boolean>> }) {
	const navigate = useNavigate();
	const {refreshHabits} = useHabits();
	const schema = schemas[selectedType];

	const form: UseFormReturn<BoolSchema | MeasureSchema | MealSchema | WaterSchema | ActivitySchema> = useForm({
		resolver: zodResolver(schema),
		defaultValues: formDefaults[selectedType],
	})

	// todo navigate to previous page
	async function onSubmit(values: z.infer<typeof schema>) {
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


	function renderFields() {
		switch (selectedType) {
			case "bool":
				return <BoolFields form={form as UseFormReturn<BoolSchema>}/>
			case "measure":
				return <MeasureFields form={form as UseFormReturn<MeasureSchema>}/>
			case "meal":
				return <MealFields form={form as UseFormReturn<MealSchema>}/>
			case "water":
				return <WaterFields form={form as UseFormReturn<WaterSchema>}/>
			case "activity":
				return <ActivityFields form={form as UseFormReturn<ActivitySchema>}/>
		}
	}

	return (
		<Form key={selectedType} {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				{renderFields()}
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
	const [selectedType, setSelectedType] = useState<FormTypes>("bool");
	const [error, setError] = useState(false);

	return (
		<div className="flex flex-col gap-6">
			<Card>
				<CardHeader>
					<CardTitle>Add Habit</CardTitle>
				</CardHeader>
				<CardContent className="space-y-8">
					<Select value={selectedType} onValueChange={(val: FormTypes) => setSelectedType(val)}>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Select form type"/>
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="bool">Yes/No</SelectItem>
							<SelectItem value="measure">Measure</SelectItem>
							<SelectItem value="activity">Activity</SelectItem>
							<SelectItem value="water">Water</SelectItem>
							<SelectItem value="meal">Meal</SelectItem>
						</SelectContent>
					</Select>
					<AddingForm key={selectedType} selectedType={selectedType} setError={setError}/>
				</CardContent>
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