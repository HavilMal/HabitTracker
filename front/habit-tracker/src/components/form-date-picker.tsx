import {FormField, FormItem, FormControl, FormLabel} from "@/components/ui/form.tsx";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group.tsx";
import type {FieldValues, UseFormReturn, Path} from "react-hook-form";

export function FormDatePicker<T extends FieldValues>({form, dateName, valueName, values, dates}: {
	form: UseFormReturn<T> ,
	dateName: Path<T>,
	valueName: Path<T>,
	dates: string[],
	values: Map<string, any>,
}) {
	return (
		<FormField
			control={form.control}
			name={dateName}
			render={({field}) => (
				<RadioGroup
					onValueChange={(stringValue) => {
						const selectedDate = dates.find(
							(day) => day === stringValue
						)
						if (selectedDate) {
							field.onChange(selectedDate)

							const newValue = values.get(selectedDate)

							if (newValue) {
								form.setValue(valueName, newValue)
							}
						}
					}}
					defaultValue={form.getValues(dateName)}
					className="bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]"
				>
					{
						dates.map((day, i) => (
							<FormItem className="flex flex-row w-full h-full">
								<FormControl>
									<RadioGroupItem value={day}
									                id={day}
									                key={i}
									                className="peer sr-only"
									/>
								</FormControl>
								<FormLabel
									htmlFor={day}
									className="peer-data-[state=checked]:bg-background dark:peer-data-[state=checked]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:peer-data-[state=checked]:border-input dark:peer-data-[state=checked]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 peer-data-[state=checked]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
								>
									{day.split("-")[2]}
								</FormLabel>
							</FormItem>
						))
					}
				</RadioGroup>
			)}
	 />
	)
}

