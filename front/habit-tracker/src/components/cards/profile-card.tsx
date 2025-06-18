import {Form, FormField, FormItem, FormLabel, FormControl, FormMessage,} from "@/components/ui/form.tsx";
import {Card, CardHeader, CardTitle, CardContent, CardFooter} from "@/components/ui/card.tsx";
import {z} from "zod";
import {
	useForm,
	type UseFormReturn
} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/components/ui/button.tsx";
import {NumberInput} from "@/components/number-form-input.tsx";
import {SelectTrigger, SelectItem, SelectContent, SelectValue, Select} from "@/components/ui/select.tsx";

const formSchema = z.object({
	sex: z.enum(["male", "female"]),
	age: z.number(),
	weight: z.number(),
	height: z.number(),
})

type FormSchema = z.infer<typeof formSchema>;


function ProfileAttribute({description, fieldName, form}: {
	description: string,
	fieldName: keyof FormSchema,
	form: UseFormReturn<FormSchema>,
}) {
	return (
		<FormField
			control={form.control}
			name={fieldName}
			render={({field}) => (
				<FormItem className="flex flex-row gap-6">
					<FormLabel className="w-1/10">{description}</FormLabel>
					<FormControl className="w-9/10">
						<NumberInput field={field} placeholder={description}/>
					</FormControl>
					<FormMessage/>
				</FormItem>
			)}
		/>
	)
}

export function ProfileCard() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			sex: "male",
			age: 18,
			weight: 70,
			height: 170,
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values)
	}

	return (
		<div className="flex flex-col gap-6">
			<Card>
				<CardHeader>
					<CardTitle className="flex flex-row">
						<h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
							Username
						</h3>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-8">
							<FormField
								control={form.control}
								name={"sex"}
								render={({field}) => (
									<FormItem className="flex flex-row gap-6">
										<FormLabel className="w-1/10">Sex</FormLabel>
										<Select
											onValueChange={(value: FormSchema["sex"]) => {
												field.onChange(value);
											}}
											value={field.value}>
											<FormControl className="w-9/10">
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Select the type of target"/>
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="male">Male</SelectItem>
												<SelectItem value="female">Female</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage/>
									</FormItem>
								)}
							/>
							<ProfileAttribute description={"Age"} fieldName={"age"} form={form}/>
							<ProfileAttribute description={"Weight"} fieldName={"weight"} form={form}/>
							<ProfileAttribute description={"Height"} fieldName={"height"} form={form}/>
							<FormControl>
								<Button variant="outline" className="ml-auto" onClick={form.handleSubmit(onSubmit)}>
									Save changes
								</Button>
							</FormControl>
						</form>
					</Form>
				</CardContent>
				<CardFooter>
				</CardFooter>
			</Card>
		</div>

	)
}