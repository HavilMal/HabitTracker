import {Card, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormField, FormItem, FormLabel, FormControl, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useNavigate} from "@tanstack/react-router";
import {Select, SelectTrigger, SelectItem, SelectContent, SelectValue} from "@/components/ui/select.tsx";

const formSchema = z.object({
	name: z.string(),
	habit_type: z.string(),
	freq_type: z.string(),
	freq_value: z.number(),
	notes: z.string().optional(),
	unit: z.string().optional(),
	target_value: z.number().optional(),
	target_type: z.string().optional(),
})


type FormSchema = z.infer<typeof formSchema>

const boolFields: { name: keyof FormSchema, label: string, placeholder: string }[] = [
	{name: "name", label: "Name", placeholder: "name"},
	{name: "habit_type", label: "Habit type", placeholder: "type"},
	{name: "freq_type", label: "Frequency", placeholder: "frequency"},
	{name: "freq_value", label: "Frequency value", placeholder: "value"},
	{name: "notes", label: "Notes", placeholder: "notes"},
]

const measurementFields: { name: keyof FormSchema, label: string, placeholder: string }[] = boolFields.concat([
	{name: "unit", label: "Unit", placeholder: "unit"},
	{name: "target_type", label: "Target type", placeholder: "type"},
	{name: "target_value", label: "Target", placeholder: "value"},
])

// todo make them enums
function BoolHabitForm() {
	const navigate = useNavigate();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			habit_type: "bool"
		}
	});

	// todo navigate to previous page
	async function onSubmit(values: z.infer<typeof formSchema>) {
		await navigate({to: "/dashboard"})
	}

	let fields;
	switch (form.getValues("habit_type")) {
		case "bool":
			fields = boolFields;
			break;
		case "measurement":
			fields = measurementFields;
			break;
		default:
			fields = boolFields;
			break;
	}


	return (
		<Form {...form}>
			<form className="px-6 space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
				<Select>
					<SelectTrigger>
						<SelectValue placeholder="Type"/>
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="bool">Bool</SelectItem>
						<SelectItem value="measurement">Measurement</SelectItem>
					</SelectContent>
				</Select>
				<select>
					<
				</select>
				{
					fields.map(({name, label, placeholder}) => (
						<FormField
							key={name}
							control={form.control}
							name={name}
							render={({field}) => (
								<FormItem>
									<FormLabel>{label}</FormLabel>
									<FormControl>
										<Input placeholder={placeholder} {...field} />
									</FormControl>
									<FormMessage/>
								</FormItem>
							)}
						/>
					))
				}
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
	return (
		<Card>
			<CardHeader>
				<CardTitle>Add Habit</CardTitle>
			</CardHeader>
			<BoolHabitForm/>
		</Card>
	)
}