import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group.tsx";
import {Label} from "@/components/ui/label.tsx";

export function FormDatePicker({labels, dates, onChange, value}: {
	labels: string[]
	dates: string[],
	onChange: (date: string) => void,
	value: string,
}) {
	return (
		<RadioGroup
			onValueChange={val => onChange(val)}
			defaultValue={value}
			className="bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]"
		>
			{
				dates.map((day, i) => (
					<div key={i} className="flex flex-row w-full h-full">
						<RadioGroupItem value={day}
						                id={day}
						                className="peer sr-only"
						/>
						<Label
							htmlFor={day}
							className="peer-data-[state=checked]:bg-background dark:peer-data-[state=checked]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:peer-data-[state=checked]:border-primary dark:peer-data-[state=checked]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 peer-data-[state=checked]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
						>
							{labels[i]}
						</Label>
					</div>
				))
			}
		</RadioGroup>
	)
}

