import {type ControllerRenderProps, type FieldValues, type Path} from "react-hook-form";
import {Input} from "@/components/ui/input.tsx";
import {cn} from "@/lib/utils.ts";

export function NumberInput<T extends FieldValues, K extends Path<T>>({field, className, placeholder}: {
	field: ControllerRenderProps<T, K>,
	className?: string,
	placeholder?: string
}) {

	return (
		<Input
			{...field} placeholder={placeholder} type="text" onChange={(e) => {
			const sanitized = e.target.value.replace(/[^0-9]/g, "");
			field.onChange(sanitized === "" ? 0 : Number(sanitized));
		}}
			className={cn("[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none", className)}
			autoComplete={"off"}
		/>
	)
}