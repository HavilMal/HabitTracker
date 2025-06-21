import type {
	ActivitySchema,
	BoolSchema,
	HabitSchema,
	MealSchema,
	MeasureSchema,
	WaterSchema
} from "@/lib/from-schemas.ts";
import {FormField, FormItem, FormLabel, FormControl} from "@/components/ui/form.tsx";
import type {Path, UseFormReturn} from "react-hook-form";
import {Input} from "@/components/ui/input.tsx";
import {NumberInput} from "@/components/number-form-input.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Select, SelectTrigger, SelectItem, SelectContent, SelectValue} from "@/components/ui/select.tsx";

export function TypeField<T extends HabitSchema>({form}: { form: UseFormReturn<T> }) {
	return (
		<FormField
			control={form.control}
			name={"type" as Path<T>}
			render={({field}) => (
				<FormItem className="gap-2">
					<FormLabel>Habit Type</FormLabel>
					<Select onValueChange={(value: T["type"]) => {
						field.onChange(value);
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
	)
}


export function NameField<T extends HabitSchema>({form}: { form: UseFormReturn<T> }) {
	return (
		<FormField
			control={form.control}
			name={"name" as Path<T>}
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
	)
}

export function TargetValueField<T extends MeasureSchema | WaterSchema | MealSchema | ActivitySchema>({form}: {
	form: UseFormReturn<T>
}) {
	return (
		<FormField
			control={form.control}
			name={"target_value" as Path<T>}
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
	)
}

export function NotesField<T extends HabitSchema>({form}: { form: UseFormReturn<T> }) {
	return (
		<FormField
			control={form.control}
			name={"notes" as Path<T>}
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
	)
}


export function TargetTypeField<T extends MeasureSchema | MealSchema>({form}: { form: UseFormReturn<T> }) {
	return (
		<FormField
			control={form.control}
			name={"target_type" as Path<T>}
			render={({field}) => (
				<FormItem className="gap-2">
					<FormLabel>Target type</FormLabel>
					<Select
						onValueChange={(value: T["target_type"]) => {
							field.onChange(value);
						}}
						value={field.value as string}>
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
	)
}

export function UnitField<T extends MeasureSchema | ActivitySchema>({form}: { form: UseFormReturn<T> }) {
	return (
		<FormField
			control={form.control}
			name={"unit" as Path<T>}
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
	)
}

export function FrequencyTypeField<T extends MeasureSchema | BoolSchema | ActivitySchema>({form}: {
	form: UseFormReturn<T>
}) {
	return (
		<FormField
			control={form.control}
			name={"freq_type" as Path<T>}
			render={({field}) => (
				<FormItem className="gap-2">
					<FormLabel>Frequency</FormLabel>
					<Select
						onValueChange={(value: T["freq_type"]) => {
							field.onChange(value);
						}}
						value={field.value as string}>
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
	)
}

export function FrequencyValueField<T extends BoolSchema>({form}: { form: UseFormReturn<T> }) {
	return (
		<FormField
			control={form.control}
			name={"freq_value" as Path<T>}
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
	)
}

export function TargetDataUnitField<T extends MealSchema>({form}: { form: UseFormReturn<T> }) {
	return (
		<FormField
			control={form.control}
			name={"target_data_unit" as Path<T>}
			render={({field}) => (
				<FormItem className="gap-2">
					<FormLabel>Frequency</FormLabel>
					<Select
						onValueChange={(value: T["target_data_unit"]) => {
							field.onChange(value);
						}}
						value={field.value as string}>
						<FormControl>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select the unit"/>
							</SelectTrigger>
						</FormControl>
						<SelectContent>
							<SelectItem value="calories">Calories</SelectItem>
							<SelectItem value="proteins">Proteins</SelectItem>
							<SelectItem value="carbohydrates">Carbohydrates</SelectItem>
						</SelectContent>
					</Select>
				</FormItem>
			)}
		/>
	)
}