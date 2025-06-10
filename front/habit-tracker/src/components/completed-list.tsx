import {
	Card,
	CardContent, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card"
import {Button} from "@/components/ui/button.tsx";
import {useState} from "react";
import {Input} from "@/components/ui/input.tsx";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group.tsx";
import {RadioGroupIndicator} from "@radix-ui/react-radio-group";


type Item = {
	id: string
	name: string
	amount: number
	unit: string
}

// todo temporary
const data: Item[] = [
	{
		id: "akj",
		name: "medytacja",
		amount: 5,
		unit: "min"
	},
	{
		id: "askj",
		name: "medytacja",
		amount: 5,
		unit: "min"
	},
	{
		id: "lksaj",
		name: "medytacja",
		amount: 5,
		unit: "min"
	},
]

const formSchema = z.object({
	value: z.number(),
	date: z.date(),
})

function getLastDays(numberOfDays: number): Date[] {
	const list = [];
	for (let i = numberOfDays - 1; i >= 0; i--) {
		const date = new Date();
		date.setDate(date.getDate() - i);
		list.push(date);
	}

	return list;
}


export default function CompletionCard({numberOfDays = 7}: { numberOfDays?: number }) {
	const lastWeekDays = getLastDays(numberOfDays);
	const [dayIndex, setDayIndex] = useState(0);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			value: 0,
			date: lastWeekDays[0],
		},
		mode: "onChange",
	})

	function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values)
	}

	return (
		<Form {...form}>
			<form className="flex flex-1 flex-col" onSubmit={form.handleSubmit(onSubmit)}>
				<Card className="flex flex-1">

					<CardHeader>
						<CardTitle>Track your daily progress</CardTitle>
					</CardHeader>

					<CardContent>
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
                    }
                  }}
									defaultValue={lastWeekDays[0].toDateString()}
									className="w-full flex gap-6"
								>
									{
										lastWeekDays.map((day) => (
											<FormItem className="flex flex-row w-full h-full">
												<FormControl>
													<RadioGroupItem value={day.toDateString()}
													                key={day.getDate()}
													/>
												</FormControl>
												<FormLabel>
													{day.getDate().toString()}
												</FormLabel>
											</FormItem>
										))
									}
								</RadioGroup>
							)}
						/>
					</CardContent>
					<CardContent className="w-full h-full">
						<FormField
							control={form.control}
							name="value"
							render={({field}) => (
								<FormItem className="flex flex-row w-full h-full">
									<div className="flex h-full w-1/4 justify-center items-center">
										<Button variant="outline" className="aspect-square rounded-full"
										        onClick={() => form.setValue("value", Math.max(form.getValues().value - 1, 0))}>
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
												className="text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
											/>
										</FormControl>
										<FormMessage/>
									</FormItem>
									<div className="flex h-full w-1/4 justify-center items-center">
										<Button variant="outline" className="aspect-square rounded-full"
										        onClick={() => form.setValue("value", form.getValues().value + 1)}>
											<ChevronRight/>
										</Button>
									</div>
								</FormItem>
							)}
						/>
					</CardContent>
					<CardFooter className="gap-6">
						<FormControl>
							<Button className="flex-1 w-full" type="submit">Submit</Button>
						</FormControl>
						<FormControl>
							<Button className="flex-1 w-full" type="submit" variant="destructive">Delete</Button>
						</FormControl>
					</CardFooter>
				</Card>
			</form>
		</Form>
	)
}