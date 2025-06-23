import type {ActivitySchema, BoolSchema, MealSchema, MeasureSchema, WaterSchema} from "@/lib/from-schemas.ts";
import {type UseFormReturn, useWatch} from "react-hook-form";
import {
	FrequencyTypeField,
	FrequencyValueField,
	NameField,
	NotesField,
	TargetDataUnitField,
	TargetTypeField,
	TargetValueField,
	UnitField
} from "@/components/forms/fields.tsx";
import {type JSX} from "react";

export function BoolFields({form}: {
	form: UseFormReturn<BoolSchema>
}) {
	let field: JSX.Element | null = null;
	if (form.getValues("freq_type") === "daily") {
		form.setValue("freq_value", 1)
	} else {
		field = <FrequencyValueField form={form}/>;
	}

	useWatch({
		control: form.control,
		name: "freq_type",
	})

	return (
		<>
			<NameField form={form}/>
			<FrequencyTypeField form={form}/>
			{field}
			<NotesField form={form}/>
		</>
	)
}

export function MeasureFields({form}: { form: UseFormReturn<MeasureSchema> }) {
	return (
		<>
			<NameField form={form}/>
			<FrequencyTypeField form={form}/>
			<UnitField form={form}/>
			<TargetTypeField form={form}/>
			<TargetValueField form={form}/>
			<NotesField form={form}/>
		</>
	)
}

export function WaterFields({form}: { form: UseFormReturn<WaterSchema> }) {
	return (
		<>
			<NameField form={form}/>
			<TargetValueField form={form}/>
			<NotesField form={form}/>
		</>
	)
}

export function MealFields({form}: { form: UseFormReturn<MealSchema> }) {
	return (
		<>
			<NameField form={form}/>
			<TargetTypeField form={form}/>
			<TargetValueField form={form}/>
			<TargetDataUnitField form={form}/>
			<NotesField form={form}/>
		</>
	)
}


export function ActivityFields({form}: { form: UseFormReturn<ActivitySchema> }) {
	return (
		<>
			<NameField form={form}/>
			<FrequencyTypeField form={form}/>
			<TargetValueField form={form}/>
			<UnitField form={form}/>
			<NotesField form={form}/>
		</>
	)
}